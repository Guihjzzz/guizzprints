// Isolated UI lifecycle verification; no real emails, OAuth redirects or vendor scripts.
// node tests/auth-ui.mjs <temporary node_modules containing react + react-test-renderer>
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const deps = process.argv[2];
const React = require(path.join(deps, 'react'));
const { create, act } = require(path.join(deps, 'react-test-renderer'));
global.IS_REACT_ACT_ENVIRONMENT = true;
const messages = JSON.parse(readFileSync('src/messages/pt.json', 'utf8')).Auth;
const t = (key, values) => messages[key]?.replace('{seconds}', String(values?.seconds)) ?? key;
const localeModules = { '@/i18n/routing': { defaultLocale: 'en', isAppLocale: value => ['en', 'pt', 'es'].includes(value) },
  'next/navigation': { useParams: () => ({ locale: 'pt' }), useSearchParams: () => new URLSearchParams('next=%2Fpt%2Fvip%3Fplan%3Dweekly') },
  'next-intl': { useTranslations: () => t },
  'lucide-react': Object.fromEntries(['Mail', 'Lock', 'LogIn', 'UserPlus', 'ArrowLeft', 'Loader2', 'AtSign', 'KeyRound', 'Save'].map(name => [name, () => null])) };
function load(file, modules, globals = {}) {
  const exports = {};
  const source = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  new Function('require', 'exports', ...Object.keys(globals), source)(name => {
    if (name === 'react') return React;
    if (name === 'react/jsx-runtime') return require(path.join(deps, 'react/jsx-runtime'));
    if (!(name in modules)) throw new Error(`Unexpected module ${name}`);
    return modules[name];
  }, exports, ...Object.values(globals));
  return exports;
}
const actions = load('src/lib/auth-actions.ts', { './auth-return': load('src/lib/auth-return.ts', {}) });
const returns = load('src/lib/auth-return.ts', {});

// Password update must not race initial server verification.
let resolveUser, users = 0, updates = 0;
const initialUser = new Promise(resolve => { resolveUser = resolve; });
const passwordPage = load('src/app/[locale]/login/update-password/page.tsx', { ...localeModules,
  '@/lib/auth-return': returns, '@/lib/auth-actions': actions,
  '@/lib/supabase': { supabase: { auth: {
    getUser: async () => { users++; return users === 1 ? initialUser : { data: { user: null }, error: null }; },
    updateUser: async () => { updates++; return { error: null }; },
  } } },
});
global.window = { location: { search: '?next=%2Fpt%2Fvip%3Fplan%3Dweekly', assign: () => { throw Error('Unexpected navigation'); } } };
let passwordTree;
await act(async () => { passwordTree = create(React.createElement(passwordPage.default)); });
assert.ok(passwordTree.root.findAllByType('input').every(node => node.props.disabled));
assert.equal(passwordTree.root.findByProps({ type: 'submit' }).props.disabled, true);
await act(async () => { resolveUser({ data: { user: { id: 'fixture' } }, error: null }); });
assert.equal(passwordTree.root.findAllByType('input').length, 2);
assert.ok(passwordTree.root.findAllByType('input').every(node => !node.props.disabled));
const preventDefault = () => {};
await act(async () => {
  passwordTree.root.findByProps({ id: 'new-password' }).props.onChange({ target: { value: 'fixture-password' } });
  passwordTree.root.findByProps({ id: 'confirm-password' }).props.onChange({ target: { value: 'not-matching' } });
});
await act(async () => { await passwordTree.root.findByType('form').props.onSubmit({ preventDefault }); });
assert.equal(users, 1, 'Mismatched passwords do not contact Auth');
assert.equal(updates, 0);
await act(async () => { passwordTree.root.findByProps({ id: 'confirm-password' }).props.onChange({ target: { value: 'fixture-password' } }); });
await act(async () => { await passwordTree.root.findByType('form').props.onSubmit({ preventDefault }); });
assert.equal(users, 2, 'Revalidate session on submission');
assert.equal(updates, 0, 'Expired session cannot update password');
assert.match(passwordTree.root.findByType('a').props.href, /mode=reset&next=%2Fpt%2Fvip%3Fplan%3Dweekly/);
await act(async () => passwordTree.unmount());

