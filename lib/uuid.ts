// Safe UUID generator: uses crypto.randomUUID when available, otherwise falls back to a simple v4 implementation
export function safeUUID(): string {
  // Prefer globalThis.crypto.randomUUID when present (browser or Node >=19)
  const g = globalThis as unknown as { crypto?: { randomUUID?: () => string } };
  const rnd = g.crypto?.randomUUID;
  if (typeof rnd === 'function') {
    try { return rnd(); } catch { /* ignore and fall through */ }
  }
  // Fallback (not cryptographically strong)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
