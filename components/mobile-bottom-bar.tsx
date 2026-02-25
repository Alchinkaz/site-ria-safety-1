"use client"

import type React from "react"

import Link from "next/link"
import { Home, LayoutGrid, Heart, Phone, ShoppingCart } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import MobileCatalogMenu from "@/components/mobile-catalog-menu"

export default function MobileBottomBar() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        // Only apply on screens smaller than lg
        setIsVisible(true)
        return
      }

      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down
        setIsVisible(false)
      } else if (window.scrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  const handleCatalogClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsCatalogMenuOpen(true)
  }

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 lg:hidden transition-transform duration-300",
          isVisible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="grid grid-cols-5 h-16 items-center">
          <Link href="/" className="flex flex-col items-center justify-center text-slate-600 hover:text-slate-900">
            <Home className={cn("h-5 w-5", pathname === "/" && "text-red-500")} />
            <span className={cn("text-xs mt-1", pathname === "/" && "text-red-500 font-medium")}>Главная</span>
          </Link>
          <button
            onClick={handleCatalogClick}
            className="flex flex-col items-center justify-center text-slate-600 hover:text-slate-900"
          >
            <LayoutGrid className={cn("h-5 w-5", pathname.startsWith("/catalog") && "text-red-500")} />
            <span className={cn("text-xs mt-1", pathname.startsWith("/catalog") && "text-red-500 font-medium")}>
              Каталог
            </span>
          </button>
          <Link
            href="/favorites"
            className="flex flex-col items-center justify-center text-slate-600 hover:text-slate-900"
          >
            <Heart className={cn("h-5 w-5", pathname === "/favorites" && "text-red-500")} />
            <span className={cn("text-xs mt-1", pathname === "/favorites" && "text-red-500 font-medium")}>
              Избранное
            </span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center justify-center text-slate-600 hover:text-slate-900">
            <ShoppingCart className={cn("h-5 w-5", pathname === "/cart" && "text-red-500")} />
            <span className={cn("text-xs mt-1", pathname === "/cart" && "text-red-500 font-medium")}>Корзина</span>
          </Link>
          <Link
            href="/contacts"
            className="flex flex-col items-center justify-center text-slate-600 hover:text-slate-900"
          >
            <Phone className={cn("h-5 w-5", pathname === "/contacts" && "text-red-500")} />
            <span className={cn("text-xs mt-1", pathname === "/contacts" && "text-red-500 font-medium")}>Контакты</span>
          </Link>
        </div>
      </div>

      <MobileCatalogMenu isOpen={isCatalogMenuOpen} onClose={() => setIsCatalogMenuOpen(false)} />
    </>
  )
}
