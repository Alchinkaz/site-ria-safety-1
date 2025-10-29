"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Filter, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import Image from "next/image"
import { productService } from "@/lib/database"
import { useFavorites } from "@/hooks/use-favorites"
import LoadingSkeleton from "@/components/loading-skeleton"

export default function CatalogPage() {
  const [productionItems, setProductionItems] = useState<any[]>([])
  const [supplyItems, setSupplyItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Фильтры
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const { toggleFavorite, isFavorite } = useFavorites()

  // Функция для генерации случайной цены
  const generatePrice = (id: string) => {
    const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const basePrice = 5000 + (seed % 45000) // Цены от 5,000 до 50,000
    return Math.round(basePrice / 100) * 100 // Округляем до сотен
  }

  // Функция для генерации бренда
  const generateBrand = (id: string) => {
    const brands = ["АПДТ", "Казахстан", "Актау", "Промышленность", "Качество"]
    const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return brands[seed % brands.length]
  }

  // Функция для генерации категории
  const generateCategory = (id: string) => {
    const categories = ["Спецодежда", "Спецобувь", "СИЗ", "Защита рук"]
    const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return categories[seed % categories.length]
  }

  // Загружаем данные из Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const products = await productService.getAll()
        setProductionItems(products.production || [])
        setSupplyItems(products.supply || [])
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Обработчик клика вне дропдауна
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Функция фильтрации товаров
  const filterProducts = (products: any[]) => {
    return products.filter((item) => {
      const price = generatePrice(item.id)
      const brand = generateBrand(item.id)
      const category = generateCategory(item.id)

      // Фильтр по цене
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      // Фильтр по категориям
      if (selectedCategories.length > 0 && !selectedCategories.includes(category)) {
        return false
      }

      // Фильтр по брендам
      if (selectedBrands.length > 0 && !selectedBrands.includes(brand)) {
        return false
      }

      return true
    })
  }

  // Функция сортировки товаров
  const sortProducts = (products: any[]) => {
    if (sortOrder === "default") {
      return products
    }

    return [...products].sort((a, b) => {
      const priceA = generatePrice(a.id)
      const priceB = generatePrice(b.id)

      if (sortOrder === "asc") {
        return priceA - priceB
      } else {
        return priceB - priceA
      }
    })
  }

  // Получаем отфильтрованные и отсортированные товары
  const filteredProductionItems = filterProducts(productionItems)
  const filteredSupplyItems = filterProducts(supplyItems)
  const allFilteredItems = [...filteredProductionItems, ...filteredSupplyItems]
  const allSortedItems = sortProducts(allFilteredItems)

  // Функция для добавления в корзину
  const addToCart = (item: any, type: "production" | "supply") => {
    console.log("Added to cart:", item, type)
  }

  const getSortLabel = (value: string) => {
    switch (value) {
      case "default":
        return "По умолчанию"
      case "asc":
        return "По возрастанию"
      case "desc":
        return "По убыванию"
      default:
        return "По умолчанию"
    }
  }

  // Получаем уникальные категории и бренды
  const allItems = [...productionItems, ...supplyItems]
  const categories = Array.from(new Set(allItems.map((item) => generateCategory(item.id))))
  const brands = Array.from(new Set(allItems.map((item) => generateBrand(item.id))))

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  const clearFilters = () => {
    setPriceRange([0, 100000])
    setSelectedCategories([])
    setSelectedBrands([])
  }

  const ProductCard = ({ item, type = "production" }: { item: any; type?: "production" | "supply" }) => {
    const price = generatePrice(item.id)
    const brand = generateBrand(item.id)
    const isFav = isFavorite(item.id)

    return (
      <Card className="group h-full border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
        {/* Изображение с сердечком */}
        <div className="relative h-64 bg-slate-100 overflow-hidden flex-shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite({
                id: item.id,
                title: item.title,
                description: item.description,
                image: item.image,
                type,
              })
            }}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors ${
              isFav
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-white/80 text-slate-400 hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
          </button>

          <Link href={`/catalog/${type}/${item.id}`} className="block w-full h-full">
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 group-hover:scale-105 transition-transform duration-500">
              {item.image ? (
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  quality={85}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {/* Пустая серая область без эмодзи */}
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Контент */}
        <CardContent className="p-4 flex-grow flex flex-col">
          <Link href={`/catalog/${type}/${item.id}`} className="block flex-grow">
            <div className="mb-3 flex-grow">
              {/* Цена */}
              <div className="text-xl font-bold text-slate-900 mb-1">{price.toLocaleString("ru-RU")} ₸</div>

              {/* Бренд */}
              <div className="text-sm text-slate-500 mb-2">{brand}</div>

              {/* Описание */}
              <h3 className="text-sm font-medium text-slate-900 leading-relaxed line-clamp-2">{item.title}</h3>
            </div>
          </Link>

          {/* Кнопка В корзину */}
          <div className="mt-auto pt-3">
            <Button
              variant="orange"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart(item, type)
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />В корзину
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Компонент фильтров
  const FiltersPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`bg-white ${isMobile ? "p-4" : "p-6"} ${isMobile ? "" : "border border-slate-200 rounded-lg"}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Фильтры</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsMobileFiltersOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {!isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Фильтры</h2>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500 hover:text-slate-700">
            Очистить
          </Button>
        </div>
      )}

      {/* Цена */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">Цена</h3>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={100000} min={0} step={1000} className="mb-3" />
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{priceRange[0].toLocaleString("ru-RU")} ₸</span>
            <span>{priceRange[1].toLocaleString("ru-RU")} ₸</span>
          </div>
        </div>
      </div>

      {/* Категории */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">Категории</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <label htmlFor={`category-${category}`} className="text-sm text-slate-700 cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Бренды */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">Бренды</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <label htmlFor={`brand-${brand}`} className="text-sm text-slate-700 cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {isMobile && (
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={clearFilters} className="flex-1 bg-transparent">
            Очистить
          </Button>
          <Button onClick={() => setIsMobileFiltersOpen(false)} className="flex-1">
            Применить
          </Button>
        </div>
      )}
    </div>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Breadcrumbs */}
      <div className="bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-4 py-6 pt-24 lg:pt-32">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Каталог</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 py-8 text-[rgba(248,248,248,1)] bg-[rgba(248,248,248,1)]">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)} className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Фильтры
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <FiltersPanel />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header with count and sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Найдено товаров: {allSortedItems.length}</h1>
              </div>

              {/* Sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-slate-600">Сортировать:</span>
                <div className="relative dropdown-container" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full sm:w-40 px-4 py-2 text-left bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 flex items-center justify-between"
                  >
                    <span className="truncate">{getSortLabel(sortOrder)}</span>
                    <ChevronDown className="flex-shrink-0 ml-2 h-4 w-4 text-slate-400" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg z-50 w-full sm:w-40">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setSortOrder("default")
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                            sortOrder === "default" ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-700"
                          }`}
                        >
                          По умолчанию
                        </button>
                        <button
                          onClick={() => {
                            setSortOrder("asc")
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                            sortOrder === "asc" ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-700"
                          }`}
                        >
                          По возрастанию
                        </button>
                        <button
                          onClick={() => {
                            setSortOrder("desc")
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                            sortOrder === "desc" ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-700"
                          }`}
                        >
                          По убыванию
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {allSortedItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {allSortedItems.map((item) => {
                  const type = productionItems.includes(item) ? "production" : "supply"
                  return <ProductCard key={item.id} item={item} type={type} />
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">Товары не найдены</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
            <div className="h-full overflow-y-auto">
              <FiltersPanel isMobile />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
