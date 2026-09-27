// Isolated UI lifecycle test: no vendor ads, Supabase writes or real downloads.
// node tests/download-flow.mjs <temporary react-test-renderer node_modules>
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const deps = process.argv[2];
const React = require(path.join(deps, 'react'));
const {create, act} = require(path.join(deps, 'react-test-renderer'));
global.IS_REACT_ACT_ENVIRONMENT = true;
let timerId = 0;
const timers = new Map();
global.setTimeout = (callback, delay) => { timers.set(++timerId, {callback,at:Date.now()+delay}); return timerId; };
global.clearTimeout = id => timers.delete(id);
let destination, requests = 0, ok = true, keyHandler, restored = false;
global.window = {scrollY: 420, scrollTo: (_x,y) => { assert.equal(y,420); }, location: {assign: url => { destination = url; }}};
global.document = {body: {style: {cssText:'original'}}, activeElement: {focus: () => {restored=true;}}, addEventListener: (_name,handler) => {keyHandler=handler;}, removeEventListener: () => {keyHandler=null;}};
let now = 1_000_000;
Date.now = () => now;
global.fetch = async (_url, options) => { requests++; assert.equal(options.credentials,'same-origin'); if(options.body) assert.deepEqual(JSON.parse(options.body),{modId:'test-id'}); return {ok, json:async()=>({readyAt:now+20000,expiresAt:now+600000,serverTime:now})}; };
const compiled = {};
const code = ts.transpileModule(readFileSync('src/components/DownloadFlow.tsx','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
new Function('require','exports',code)(name => {
  if(name==='react') return React;
  if(name==='react/jsx-runtime') return require(path.join(deps,'react/jsx-runtime'));
  if(name==='react-dom') return {createPortal: children => children};
  if(name==='next-intl') return {useTranslations:()=>key=>key};
  if(name==='next/image') return {__esModule:true,default:'img'};
  if(name==='lucide-react') return new Proxy({}, {get:()=> 'svg'});
  if(name==='@/lib/supabase') return { supabase: { auth: { getSession: async () => ({ data: { session: null } }) } } };
  if(name==='@/components/DownloadFlowView') return {__esModule:true,default:props=>React.createElement('section',null,
    React.createElement('h2',null,props.showFinalModal?props.modTitle:`step${props.step}Title`),
    React.createElement('aside',{'data-format':'download-banner'}),React.createElement('aside',{'data-format':'download-banner'}),
    !props.showFinalModal && React.createElement('aside',{'data-format':'rectangle'}),
    React.createElement('button',{onClick:props.cancel},'cancel'),
    !props.showFinalModal && React.createElement('button',{onClick:props.advance,disabled:props.stepTimer>0},'Skip'))};
  throw Error(name);
},compiled);
let tree;
await act(async()=> {tree=create(React.createElement(compiled.default,{modId:'test-id',modTitle:'Test mod',modImage:'/logo.jpg'}));});
const buttons = () => tree.root.findAllByType('button');
const dialog = () => tree.root.findAllByProps({role:'dialog'});
const click = async button => act(async()=>{await button.props.onClick();});
async function tick(n){for(let i=0;i<n;i++)await act(async()=>{now+=1000;for(const [id,timer] of [...timers])if(timer.at<=now){timers.delete(id);timer.callback();}});}
ok=false; await click(buttons()[0]); assert.equal(dialog().length,0); assert.equal(tree.root.findAllByProps({role:'alert'}).length,1);
ok=true; await click(buttons()[0]); assert.equal(dialog().length,1);
assert.equal(tree.root.findAllByProps({'data-format':'download-banner'}).length,2);
assert.equal(tree.root.findAllByProps({'data-format':'rectangle'}).length,1);
for(let step=1;step<=3;step++){
  const next=buttons().at(-1); assert.ok(next.props.disabled);
  await click(next); assert.equal(tree.root.findByType('h2').children[0],`step${step}Title`);
  await tick(8); assert.equal(buttons().at(-1).props.disabled,false); await click(buttons().at(-1));
}
assert.equal(dialog().length,0); assert.ok(restored); assert.equal(document.body.style.cssText,'original');
await click(buttons()[0]); assert.equal(tree.root.findByType('h2').children[0],'Test mod');
assert.equal(tree.root.findAllByProps({'data-format':'download-banner'}).length,2);
await tick(2); await click(buttons().at(-1)); await tick(10); assert.equal(destination,undefined,'Cancel prevents redirect');
await click(buttons()[0]); await tick(4); assert.equal(destination,undefined); await tick(1);
assert.equal(destination,'/api/download/open?mod=test-id');
await click(buttons().at(-1));
now += 600000;
await click(buttons()[0]);
assert.equal(dialog().length,0,'Expired authorization does not open final modal');
assert.equal(tree.root.findAllByProps({role:'alert'}).length,1);
const goodFetch = global.fetch;
global.fetch = async (_url, options) => new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('timeout'))));
let pending;
await act(async()=>{pending=buttons()[0].props.onClick();});
assert.equal(buttons()[0].props.disabled,true);
await tick(15); await pending;
assert.equal(buttons()[0].props.disabled,false,'Timed out preparation permits retry');
global.fetch = goodFetch;
await click(buttons()[0]);
assert.equal(dialog().length,1,'Retry works after timeout');
await act(async()=>tree.unmount()); assert.equal(timers.size,0);
assert.equal(keyHandler,null); assert.equal(requests,4);
console.log('PASS: failure/retry, 3×8 second gates, final preview, cancel, restart, same-tab redirect, expiry, timeout and cleanup. View rendering tested separately.');
