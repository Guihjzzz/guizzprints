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

const children = [];
const stop = () => children.forEach((child) => { if (!child.killed) child.kill('SIGTERM'); });
process.once('SIGINT', stop);
process.once('SIGTERM', stop);

if (!await studioIsAlreadyRunning()) {
  const studio = spawn(process.execPath, [studioEntry], {
    cwd: studioRoot,
    env: { ...process.env, PORT: '5175' },
    stdio: 'inherit',
  });
  children.push(studio);
  studio.once('exit', (code) => { if (code && !process.exitCode) process.exitCode = code; });
}

if (existsSync(guideEntry) && !await guideIsAlreadyRunning()) {
  const guide = spawn(process.execPath, [guideEntry], {
    cwd: guideRoot,
    env: { ...process.env, PORT: '5180', GUIZZ_EXTERNAL_STUDIO: '1' },
    stdio: 'inherit',
  });
  children.push(guide);
  guide.once('exit', (code) => { if (code && !process.exitCode) process.exitCode = code; });
}

const next = spawn(process.execPath, [nextEntry, ...nextArguments], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});
children.push(next);
next.once('exit', (code) => { stop(); process.exit(code ?? 0); });
