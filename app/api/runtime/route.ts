import { NextRequest, NextResponse } from "next/server";

function runtimeBase(body: any) {
  const base = (body?.baseUrl || process.env.RUNTIME_BASE_URL || "").trim();
  const tok = (body?.controlToken || process.env.RUNTIME_CONTROL_TOKEN || "").trim();
  if (!base) throw new Error("Runtime base URL not set (set RUNTIME_BASE_URL or provide baseUrl)");
  if (!tok) throw new Error("Runtime control token not set (set RUNTIME_CONTROL_TOKEN or provide controlToken)");
  return { base, tok };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base, tok } = runtimeBase(body);
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
