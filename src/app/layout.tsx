import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import SWRegister from "./sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caran VI",
  description: "Sistema de reservas — Edificio Caran VI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Caran VI",
  },
  icons: {
    icon: "/favicon.svg",
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4caf82",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SWRegister />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
