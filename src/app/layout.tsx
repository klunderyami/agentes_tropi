import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Tropicaña Admin',
    template: '%s · Tropicaña Admin',
  },
  description:
    'Panel de Control Privado de Tropicaña: monitoreo en vivo de agentes autónomos, chat/WhatsApp, pipeline B2B y métricas de ads.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-brand-cream text-brand-tierra antialiased">
        {children}
      </body>
    </html>
  );
}