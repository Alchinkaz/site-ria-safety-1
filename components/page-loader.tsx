"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface PageLoaderProps {
  isLoading: boolean
  onLoadingComplete?: () => void
}

export default function PageLoader({ isLoading, onLoadingComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          if (onLoadingComplete) {
            setTimeout(onLoadingComplete, 500)
          }
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isLoading, onLoadingComplete])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Логотип */}
        <div className="mb-8">
          <Image
            src="https://zelimhan1965.github.io/apdt_assets/assets/apdt.svg"
            alt="АПДТ"
            width={120}
            height={36}
            className="h-9 w-auto"
            style={{
              filter: "brightness(0) saturate(100%) invert(100%)",
            }}
            priority
          />
        </div>

        {/* Шкала загрузки */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
