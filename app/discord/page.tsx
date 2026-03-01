"use client";

import { useState } from "react";

import { callRuntime } from "../lib/runtimeClient";

export default function DiscordPage() {
  const [token, setToken] = useState("");
  const [out, setOut] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const patch = { channels: { discord: { token } } };
      const r1 = await callRuntime({ path: "/control/config", method: "PATCH", body: { patch } });
      const r2 = await callRuntime({ path: "/control/apply", method: "POST" });
      setOut({ patchResult: r1, applyResult: r2 });
    } finally {
      setBusy(false);
    }
  }

  async function probe() {
    setBusy(true);
    try {
      const r = await callRuntime({ path: "/control/channels/probe", method: "POST" });
      setOut({ probe: r });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>Discord</h1>
      <p>
        Sets <code>channels.discord.token</code> in <code>openclaw.json</code>, restarts the gateway, and can run <code>openclaw channels status --probe</code>.
      </p>

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

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button disabled={busy || !token} onClick={save}>
          {busy ? "Working..." : "Save & Apply"}
        </button>
        <button disabled={busy} onClick={probe}>
          Probe channels
        </button>
      </div>

      {out && (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{JSON.stringify(out, null, 2)}</pre>
      )}
    </main>
  );
}
