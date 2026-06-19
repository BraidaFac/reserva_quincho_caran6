import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import SWRegister from "./sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caran VI",
  description: "Sistema de reservas — Edificio Caran VI",
  appleWebApp: {
    capable: true,
    // "default" = barra de estado blanca/clara. No requiere safe-area CSS manual.
    // Cambiar a "black-translucent" solo si querés borde a borde + sabés que
    // el layout maneja env(safe-area-inset-top) en cada pantalla.
    statusBarStyle: "default",
    title: "Caran VI",
  },
  icons: {
    icon: "/favicon.svg",
    // Un solo apple-touch-icon sin sizes — iOS elige la mejor opción automáticamente.
    // 192×192 es suficiente; iOS escala según el dispositivo.
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  // viewportFit=cover: el viewport cubre pantalla completa incluyendo notch/Dynamic Island.
  // Con statusBarStyle="default", iOS respeta automáticamente el safe-area-inset-top,
  // pero igual agregamos el CSS para bottom e sides (home indicator, etc.).
  viewportFit: "cover",
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
