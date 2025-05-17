import type { Metadata } from 'next'
import './globals.css'
import { Mulish } from 'next/font/google'
 
const mulish = Mulish({
  weight: '400',
  subsets: ['latin'],
})

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
    <html lang="pt-br">
      <body className={mulish.className}>{children}</body>
    </html>
  )
}
