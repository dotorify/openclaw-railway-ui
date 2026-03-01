import { NextRequest, NextResponse } from "next/server";

function runtimeBase() {
  const base = process.env.RUNTIME_BASE_URL;
  const tok = process.env.RUNTIME_CONTROL_TOKEN;
  if (!base) throw new Error("RUNTIME_BASE_URL is not set");
  if (!tok) throw new Error("RUNTIME_CONTROL_TOKEN is not set");
  return { base, tok };
}

export async function POST(req: NextRequest) {
  try {
    const { base, tok } = runtimeBase();
    const body = await req.json();
    const path = String(body?.path || "");
    const method = String(body?.method || "GET");
    const payload = body?.body;

    if (!path.startsWith("/control/")) {
      return NextResponse.json({ ok: false, error: "path must start with /control/" }, { status: 400 });
    }

    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${tok}`,
        "Content-Type": "application/json",
      },
      body: payload === undefined ? undefined : JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    return NextResponse.json({ ok: res.ok, status: res.status, json });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
