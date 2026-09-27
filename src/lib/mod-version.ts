// The presentation prefix is fixed; only the release identifier is stored.
export function normalizeModVersion(value: string) {
  return value.trim().replace(/^(?:#\s*v\s*|v(?=\d))/i, '');
}

export function validateModVersion(value: string) {
  const version = normalizeModVersion(value);
  if (!/^[A-Za-z0-9][A-Za-z0-9.+-]{0,49}$/.test(version)) {
    throw new Error('Version must contain 1–50 letters, numbers, dots, hyphens or plus signs.');
  }
  return version;
}
