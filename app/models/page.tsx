"use client";

import { useEffect, useState } from "react";
import { callRuntime } from "../lib/runtimeClient";

export default function ModelsPage() {
  const [agentId, setAgentId] = useState("main");
  const [primary, setPrimary] = useState("openai/gpt-5.2");
  const [fallbacks, setFallbacks] = useState<string>("");
  const [out, setOut] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const r = await callRuntime({ path: "/control/config/summary", method: "GET" });
    setOut(r);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setBusy(true);
    try {
      const fb = fallbacks
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const model = { primary: primary.trim(), fallbacks: fb };

      const r1 = await callRuntime({
        path: "/control/agents/set-model",
        method: "POST",
        body: { agentId: agentId.trim(), model },
      });
      const r2 = await callRuntime({ path: "/control/apply", method: "POST" });
      await refresh();
      setOut({ setModel: r1, apply: r2 });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>Models</h1>
      <p>
        Updates a single agent model safely (does not overwrite other agents).
      </p>

      <label style={{ display: "block", marginTop: 12 }}>
        Agent ID
        <input
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        Primary model
        <input
          value={primary}
          onChange={(e) => setPrimary(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        Fallback models (one per line)
        <textarea
          value={fallbacks}
          onChange={(e) => setFallbacks(e.target.value)}
          rows={6}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <button onClick={save} style={{ marginTop: 12 }} disabled={busy}>
        {busy ? "Working..." : "Save & Apply"}
      </button>

      {out && (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(out, null, 2)}
        </pre>
      )}
    </main>
  );
}
