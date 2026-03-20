import { NextRequest } from "next/server";

const ECG_URL = process.env.ECG_SERVICE_URL ?? "http://localhost:8003";

export async function POST(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") ?? "";
  const body = await req.text();
  const isStream = path.endsWith("-stream");

  const upstream = await fetch(`${ECG_URL}/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": isStream
        ? "text/event-stream"
        : upstream.headers.get("Content-Type") ?? "application/json",
      ...(isStream && {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      }),
    },
  });
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") ?? "health";

  try {
    const res = await fetch(`${ECG_URL}/api/${path}`, {
      next: { revalidate: 0 },
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
