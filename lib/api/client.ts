const DEFAULT_TIMEOUT = 90_000;
const MAX_RETRIES = 2;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit & { timeout?: number; retries?: number },
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, retries = MAX_RETRIES, ...init } = options ?? {};
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new ApiError(res.status, `${res.status}: ${body.slice(0, 200)}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      clearTimeout(timer);
      lastError = err as Error;

      // Don't retry client errors (4xx)
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) throw err;
      // Don't retry if aborted by user
      if ((err as Error).name === "AbortError" && attempt === retries) throw err;

      // Wait before retry
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error("Request failed");
}

export async function apiStream(
  url: string,
  body: unknown,
  onProgress: (data: Record<string, unknown>) => void,
  onComplete: (data: Record<string, unknown>) => void,
  onError: (err: Error) => void,
) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, `${res.status}: ${text.slice(0, 200)}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (!json) continue;

        try {
          const parsed = JSON.parse(json);
          if (parsed.type === "complete" || parsed.result) {
            onComplete(parsed.result ?? parsed);
          } else {
            onProgress(parsed);
          }
        } catch {
          // skip malformed lines
        }
      }
    }
  } catch (err) {
    onError(err as Error);
  }
}
