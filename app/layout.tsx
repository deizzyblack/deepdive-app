import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "DeepDive Intelligence",
  description: "AI-powered web search analysis with positive/negative signal scoring",
  keywords: ["search", "analysis", "AI", "intelligence", "scoring"],
  authors: [{ name: "DeepDive Team" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 antialiased">
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
