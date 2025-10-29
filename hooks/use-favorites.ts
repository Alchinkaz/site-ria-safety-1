"use client"

import { useState, useEffect } from "react"

export type FavoriteProduct = {
  id: string
  title: string
  description: string
  image?: string
  type: "production" | "supply"
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites))
        } catch (e) {
          console.error("Failed to parse favorites from localStorage", e)
          setFavorites([])
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites])

  const toggleFavorite = (product: FavoriteProduct) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav.id === product.id)
      if (isAlreadyFavorite) {
        return prev.filter((fav) => fav.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.id === id)
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return { favorites, toggleFavorite, isFavorite, clearFavorites }
}
