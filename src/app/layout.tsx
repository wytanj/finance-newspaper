import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JT Finance Paper",
  description:
    "Personal daily + weekly macro + robotics newspaper distilled from high-signal X voices. Asia/Singapore.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
