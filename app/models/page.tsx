"use client";

import { useEffect, useState } from "react";

async function callRuntime(path: string, method: string, body?: any) {
  const res = await fetch("/api/runtime", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, method, body }),
  });
  return await res.json();
}

export default function ModelsPage() {
  const [agentId, setAgentId] = useState("main");
  const [primary, setPrimary] = useState("openai/gpt-5.2");
  const [fallbacks, setFallbacks] = useState<string>("");
  const [out, setOut] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const r = await callRuntime("/control/config/summary", "GET");
      setOut(r);
    })();
  }, []);

  async function save() {
    const fb = fallbacks
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    // Note: this replaces the entire agents.list via merge patch unless you provide the full structure.
    // For MVP we keep it simple: set model only on the default agent "main".
    const patch = {
      agents: {
        list: [
          {
            id: agentId,
            default: true,
            model: { primary, fallbacks: fb },
          },
        ],
      },
    };

    const r1 = await callRuntime("/control/config", "PATCH", { patch });
    const r2 = await callRuntime("/control/apply", "POST");
    setOut({ patchResult: r1, applyResult: r2 });
  }

  return (
    <main>
      <h1>Models</h1>
      <p>MVP editor for <code>agents.list[].model</code> (primary + fallbacks).</p>

      <label style={{ display: "block", marginTop: 12 }}>
        Agent ID
        <input value={agentId} onChange={(e) => setAgentId(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }} />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        Primary model
        <input value={primary} onChange={(e) => setPrimary(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }} />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        Fallback models (one per line)
        <textarea value={fallbacks} onChange={(e) => setFallbacks(e.target.value)} rows={6} style={{ width: "100%", padding: 8, marginTop: 6 }} />
      </label>

      <button onClick={save} style={{ marginTop: 12 }}>Save & Apply</button>

      {out && (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{JSON.stringify(out, null, 2)}</pre>
      )}
    </main>
  );
}
