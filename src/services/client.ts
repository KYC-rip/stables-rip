const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.kyc.rip';

export async function api<T>(path: string, timeout = 15000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as T;
  } finally {
    clearTimeout(timer);
  }
}
