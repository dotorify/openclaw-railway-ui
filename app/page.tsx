"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { callRuntime } from "./lib/runtimeClient";

export default function Page() {
  const [status, setStatus] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setStatus(await callRuntime({ path: "/control/status", method: "GET" }));
      setSummary(
        await callRuntime({ path: "/control/config/summary", method: "GET" }),
      );
    })();
  }, []);

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>OpenClaw Railway UI</h1>

      <nav style={{ margin: "8px 0 16px", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/setup">Setup</Link>
        <Link href="/discord">Discord</Link>
        <Link href="/models">Models</Link>
        <Link href="/devices">Devices</Link>
        <Link href="/agents">Agents</Link>
        <Link href="/bindings">Bindings</Link>
      </nav>

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

      <p style={{ marginTop: 16, color: "#444" }}>
        Auth: Basic Auth (password = <code>UI_ADMIN_TOKEN</code>). Runtime calls go through
        <code> /api/runtime</code>.
      </p>
    </main>
  );
}
