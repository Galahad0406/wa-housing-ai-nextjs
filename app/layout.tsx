import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pro Real Estate Analyzer - Investment Analysis Platform',
  description: 'Professional real estate investment analysis with address search and market insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
