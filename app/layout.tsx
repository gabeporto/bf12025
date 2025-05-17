import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BF1 Entre Amigos 2025',
  description: 'Criado por Gabriel Portoleto'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
