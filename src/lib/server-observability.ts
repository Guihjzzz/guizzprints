/**
 * Keep server diagnostics useful without allowing user/provider data into logs.
 * Callers pass fixed stage/code labels; labels are sanitized again as defense
 * in depth before reaching the hosting provider's log stream.
 */
function safeLabel(value: string): string {
  return value.replace(/[^a-z0-9_-]/gi, '_').slice(0, 40) || 'unknown';
}

export function logServerFailure(scope: string, stage: string, code: string): void {
  console.error(`[${safeLabel(scope)}]`, {
    stage: safeLabel(stage),
    code: safeLabel(code),
  });
}
