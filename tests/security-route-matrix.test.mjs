import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import test from 'node:test';

const projectRoot = process.cwd();
const apiRoot = join(projectRoot, 'src', 'app', 'api');
const matrixPath = join(projectRoot, 'docs', 'SECURITY_ROUTE_MATRIX.md');

function routeFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return routeFiles(path);
    return entry.name === 'route.ts' ? [path] : [];
  });
}

function routePath(file) {
  const rel = relative(join(projectRoot, 'src', 'app'), file)
    .split(sep).join('/').replace(/\/route\.ts$/u, '');
  return `/${rel}`;
}

const routes = routeFiles(apiRoot).map(file => ({
  file,
  path: routePath(file),
  source: readFileSync(file, 'utf8'),
}));
const matrix = readFileSync(matrixPath, 'utf8');

test('every API route is represented in the security matrix', () => {
  for (const route of routes) {
    assert.ok(matrix.includes(`| \`${route.path}`),
      `${route.path} is missing from docs/SECURITY_ROUTE_MATRIX.md`);
  }
});

test('every API route exports a handler and disables caching', () => {
  for (const route of routes) {
    assert.match(route.source, /export (?:async )?function (?:GET|POST|PUT|DELETE|PATCH)/u,
      `${route.path} has no exported HTTP handler`);
    assert.match(route.source, /Cache-Control['"`][^\n]*no-store/u,
      `${route.path} must keep sensitive API responses cache-free`);
  }
});

console.log(`PASS: ${routes.length} API routes are documented and cache-free.`);
