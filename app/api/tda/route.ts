import { NextRequest } from "next/server";

const TDA_URL = process.env.TDA_SERVICE_URL ?? "http://localhost:8001";

export async function POST(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") ?? "";
  const body = await req.text();

  const upstream = await fetch(`${TDA_URL}/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function GET() {
  try {
    const res = await fetch(`${TDA_URL}/api/health`, {
      next: { revalidate: 0 },
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
