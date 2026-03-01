"use client";

import { useEffect, useState } from "react";
import { callRuntime } from "../lib/runtimeClient";

export default function DevicesPage() {
  const [out, setOut] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [requestId, setRequestId] = useState("");

  async function refresh() {
    setBusy(true);
    try {
      const r = await callRuntime({ path: "/control/pairing/pending", method: "GET" });
      setOut(r);
    } finally {
      setBusy(false);
    }
  }

  async function approveLatest() {
    setBusy(true);
    try {
      const r = await callRuntime({ path: "/control/pairing/approve", method: "POST", body: {} });
      setOut(r);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function approveById() {
    setBusy(true);
    try {
      const r = await callRuntime({
        path: "/control/pairing/approve",
        method: "POST",
        body: { requestId: requestId.trim() || undefined },
      });
      setOut(r);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <h1>Devices / Pairing</h1>
      <p>Approve new device/browser requests for the OpenClaw Control UI.</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        <button onClick={refresh} disabled={busy}>
          Refresh
        </button>
        <button onClick={approveLatest} disabled={busy}>
          Approve latest
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          Request ID (optional)
          <input
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            placeholder="Paste requestId"
          />
        </label>
        <button onClick={approveById} disabled={busy} style={{ marginTop: 8 }}>
          Approve by requestId
        </button>
      </div>

      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
        {JSON.stringify(out, null, 2)}
      </pre>
    </main>
  );
}
