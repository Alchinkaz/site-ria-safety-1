"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useFavorites } from "@/hooks/use-favorites"
import OrderForm from "@/components/order-form"

export default function FavoritesPage() {
  const { favorites, toggleFavorite, clearFavorites, isFavorite } = useFavorites()
  const [orderForm, setOrderForm] = useState<{
    isOpen: boolean
    product: {
      id: string
      title: string
      description: string
      image?: string
      type: "production" | "supply"
    } | null
  }>({
    isOpen: false,
    product: null,
  })

  const generatePrice = (id: string) => {
    const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const basePrice = 5000 + (seed % 45000)
    return Math.round(basePrice / 100) * 100
  }

  const generateBrand = (id: string) => {
    const brands = ["АПДТ", "Казахстан", "Актау", "Промышленность", "Качество"]
    const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return brands[seed % brands.length]
  }

  const openOrderForm = (product: any, type: "production" | "supply" = "production") => {
    setOrderForm({
      isOpen: true,
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.image,
        type,
      },
    })
  }

  const addToCart = (item: any, type: "production" | "supply") => {
    console.log("Added to cart:", item, type)
  }

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Breadcrumbs */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6 pt-24 lg:pt-32 max-w-[1200px]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Избранное</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        {favorites.length > 0 && (
          <div className="flex justify-start mb-6">
            <Button
              variant="outline"
              onClick={clearFavorites}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Очистить все
            </Button>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Список избранного пуст</h2>
            <p className="text-slate-600 mb-6">Добавьте товары в избранное, чтобы они появились здесь</p>
            <Link href="/catalog">
              <Button variant="orange">Перейти в каталог</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <Card
                key={product.id}
                className="group border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                <div className="relative bg-slate-100 overflow-hidden flex-shrink-0 h-48 w-full">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavorite(product)
                    }}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                  <Link href={`/catalog/${product.type || "production"}/${product.id}`} className="block w-full h-full">
                    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 group-hover:scale-105 transition-transform duration-500">
                      {product.image ? (
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                          quality={85}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"></div>
                      )}
                    </div>
                  </Link>
                </div>

                <CardContent className="p-4 flex-grow flex flex-col">
                  <Link href={`/catalog/${product.type || "production"}/${product.id}`} className="block flex-grow">
                    <div className="mb-3 flex-grow">
                      <div className="text-xl font-bold text-slate-900 mb-1">
                        {generatePrice(product.id).toLocaleString("ru-RU")} ₸
                      </div>
                      <div className="text-sm text-slate-500 mb-2">{generateBrand(product.id)}</div>
                      <h3 className="text-sm font-medium text-slate-900 leading-relaxed line-clamp-2">
                        {product.title}
                      </h3>
                    </div>
                  </Link>

                  <div className="mt-auto pt-3">
                    <Button
                      variant="orange"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addToCart(product, product.type || "production")
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <OrderForm
        isOpen={orderForm.isOpen}
        onClose={() => setOrderForm({ isOpen: false, product: null })}
        product={orderForm.product}
      />
    </div>
  )
}
