// Usage: node tests/catalog-permissions.mjs <absolute path to pglite/dist/index.js>
// Runs only in an isolated in-memory database, never against Supabase.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
try {
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    grant usage on schema public to anon, authenticated, service_role;
    create table public.mods (
      id text primary key, title text, author text, category text, subcategory text,
      description text, version text, file_size text, price text,
      youtube_trailer_url text, image_url_1 text, image_url_2 text,
      image_url_3 text, image_url_4 text, image_url_5 text, downloads integer, rating numeric,
      created_at timestamptz, terabox_url text, private_note text
    );
    grant all on public.mods to anon, authenticated, service_role;
    insert into public.mods (id, title, version, category, terabox_url)
    values ('first', 'First release', '1.0.8', 'mash-up', 'https://1024terabox.com/s/private');
  `);
  for (const file of ['20260830_01_create_public_mods_view.sql', '20260830_02_lock_private_mods.sql', '20260906_03_public_catalog_invoker.sql']) {
    await db.exec(await readFile(new URL(`../supabase/migrations/${file}`, import.meta.url), 'utf8'));
  }
  await db.exec(await readFile(new URL('../supabase/migrations/20260920_08_minecraft_marketplace_metadata.sql', import.meta.url), 'utf8'));
  await db.exec(`
    set role service_role;
    update public.mods
    set source_creator = 'Marketplace Studio',
        source_tags = '["Textures", "Cars"]'::jsonb,
        source_published_at = '2026-09-20T12:00:00Z'
    where id = 'first';
    reset role;
  `);
  // Simulate an old column grant: the migration must remove it as well.
  await db.exec('grant select (terabox_url), update (title) on public.mods to authenticated');
  const migration = await readFile(new URL('../supabase/migrations/20260906_03_public_catalog_invoker.sql', import.meta.url), 'utf8');
  await db.exec(migration);
  await db.exec(migration); // Safe to re-run.
  const galleryMigration = await readFile(new URL('../supabase/migrations/20260921_09_catalog_gallery_image_5.sql', import.meta.url), 'utf8');
  await db.exec(galleryMigration);
  await db.exec(galleryMigration); // Safe to re-run after the historical grant migration.
  for (const role of ['anon', 'authenticated']) {
    await db.exec(`set role ${role}`);
    const result = await db.query('select * from public.public_mods');
    assert.equal(result.rows.length, 1);
    assert.equal(result.rows[0].version, '1.0.8');
    assert.equal(result.rows[0].category, 'mash-up');
    assert.equal(result.rows[0].image_url_5, null);
    assert.equal('terabox_url' in result.rows[0], false);
    for (const sql of [
      'select terabox_url from public.mods', 'select private_note from public.mods',
      'select source_creator from public.mods', 'select source_tags from public.mods',
      'select source_published_at from public.mods',
      'select * from public.mods', "insert into public.mods (id) values ('attack')",
      "update public.mods set title = 'attack'", 'delete from public.mods',
      "update public.public_mods set title = 'attack'",
    ]) await assert.rejects(db.query(sql), /permission denied/);
    await db.exec('reset role');
  }
  await db.exec('set role service_role');
  assert.equal((await db.query('select terabox_url from public.mods')).rows.length, 1);
  const privateMetadata = await db.query('select source_creator, source_tags, source_published_at from public.mods where id = \'first\'');
  assert.equal(privateMetadata.rows[0].source_creator, 'Marketplace Studio');
  assert.deepEqual(privateMetadata.rows[0].source_tags, ['Textures', 'Cars']);
  assert.equal(privateMetadata.rows[0].source_published_at.toISOString(), '2026-09-20T12:00:00.000Z');
  await db.exec("insert into public.mods (id, version) values ('second', 'beta'); update public.mods set downloads = 1 where id = 'first'");
  await db.exec('reset role; set role anon');
  assert.equal((await db.query('select * from public.public_mods')).rows.length, 2);
  console.log('PASS: migration syntax, repeatability, public reads, private-column denial, write denial and server writes.');
} finally {
  await db.close();
}
