import { ChatMessage } from './types';

export async function callGemini(args: { apiKey?: string; model: string; messages: ChatMessage[]; imageDataUrl?: string, signal?: AbortSignal }) {
  const endpoint = args.model === 'gemini-2.5-pro' ? '/api/gemini-pro' : '/api/gemini';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal: args.signal,
  });
  return res.json();
}

export async function callOpenRouter(args: { apiKey?: string; model: string; messages: ChatMessage[]; imageDataUrl?: string, signal?: AbortSignal }) {
  const res = await fetch('/api/openrouter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...args, referer: typeof window !== 'undefined' ? window.location.origin : undefined, title: 'AI Fiesta' }),
    signal: args.signal,
  });
  return res.json();
}

export type ORStreamHandlers = {
  onToken: (chunk: string) => void;
  onMeta?: (meta: { provider?: string; usedKeyType?: 'user' | 'shared' | 'none' }) => void;
  onError?: (err: { error?: string; code?: number; provider?: string; usedKeyType?: 'user' | 'shared' | 'none' }) => void;
  onDone?: () => void;
};

export async function streamOpenRouter(args: { apiKey?: string; model: string; messages: ChatMessage[]; imageDataUrl?: string, signal?: AbortSignal }, handlers: ORStreamHandlers) {
  try {
    const res = await fetch('/api/openrouter/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...args, referer: typeof window !== 'undefined' ? window.location.origin : undefined, title: 'AI Fiesta' }),
      signal: args.signal,
    });
    if (!res.body) {
      handlers.onError?.({ error: 'No stream body', code: res.status, provider: 'openrouter' });
      handlers.onDone?.();
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const pump = async (): Promise<void> => {
      const { value, done } = await reader.read();
      if (done) {
        handlers.onDone?.();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') {
          handlers.onDone?.();
          return;
        }
        try {
          const json = JSON.parse(payload);
          if (typeof json?.delta === 'string' && json.delta) handlers.onToken(json.delta);
          if (json?.provider || json?.usedKeyType) handlers.onMeta?.(json);
          if (json?.error) handlers.onError?.({ error: json.error, code: json.code, provider: json.provider, usedKeyType: json.usedKeyType });
        } catch {
          // ignore individual event parse errors
        }
      }
      return pump();
    };
    await pump();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      // Abort is expected, no need to show an error.
      handlers.onDone?.();
      return;
    }
    const e = err as Error | undefined;
    handlers.onError?.({ error: e?.message || 'Stream failed', provider: 'openrouter' });
    handlers.onDone?.();
  }
}
