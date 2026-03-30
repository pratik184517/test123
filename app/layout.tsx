import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: {
    default: 'SaaSApp - The Modern SaaS Platform',
    template: '%s | SaaSApp',
  },
  description:
    'SaaSApp is a modern, full-featured SaaS platform for teams that want to move fast and build great products.',
  keywords: ['saas', 'platform', 'productivity', 'team', 'collaboration'],
  authors: [{ name: 'SaaSApp Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'SaaSApp - The Modern SaaS Platform',
    description:
      'SaaSApp is a modern, full-featured SaaS platform for teams that want to move fast and build great products.',
    siteName: 'SaaSApp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