// Single-use captcha is recreated after requests; late callbacks cannot revive removed widgets.
let widgetOptions, renders = 0, removes = 0;
const tokens = [];
global.window = { turnstile: {
  render: (_element, options) => { renders++; widgetOptions = options; return `widget-${renders}`; },
  remove: () => { removes++; },
} };
const captcha = load('src/components/AuthCaptcha.tsx', { 'next/script': { __esModule: true, default: () => null } });
const props = { siteKey: 'fake-public-key', locale: 'pt', resetKey: 0, onToken: token => tokens.push(token), unavailable: 'unavailable', retry: 'retry' };
let captchaTree;
await act(async () => { captchaTree = create(React.createElement(captcha.default, props), {
  createNodeMock: node => node.type === 'div' ? { clientWidth: 280 } : null,
}); });
const script = captchaTree.root.findAll(node => node.props.id === 'auth-turnstile')[0];
await act(async () => script.props.onReady());
assert.equal(renders, 1); assert.equal(widgetOptions.size, 'compact');
assert.equal(widgetOptions.sitekey, props.siteKey);
await act(async () => widgetOptions.callback('fixture-token'));
assert.equal(tokens.at(-1), 'fixture-token');
await act(async () => widgetOptions['expired-callback']());
assert.equal(tokens.at(-1), '');
const stale = widgetOptions;
await act(async () => captchaTree.update(React.createElement(captcha.default, { ...props, resetKey: 1 })));
assert.equal(removes, 1); assert.equal(renders, 2);
stale.callback('stale-token');
assert.equal(tokens.at(-1), '', 'Removed widget cannot reintroduce an old token');
await act(async () => widgetOptions['error-callback']());
assert.equal(tokens.at(-1), '');
assert.equal(captchaTree.root.findByProps({ role: 'alert' }).findByType('p').children[0], 'unavailable');
await act(async () => captchaTree.root.findByType('button').props.onClick());
assert.equal(renders, 3); assert.equal(removes, 2);
await act(async () => captchaTree.unmount());
assert.equal(removes, 3);

// Duplicate clicks and mode switching must not send multiple confirmation/reset emails.
let emailCalls = 0, resolveEmail, clock = 100000, tick, cleared = 0;
const pendingEmail = new Promise(resolve => { resolveEmail = resolve; });
const loginPage = load('src/app/[locale]/login/page.tsx', { ...localeModules,
  '@/lib/auth-return': returns,
  '@/lib/auth-actions': { ...actions,
    submitEmailAuth: async () => { emailCalls++; return pendingEmail; },
    resendConfirmation: async () => { emailCalls++; return { key: 'confirmationSent', success: true }; },
  },
  '@/components/AuthCaptcha': { __esModule: true, default: () => null },
  '@/lib/supabase': { supabase: { auth: {} } },
}, { process: { env: {} }, Date: { now: () => clock },
  setInterval: callback => { tick = callback; return 1; }, clearInterval: () => { cleared++; } });
global.window = { location: { origin: 'https://www.example.test', search: '?next=%2Fpt%2Fvip%3Fplan%3Dweekly',
  assign: () => { throw Error('Unexpected navigation'); } } };
let loginTree;
await act(async () => { loginTree = create(React.createElement(loginPage.default)); });
const button = text => loginTree.root.findAllByType('button').find(node => node.children.includes(text));
await act(async () => button(messages.needAccount).props.onClick());
await act(async () => {
  loginTree.root.findByProps({ id: 'auth-email' }).props.onChange({ target: { value: 'owner@example.test' } });
});
await act(async () => loginTree.root.findByProps({ id: 'auth-username' }).props.onChange({ target: { value: 'Player' } }));
await act(async () => loginTree.root.findByProps({ id: 'auth-password' }).props.onChange({ target: { value: 'fixture-password' } }));
await act(async () => {
  const submit = loginTree.root.findByType('form').props.onSubmit;
  submit({ preventDefault }); submit({ preventDefault });
});
assert.equal(emailCalls, 1, 'In-flight duplicate submit guard');
assert.equal(loginTree.root.findByProps({ type: 'submit' }).props.disabled, true);
await act(async () => resolveEmail({ key: 'confirmationSent', success: true, confirmation: true }));
assert.equal(loginTree.root.findByProps({ type: 'submit' }).props.disabled, true, 'Email cooldown persists after successful attempt');
await act(async () => button(messages.haveAccount).props.onClick());
await act(async () => button(messages.forgotPassword).props.onClick());
assert.equal(loginTree.root.findByProps({ type: 'submit' }).props.disabled, true, 'Reset cannot bypass signup cooldown for same email');
await act(async () => loginTree.root.findByType('form').props.onSubmit({ preventDefault }));
assert.equal(emailCalls, 1);
await act(async () => { clock += 61000; tick(); });
assert.equal(loginTree.root.findByProps({ type: 'submit' }).props.disabled, false);
await act(async () => loginTree.unmount());
assert.equal(cleared, 1, 'Countdown timer cleaned up');
console.log('PASS auth UI: session guard, password matching/revalidation, VIP recovery, CAPTCHA expiry/retry/cleanup, duplicate submit and email cooldown');
