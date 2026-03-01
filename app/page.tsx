import Link from "next/link";

async function fetchJson(path: string) {
  const base = process.env.RUNTIME_BASE_URL;
  const tok = process.env.RUNTIME_CONTROL_TOKEN;
  if (!base) throw new Error("RUNTIME_BASE_URL is not set");
  if (!tok) throw new Error("RUNTIME_CONTROL_TOKEN is not set");

  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${tok}` },
    // UI is a control plane; we want fresh status.
    cache: "no-store",
  });
  const json = await res.json();
  return { ok: res.ok, status: res.status, json };
}

export default async function Page() {
  const status = await fetchJson("/control/status");
  const summary = await fetchJson("/control/config/summary");

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>OpenClaw Railway UI</h1>

      <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Status</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(status.json, null, 2)}</pre>
      </section>

      <section
        style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}
      >
        <h2>Config summary</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(summary.json, null, 2)}</pre>
      </section>

      <nav style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link href="/discord">Discord</Link>
        <Link href="/models">Models</Link>
        <Link href="/agents">Agents</Link>
        <Link href="/bindings">Bindings</Link>
      </nav>

      <p style={{ marginTop: 16, color: "#444" }}>
        Notes: This UI is protected by Basic Auth using <code>UI_ADMIN_TOKEN</code>. The
        runtime is controlled via <code>/control/*</code> endpoints.
      </p>
    </main>
  );
}
