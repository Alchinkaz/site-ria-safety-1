import type React from "react"
import type { Metadata } from "next"
import { PT_Sans } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const ptSans = PT_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-pt-sans",
})

export const metadata: Metadata = {
  title: "Ria Safety - Производство и продажа спецодежды и СИЗ",
  description: "Ria Safety - производство и продажа спецодежды, спецобуви и средств индивидуальной защиты (СИЗ)",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${ptSans.variable} font-sans`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
