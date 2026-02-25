"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomBar from "@/components/mobile-bottom-bar"
import ScrollToTop from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()

  // Проверяем, находимся ли мы на страницах админ-панели
  const isAdminPage = pathname.startsWith("/control")

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <div className="min-h-screen bg-background font-sans antialiased">
        {!isAdminPage && <Navbar />}
        <main className="min-h-screen">{children}</main>
        {!isAdminPage && <Footer />}
        {!isAdminPage && <MobileBottomBar />}
        <ScrollToTop />
        <Toaster />
        <Sonner />
      </div>
    </ThemeProvider>
  )
}
