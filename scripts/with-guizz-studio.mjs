import net from 'node:net';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const studioRoot = process.env.GUIZZ_STUDIO_ROOT || 'D:\\DOWN\\mcstructure certo\\3dvilw-slim';
const studioEntry = resolve(studioRoot, 'server.mjs');
const guideRoot = process.env.GUIZZ_GUIDE_ROOT || 'D:\\DOWN\\mcstructure certo\\guizz-schem-guide';
const guideEntry = resolve(guideRoot, 'server.mjs');
const nextEntry = resolve(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
const nextArguments = process.argv.slice(2);

if (!nextArguments.length) throw new Error('Informe o comando Next a executar.');
if (!existsSync(studioEntry)) {
  throw new Error(`Guizz Studio não encontrado em ${studioRoot}. Defina GUIZZ_STUDIO_ROOT para a pasta que contém server.mjs.`);
}

function studioIsAlreadyRunning() {
  return new Promise((resolveRunning) => {
    const socket = net.createConnection({ host: '127.0.0.1', port: 5175 });
    const finish = (value) => { socket.destroy(); resolveRunning(value); };
    socket.once('connect', () => finish(true));
    socket.once('error', () => finish(false));
    socket.setTimeout(500, () => finish(false));
  });
}

function guideIsAlreadyRunning() {
  return new Promise((resolveRunning) => {
    const socket = net.createConnection({ host: '127.0.0.1', port: 5180 });
    const finish = (value) => { socket.destroy(); resolveRunning(value); };
    socket.once('connect', () => finish(true));
    socket.once('error', () => finish(false));
    socket.setTimeout(500, () => finish(false));
  });
}

const children = new Set();
let stopping = false;
let studioChild;
let studioWatchdog;

const track = (child) => {
  children.add(child);
  child.once('exit', () => children.delete(child));
  return child;
};
const childIsRunning = (child) => Boolean(child && !child.killed && child.exitCode === null);
const stop = () => {
  stopping = true;
  if (studioWatchdog) clearInterval(studioWatchdog);
  children.forEach((child) => { if (!child.killed) child.kill('SIGTERM'); });
};
process.once('SIGINT', stop);
process.once('SIGTERM', stop);

function launchStudio() {
  if (childIsRunning(studioChild)) return;
  const studio = track(spawn(process.execPath, [studioEntry], {
    cwd: studioRoot,
    env: { ...process.env, PORT: '5175' },
    stdio: 'inherit',
  }));
  studioChild = studio;
  studio.once('exit', () => {
    if (studioChild === studio) studioChild = undefined;
  });
}

async function ensureStudio() {
  if (stopping || await studioIsAlreadyRunning()) return;
  launchStudio();
}

await ensureStudio();
// The original Studio may finish a stale process just as the site is opening.
// Keep this local dependency alive so the hidden publisher never waits forever.
studioWatchdog = setInterval(() => { void ensureStudio(); }, 1500);

if (existsSync(guideEntry) && !await guideIsAlreadyRunning()) {
  track(spawn(process.execPath, [guideEntry], {
    cwd: guideRoot,
    env: { ...process.env, PORT: '5180', GUIZZ_EXTERNAL_STUDIO: '1' },
    stdio: 'inherit',
  }));
}

const next = spawn(process.execPath, [nextEntry, ...nextArguments], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});
track(next);
next.once('exit', (code) => { stop(); process.exit(code ?? 0); });
