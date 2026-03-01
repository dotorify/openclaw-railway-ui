"use client";

type RuntimeRequest = {
  path: string;
  method: string;
  body?: any;
};

export function getRuntimeSettings() {
  if (typeof window === "undefined") {
    return { baseUrl: "", controlToken: "" };
  }
  return {
    baseUrl: window.localStorage.getItem("runtimeBaseUrl") || "",
    controlToken: window.localStorage.getItem("runtimeControlToken") || "",
  };
}

export function setRuntimeSettings(next: { baseUrl: string; controlToken: string }) {
  window.localStorage.setItem("runtimeBaseUrl", next.baseUrl);
  window.localStorage.setItem("runtimeControlToken", next.controlToken);
}

export async function callRuntime(req: RuntimeRequest) {
  const { baseUrl, controlToken } = getRuntimeSettings();
  const res = await fetch("/api/runtime", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      baseUrl,
      controlToken,
      path: req.path,
      method: req.method,
      body: req.body,
    }),
  });
  return await res.json();
}
