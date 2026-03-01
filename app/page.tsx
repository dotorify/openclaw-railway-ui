"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

async function callRuntime(path: string, method: string, body?: any) {
  const res = await fetch("/api/runtime", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, method, body }),
  });
  return await res.json();
}

export default function Page() {
  const [status, setStatus] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setStatus(await callRuntime("/control/status", "GET"));
      setSummary(await callRuntime("/control/config/summary", "GET"));
    })();
  }, []);

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>OpenClaw Railway UI</h1>

      <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Status</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(status, null, 2)}</pre>
      </section>

      <section
        style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}
      >
        <h2>Config summary</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(summary, null, 2)}</pre>
      </section>

      <nav style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/discord">Discord</Link>
        <Link href="/models">Models</Link>
        <Link href="/devices">Devices</Link>
        <Link href="/agents">Agents</Link>
        <Link href="/bindings">Bindings</Link>
      </nav>

      <p style={{ marginTop: 16, color: "#444" }}>
        Notes: This UI is protected by Basic Auth using <code>UI_ADMIN_TOKEN</code>.
      </p>
    </main>
  );
}
