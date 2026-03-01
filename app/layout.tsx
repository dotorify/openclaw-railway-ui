import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", margin: 0, padding: 24 }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>{children}</div>
      </body>
    </html>
  );
}
