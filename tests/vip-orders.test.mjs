// Isolated order-persistence checks: no Supabase connection or provider calls.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

function loadOrders() {
  const exports = {};
  const code = ts.transpileModule(readFileSync('src/lib/vip-orders.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'exports', code)(name => {
    if (name === 'server-only') return {};
    throw new Error(`Unexpected dependency: ${name}`);
  }, exports);
  return exports;
}

function database() {
  const rows = [];
  let nextId = 1;
  let enforceOpenUnique = true;
  function builder() {
    const filters = {};
    let statuses;
    return {
      insert: async row => {
        if (enforceOpenUnique && rows.some(existing =>
          existing.user_id === row.user_id
          && existing.plan_id === row.plan_id
          && existing.dev_mode === row.dev_mode
          && ['pending', 'checkout_created'].includes(existing.status)
          && ['pending', 'checkout_created'].includes(row.status))) {
          return { error: { code: '23505' } };
        }
        rows.push({ ...row, id: `order-${nextId++}` });
        return { error: null };
      },
      select() { return this; },
      eq(field, value) { filters[field] = value; return this; },
      in(field, values) { if (field === 'status') statuses = values; return this; },
      limit() { return this; },
      maybeSingle: async () => ({
        data: rows.find(row => row.user_id === filters.user_id
          && row.plan_id === filters.plan_id
          && row.dev_mode === filters.dev_mode
          && (!statuses || statuses.includes(row.status))) ?? null,
        error: null,
      }),
    };
  }
  return {
    rows,
    setUnique(value) { enforceOpenUnique = value; },
    from(table) {
      assert.equal(table, 'vip_orders');
      return builder();
    },
  };
}

const orders = loadOrders();
const draft = {
  userId: 'user-1', planId: 'monthly', productId: 'mp_monthly',
  priceCents: 1990, days: 30, externalId: 'guizz-mp-test-one', devMode: true,
};

test('concurrent duplicate attempts keep one open order and report the other explicitly', async () => {
  const db = database();
  const results = await Promise.allSettled([
    orders.createVipOrder(db, draft),
    orders.createVipOrder(db, { ...draft, externalId: 'guizz-mp-test-two' }),
  ]);
  assert.equal(db.rows.length, 1);
  assert.equal(results.filter(result => result.status === 'fulfilled' && result.value === true).length, 1);
  const rejected = results.find(result => result.status === 'rejected');
  assert.equal(rejected?.reason instanceof orders.VipOrderPendingError, true);
  assert.equal(rejected?.reason.externalId, 'guizz-mp-test-one');
  assert.equal(db.rows[0].external_id, 'guizz-mp-test-one');
});

test('an unrelated unique failure remains an unavailable-order error', async () => {
  const db = database();
  db.setUnique(false);
  const originalFrom = db.from;
  db.from = table => {
    const builder = originalFrom.call(db, table);
    builder.insert = async () => ({ error: { code: '23505' } });
    return builder;
  };
  await assert.rejects(orders.createVipOrder(db, draft), { message: 'vip_order_unavailable' });
  assert.equal(db.rows.length, 0);
});

test('sandbox and live orders do not block each other', async () => {
  const db = database();
  await orders.createVipOrder(db, draft);
  await orders.createVipOrder(db, { ...draft, devMode: false, externalId: 'guizz-mp-live-one' });
  assert.equal(db.rows.length, 2);
});

test('the migration only blocks pending and checkout-created orders', () => {
  const sql = readFileSync('supabase/migrations/20260917_01_prevent_duplicate_vip_orders.sql', 'utf8');
  assert.match(sql, /create unique index if not exists vip_orders_one_open_plan_idx/i);
  assert.match(sql, /on public\.vip_orders \(user_id, plan_id, dev_mode\)/i);
  assert.match(sql, /where status in \('pending', 'checkout_created'\)/i);
});
