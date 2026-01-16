import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import Providers from '@/providers'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Montserrat as FontSans } from 'next/font/google'
import { headers } from 'next/headers'
import type React from 'react'

const fontSans = FontSans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Aplicação de agendamentos | Martins Dev',
  description: 'Desenvolvimento de Software sob medida para o seu negócio.',
  keywords: [
    'desenvolvimento web',
    'aplicações mobile',
    'React',
    'Next.js',
    'Node.js',
  ],
  authors: [{ name: 'Lucas Martins' }],
  openGraph: {
    title: 'Aplicação de agendamentos',
    description: 'Desenvolvimento de Software sob medida para o seu negócio.',
    type: 'website',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aplicação de agendamentos | Martins Dev',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') ?? undefined

  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>{nonce && <meta name="nonce" content={nonce} />}</head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers>
          <TooltipProvider delayDuration={100}>
            {children}
            <Toaster
              richColors
              duration={3000}
              closeButton
              expand
              theme="light"
            />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
