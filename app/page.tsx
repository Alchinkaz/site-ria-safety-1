"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, Settings, Award, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import OrderForm from "@/components/order-form"
import Image from "next/image"
import { productService, homepageService } from "@/lib/database"
import { useFavorites } from "@/hooks/use-favorites"

import {
  Shield,
  Star,
  Zap,
  Target,
  CheckCircle,
  Lightbulb,
  Rocket,
  Trophy,
  Users,
  Globe,
  Cpu,
  Database,
  Lock,
  Cloud,
  Code,
  Wifi,
  Smartphone,
  Monitor,
  Headphones,
  Camera,
  Battery,
  Bluetooth,
  Download,
  Upload,
  Search,
  Filter,
  Mail,
  MessageCircle,
  Calendar,
  MapPin,
  Bookmark,
  Share,
  ThumbsUp,
  Eye,
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  // Загружаем данные из Supabase
  const [homepageData, setHomepageData] = useState({
    hero: {
      title: "Актауский производитель деталей трубопроводов",
      subtitle: "Профессиональное производство высококачественных деталей трубопроводов",
      badge: "Производство с 2010 года",
      backgroundImage: "",
    },
    advantages: [
      {
        id: "cert",
        title: "Сертификат СТ KZ",
        description: "Подтверждение отечественного происхождения продукции",
        icon: "Award",
        color: "green",
      },
      {
        id: "gost",
        title: "Соответствие ГОСТ",
        description: "Вся продукция изготавливается строго по нормативным документам и АТК",
        icon: "FileText",
        color: "blue",
      },
      {
        id: "quality",
        title: "Качество и надежность",
        description: "Современное оборудование и контроль качества",
        icon: "Settings",
        color: "purple",
      },
      {
        id: "approach",
        title: "Индивидуальный подход",
        description: "Быстрая обработка заказов и поставки по РК и СНГ",
        icon: "Clock",
        color: "red",
      },
    ],
    about: {
      title: "О компании",
      text1:
        "Ria Safety — производственная компания, специализирующаяся на производстве и продаже спецодежды и средств индивидуальной защиты (СИЗ). Мы предлагаем широкий ассортимент качественной продукции для обеспечения безопасности работников в различных отраслях промышленности.",
      text2:
        "Наша продукция включает спецодежду для всех сезонов, спецобувь, защитные средства для головы, лица, органов дыхания и слуха, а также перчатки и другие средства защиты рук. Мы гарантируем соответствие всех товаров стандартам качества и безопасности, обеспечивая надежную защиту на рабочем месте.",
      image: "https://zelimhan1965.github.io/apdt_assets/assets/production.jpg",
    },
    certificates: [
      {
        id: "cert1",
        title: "Сертификат соответствия ГОСТ",
        description: "Сертификат соответствия продукции требованиям ГОСТ",
        image: "/placeholder.svg?height=400&width=300",
        documentUrl: "",
      },
      {
        id: "cert2",
        title: "Сертификат качества ISO",
        description: "Международный сертификат системы менеджмента качества",
        image: "/placeholder.svg?height=400&width=300",
        documentUrl: "",
      },
    ],
    cta: {
      title: "Готовы начать сотрудничество?",
      subtitle: "Свяжитесь с нами для получения консультации и расчета стоимости",
    },
  })

  const [productionItems, setProductionItems] = useState<any[]>([])
  const [supplyItems, setSupplyItems] = useState<any[]>([])

  // Используем хук избранного
  const { toggleFavorite, isFavorite } = useFavorites()

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

  // Загружаем данные из Supabase при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем данные главной страницы
        const homepage = await homepageService.getAll()
        if (homepage) {
          setHomepageData(homepage)
        }

        // Загружаем товары
        const products = await productService.getAll()
        // Фильтруем товары производства, которые должны отображаться на главной
        const visibleProductionItems = products.production.filter((product: any) => product.show_on_homepage)
        // Фильтруем товары поставок, которые должны отображаться на главной
        const visibleSupplyItems = products.supply || []
        setProductionItems(visibleProductionItems)
        setSupplyItems(visibleSupplyItems)

        console.log("Supply items loaded:", visibleSupplyItems)
        console.log("Production items loaded:", visibleProductionItems)
      } catch (error) {
        console.error("Error loading homepage data:", error)
      }
    }

    loadData()
  }, [])

  // Функция для получения иконки преимущества
  const getAdvantageIcon = (iconName: string) => {
    const iconProps = "h-8 w-8"

    switch (iconName) {
      case "Award":
        return <Award className={`${iconProps} text-green-600`} />
      case "FileText":
        return <FileText className={`${iconProps} text-blue-600`} />
      case "Settings":
        return <Settings className={`${iconProps} text-purple-600`} />
      case "Clock":
        return <Clock className={`${iconProps} text-[#ED1B23]`} />
      case "Shield":
        return <Shield className={`${iconProps} text-green-600`} />
      case "Star":
        return <Star className={`${iconProps} text-yellow-600`} />
      case "Zap":
        return <Zap className={`${iconProps} text-yellow-600`} />
      case "Target":
        return <Target className={`${iconProps} text-red-600`} />
      case "CheckCircle":
        return <CheckCircle className={`${iconProps} text-green-600`} />
      case "Heart":
        return <Heart className={`${iconProps} text-red-600`} />
      case "Lightbulb":
        return <Lightbulb className={`${iconProps} text-yellow-600`} />
      case "Rocket":
        return <Rocket className={`${iconProps} text-blue-600`} />
      case "Trophy":
        return <Trophy className={`${iconProps} text-yellow-600`} />
      case "Users":
        return <Users className={`${iconProps} text-blue-600`} />
      case "Globe":
        return <Globe className={`${iconProps} text-blue-600`} />
      case "Cpu":
        return <Cpu className={`${iconProps} text-purple-600`} />
      case "Database":
        return <Database className={`${iconProps} text-gray-600`} />
      case "Lock":
        return <Lock className={`${iconProps} text-gray-600`} />
      case "Cloud":
        return <Cloud className={`${iconProps} text-blue-600`} />
      case "Code":
        return <Code className={`${iconProps} text-green-600`} />
      case "Wifi":
        return <Wifi className={`${iconProps} text-blue-600`} />
      case "Smartphone":
        return <Smartphone className={`${iconProps} text-gray-600`} />
      case "Monitor":
        return <Monitor className={`${iconProps} text-gray-600`} />
      case "Headphones":
        return <Headphones className={`${iconProps} text-gray-600`} />
      case "Camera":
        return <Camera className={`${iconProps} text-gray-600`} />
      case "Battery":
        return <Battery className={`${iconProps} text-green-600`} />
      case "Bluetooth":
        return <Bluetooth className={`${iconProps} text-blue-600`} />
      case "Download":
        return <Download className={`${iconProps} text-blue-600`} />
      case "Upload":
        return <Upload className={`${iconProps} text-blue-600`} />
      case "Search":
        return <Search className={`${iconProps} text-gray-600`} />
      case "Filter":
        return <Filter className={`${iconProps} text-gray-600`} />
      case "Mail":
        return <Mail className={`${iconProps} text-blue-600`} />
      case "MessageCircle":
        return <MessageCircle className={`${iconProps} text-blue-600`} />
      case "Calendar":
        return <Calendar className={`${iconProps} text-blue-600`} />
      case "MapPin":
        return <MapPin className={`${iconProps} text-red-600`} />
      case "Bookmark":
        return <Bookmark className={`${iconProps} text-blue-600`} />
      case "Share":
        return <Share className={`${iconProps} text-blue-600`} />
      case "ThumbsUp":
        return <ThumbsUp className={`${iconProps} text-green-600`} />
      case "Eye":
        return <Eye className={`${iconProps} text-gray-600`} />
      case "Sun":
        return <Sun className={`${iconProps} text-yellow-600`} />
      case "Moon":
        return <Moon className={`${iconProps} text-gray-600`} />
      case "TrendingUp":
        return <TrendingUp className={`${iconProps} text-green-600`} />
      case "TrendingDown":
        return <TrendingDown className={`${iconProps} text-red-600`} />
      case "PieChart":
        return <PieChart className={`${iconProps} text-blue-600`} />
      case "LineChart":
        return <LineChart className={`${iconProps} text-blue-600`} />
      case "Activity":
        return <Activity className={`${iconProps} text-green-600`} />
      default:
        return <Award className={`${iconProps} text-green-600`} />
    }
  }

  // Функция для получения цвета фона преимущества
  const getAdvantageColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100"
      case "blue":
        return "bg-blue-100"
      case "purple":
        return "bg-purple-100"
      case "red":
        return "bg-red-100"
      case "orange":
        return "bg-orange-100"
      case "yellow":
        return "bg-yellow-100"
      case "pink":
        return "bg-pink-100"
      case "indigo":
        return "bg-indigo-100"
      case "teal":
        return "bg-teal-100"
      case "gray":
        return "bg-gray-100"
      default:
        return "bg-green-100"
    }
  }

  // Функция для открытия WhatsApp
  const openWhatsApp = async () => {
    try {
      const response = await fetch("/api/contacts")
      const contactsData = await response.json()
      const whatsappUrl = contactsData?.whatsappUrl || "https://wa.me/77016579054"
      window.open(whatsappUrl, "_blank")
    } catch (error) {
      console.error("Error loading contacts:", error)
      window.open("https://wa.me/77016579054", "_blank")
    }
  }

  // Функция для открытия PDF сертификата
  const openCertificate = (documentUrl: string) => {
    if (documentUrl) {
      window.open(documentUrl, "_blank")
    }
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

  // Функция для добавления в корзину
  const addToCart = (item: any, type: "production" | "supply") => {
    // Здесь можно добавить логику добавления в корзину
    console.log("Added to cart:", item, type)
    // Показать уведомление или открыть корзину
  }

  const ProductCard = ({ item, type = "production" }: { item: any; type?: "production" | "supply" }) => {
    const price = generatePrice(item.id)
    const brand = generateBrand(item.id)
    const isFav = isFavorite(item.id)

    return (
      <div className="w-[280px] min-w-[280px] flex-shrink-0">
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
                    sizes="280px"
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Image only with container width */}
      <section className="py-8 md:py-12 lg:py-8 bg-white mt-16 lg:mt-[106px]">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="relative w-full rounded-lg overflow-hidden aspect-square md:aspect-[21/9]">
            {homepageData.hero.backgroundImage ? (
              <Image
                src={homepageData.hero.backgroundImage || ""}
                alt="Hero image"
                fill
                className="object-cover rounded-lg"
                priority
                quality={90}
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <p className="text-lg font-medium">Изображение не загружено</p>
                  <p className="text-sm">Добавьте ссылку в админ панели</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Лучшие предложения</h2>
          </div>

          {/* Products Carousel */}
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {productionItems.map((item) => (
                  <CarouselItem key={item.id} className="pl-4 basis-auto">
                    <ProductCard item={item} type="production" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute -top-16 right-0 hidden lg:flex space-x-2">
                <CarouselPrevious className="relative inset-auto translate-y-0 translate-x-0" />
                <CarouselNext className="relative inset-auto translate-y-0 translate-x-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Catalog Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Актуальное из каталога</h2>
          </div>

          {/* Mobile Layout - Stacked Cards */}
          <div className="block lg:hidden space-y-4">
            <Link href="/catalog/specodejda" className="block">
              <Card className="group overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Спецодежда</h3>
                    <p className="text-slate-300 text-sm">Костюмы, куртки, брюки</p>
                  </div>
                  {/* <div className="text-white/80 group-hover:translate-x-1 transition-transform">→</div> */}
                </CardContent>
              </Card>
            </Link>

            <Link href="/catalog/specobuvь" className="block">
              <Card className="group overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Спецобувь</h3>
                    <p className="text-slate-300 text-sm">Летняя и зимняя</p>
                  </div>
                  {/* <div className="text-white/80 group-hover:translate-x-1 transition-transform">→</div> */}
                </CardContent>
              </Card>
            </Link>

            <Link href="/catalog/siz" className="block">
              <Card className="group overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">СИЗ</h3>
                    <p className="text-slate-300 text-sm">Средства индивидуальной защиты</p>
                  </div>
                  {/* <div className="text-white/80 group-hover:translate-x-1 transition-transform">→</div> */}
                </CardContent>
              </Card>
            </Link>

            <Link href="/catalog/zaschita-ruk" className="block">
              <Card className="group overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Защита рук</h3>
                    <p className="text-slate-300 text-sm">Перчатки и рукавицы</p>
                  </div>
                  {/* <div className="text-white/80 group-hover:translate-x-1 transition-transform">→</div> */}
                </CardContent>
              </Card>
            </Link>

            <Link href="/catalog/rasprodaja" className="block">
              <Card className="group overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Распродажа</h3>
                    <p className="text-slate-300 text-sm">Товары со скидкой</p>
                  </div>
                  {/* <div className="text-white/80 group-hover:translate-x-1 transition-transform">→</div> */}
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Desktop Layout - Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:h-[600px]">
            {/* Large Card - Left Side */}
            <Link href="/catalog/specodejda" className="block">
              <Card className="group h-full overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold mb-6">Спецодежда</h3>
                    <div className="space-y-2 text-slate-300">
                      <p className="underline text-sm">Костюмы</p>
                      <p className="underline text-sm">Куртки</p>
                      <p className="underline text-sm">Полукомбинезоны</p>
                      <p className="underline text-sm">Брюки</p>
                      <p className="underline text-sm">Жилеты</p>
                    </div>
                  </div>
                  {/* <div className="text-white/80 group-hover:translate-x-2 transition-transform text-2xl">→</div> */}
                </CardContent>
              </Card>
            </Link>

            {/* Right Side - 2x2 Grid */}
            <div className="col-span-2 grid grid-cols-2 gap-4 h-full">
              {/* Top Row */}
              <Link href="/catalog/specobuvь" className="block">
                <Card className="group h-full overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Спецобувь</h3>
                      <div className="space-y-2 text-slate-300">
                        <p className="underline text-sm">Летняя</p>
                        <p className="underline text-sm">Зимняя</p>
                      </div>
                    </div>
                    {/* <div className="text-white/80 group-hover:translate-x-1 transition-transform text-xl">→</div> */}
                  </CardContent>
                </Card>
              </Link>

              <Link href="/catalog/siz" className="block">
                <Card className="group h-full overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">СИЗ</h3>
                      <div className="space-y-2 text-slate-300">
                        <p className="underline text-sm">Защита головы и лица</p>
                        <p className="underline text-sm">Защита органов дыхания</p>
                      </div>
                    </div>
                    {/* <div className="text-white/80 group-hover:translate-x-1 transition-transform text-xl">→</div> */}
                  </CardContent>
                </Card>
              </Link>

              {/* Bottom Row */}
              <Link href="/catalog/zaschita-ruk" className="block">
                <Card className="group h-full overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Защита рук</h3>
                    </div>
                    {/* <div className="text-white/80 group-hover:translate-x-1 transition-transform text-xl">→</div> */}
                  </CardContent>
                </Card>
              </Link>

              <Link href="/catalog/rasprodaja" className="block">
                <Card className="group h-full overflow-hidden border-0 bg-[#0f172a] text-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Распродажа</h3>
                    </div>
                    {/* <div className="text-white/80 group-hover:translate-x-1 transition-transform text-xl">→</div> */}
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 lg:py-20 overflow-hidden bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-left">Бренды</h2>
          </div>
          <div className="relative">
            <div className="flex animate-scroll whitespace-nowrap">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center flex-shrink-0">
                  {["3M", "Honeywell", "MSA", "Uvex", "Ansell", "DuPont"].map((brand) => (
                    <div
                      key={`${brand}-${i}`}
                      className="text-2xl font-bold text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 px-4 sm:px-6 lg:px-12"
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Новые поступления</h2>
          </div>

          {/* Products Carousel */}
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {productionItems.map((item) => (
                  <CarouselItem key={item.id} className="pl-4 basis-auto">
                    <ProductCard item={item} type="production" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute -top-16 right-0 hidden lg:flex space-x-2">
                <CarouselPrevious className="relative inset-auto translate-y-0 translate-x-0" />
                <CarouselNext className="relative inset-auto translate-y-0 translate-x-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Распродажа</h2>
          </div>

          {/* Products Carousel */}
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {productionItems.map((item) => (
                  <CarouselItem key={item.id} className="pl-4 basis-auto">
                    <ProductCard item={item} type="production" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute -top-16 right-0 hidden lg:flex space-x-2">
                <CarouselPrevious className="relative inset-auto translate-y-0 translate-x-0" />
                <CarouselNext className="relative inset-auto translate-y-0 translate-x-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid xl:grid-cols-2 gap-12 items-center">
            <div className="order-2 xl:order-1">
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                <p>
                  Ria Safety — производственная компания, специализирующаяся на производстве и продаже спецодежды и
                  средств индивидуальной защиты (СИЗ). Мы предлагаем широкий ассортимент качественной продукции для
                  обеспечения безопасности работников в различных отраслях промышленности.
                </p>
                <p>
                  Наша продукция включает спецодежду для всех сезонов, спецобувь, защитные средства для головы, лица,
                  органов дыхания и слуха, а также перчатки и другие средства защиты рук. Мы гарантируем соответствие
                  всех товаров стандартам качества и безопасности, обеспечивая надежную защиту на рабочем месте.
                </p>
              </div>
            </div>

            <div className="order-1 xl:order-2">
              <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                {homepageData.about.image ? (
                  <Image
                    src={homepageData.about.image || "/placeholder.svg"}
                    alt="Производственные мощности"
                    fill
                    className="object-cover rounded-lg"
                    quality={85}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <p className="text-lg font-medium">Изображение не загружено</p>
                      <p className="text-sm">Добавьте ссылку в админ панели</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Hero Section */}
      <section className="bg-white leading-[4rem] py-32 pt-12 pb-28">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="relative w-full rounded-lg overflow-hidden h-[300px]">
            {homepageData.hero.backgroundImage ? (
              <Image
                src={homepageData.hero.backgroundImage || "/placeholder.svg"}
                alt="Additional hero image"
                fill
                className="object-cover rounded-lg"
                quality={90}
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <p className="text-lg font-medium">Изображение не загружено</p>
                  <p className="text-sm">Добавьте ссылку в админ панели</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <OrderForm
        isOpen={orderForm.isOpen}
        onClose={() => setOrderForm({ isOpen: false, product: null })}
        product={orderForm.product}
      />
    </div>
  )
}
