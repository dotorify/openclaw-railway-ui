"use client";

import { useState } from "react";

async function callRuntime(path: string, method: string, body?: any) {
  const res = await fetch("/api/runtime", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, method, body }),
  });
  return await res.json();
}

export default function DiscordPage() {
  const [token, setToken] = useState("");
  const [out, setOut] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const patch = { channels: { discord: { token } } };
      const r1 = await callRuntime("/control/config", "PATCH", { patch });
      const r2 = await callRuntime("/control/apply", "POST");
      setOut({ patchResult: r1, applyResult: r2 });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>Discord</h1>
      <p>Sets <code>channels.discord.token</code> in <code>openclaw.json</code> and restarts the gateway.</p>

      <label style={{ display: "block", marginTop: 12 }}>
        Bot Token
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
          placeholder="discord bot token"
        />
      </label>

      <button disabled={busy || !token} onClick={save} style={{ marginTop: 12 }}>
        {busy ? "Working..." : "Save & Apply"}
      </button>

      {out && (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{JSON.stringify(out, null, 2)}</pre>
      )}
    </main>
  );
}
