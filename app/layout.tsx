export const metadata = {
  title: "Real Estate Forecast AI",
  description: "AI Powered Investment Analyzer"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial", padding: 20 }}>
        {children}
      </body>
    </html>
  )
}
