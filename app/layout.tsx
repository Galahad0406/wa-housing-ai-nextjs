import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Real Estate Forecast AI',
  description: 'AI-Powered Real Estate Investment Analyzer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
