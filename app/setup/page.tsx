"use client";

import { useEffect, useState } from "react";
import { callRuntime, getRuntimeSettings, setRuntimeSettings } from "../lib/runtimeClient";

export default function SetupPage() {
  const [baseUrl, setBaseUrl] = useState("");
  const [controlToken, setControlToken] = useState("");
  const [out, setOut] = useState<any>(null);

  useEffect(() => {
    const s = getRuntimeSettings();
    setBaseUrl(s.baseUrl);
    setControlToken(s.controlToken);
  }, []);

  async function saveAndTest() {
    setRuntimeSettings({ baseUrl: baseUrl.trim(), controlToken: controlToken.trim() });
    const r = await callRuntime({ path: "/control/status", method: "GET" });
    setOut(r);
  }

  return (
    <main>
      <h1>Setup</h1>
      <p>Configure where the UI should call the runtime control API.</p>

      <label style={{ display: "block", marginTop: 12 }}>
        Runtime Base URL
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
          placeholder="https://your-runtime.up.railway.app"
        />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        Runtime Control Token
        <input
          type="password"
          value={controlToken}
          onChange={(e) => setControlToken(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
          placeholder="OPENCLAW_CONTROL_TOKEN"
        />
      </label>

      <button onClick={saveAndTest} style={{ marginTop: 12 }}>
        Save & Test
      </button>

      {out && <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{JSON.stringify(out, null, 2)}</pre>}

      <p style={{ marginTop: 16, color: "#444" }}>
        Stored in your browser localStorage. (Admin-only UI)
      </p>
    </main>
  );
}
