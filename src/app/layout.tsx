import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppState";
import BottomNav from "@/components/BottomNav";
import PWARegister from "@/components/PWARegister";
import AppOverlays from "@/components/AppOverlays";

export const metadata: Metadata = {
  title: "熵减",
  description: "把生活从混乱状态拉回有序状态。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "熵减",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#b7c5ad",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppProvider>
          <PWARegister />
          <main className="app-shell">{children}</main>
          <BottomNav />
          <AppOverlays />
        </AppProvider>
      </body>
    </html>
  );
}
