import "./globals.css"

export const metadata = {
  title: "Real Estate AI Forecast",
  description: "AI-powered housing market forecast"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial" }}>
        {children}
      </body>
    </html>
  )
}
