"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, User, Heart, ShoppingCart, LayoutGridIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SearchDropdown from "./search-dropdown"

export default function Navbar() {
  const [contactsData, setContactsData] = useState<any>(null)
  const [showTopBar, setShowTopBar] = useState(true)
  const [selectedCity, setSelectedCity] = useState("Алматы")
  const [cityDialogOpen, setCityDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const catalogButtonRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showBackdrop, setShowBackdrop] = useState(false)

  const topLinks = [
    { name: "О компании", href: "/about" },
    { name: "Доставка и оплата", href: "/delivery" },
    { name: "Обмен и возврат", href: "/returns" },
    { name: "Контакты", href: "/contacts" },
  ]

  const cities = [
    "Алматы",
    "Нур-Султан",
    "Шымкент",
    "Актобе",
    "Тараз",
    "Павлодар",
    "Усть-Каменогорск",
    "Семей",
    "Атырау",
    "Костанай",
    "Кызылорда",
    "Уральск",
    "Петропавловск",
    "Актау",
    "Темиртау",
    "Туркестан",
    "Кокшетау",
    "Талдыкорган",
    "Экибастуз",
    "Рудный",
  ]

  const catalogStructure = {
    Спецодежда: {
      href: "/catalog/specodejda",
      subcategories: {
        "Спецодежда летняя": [
          "Летние рабочие костюмы",
          "Летние рабочие куртки и халаты",
          "Летние рабочие полукомбинезоны и брюки",
        ],
        "Спецодежда зимняя": ["Костюмы зимние", "Куртки зимние", "Брюки/Полукомбинезоны зимние", "Жилеты"],
        "Спецодежда защитная": [
          "Сигнальная спецодежда",
          "Влагозащитная спецодежда",
          "Спецодежда для сварщиков и от повышенных температур",
          "Защита от статического электричества",
          "Комбинезоны защитные",
          "Сигнальные жилеты",
        ],
        "Головные уборы": ["Кепки/Бейсболки", "Подшлемники/Балаклавы", "Шапки"],
      },
    },
    Спецобувь: {
      href: "/catalog/specobuvь",
      subcategories: {
        "Спецобувь летняя": ["Ботинки летние", "Сапоги летние", "Полуботинки/кроссовки", "Сандалии"],
        "Спецобувь зимняя": ["Зимние ботинки", "Зимние сапоги/полусапоги"],
      },
    },
    СИЗ: {
      href: "/catalog/siz",
      subcategories: {
        "Защита головы": ["Каски", "Каскетки"],
        "Защита лица и органов зрения": [
          "Очки открытые",
          "Очки закрытые с прямой вентиляцией",
          "Очки закрытые с непрямой вентиляцией",
          "Очки для газосварочных работ",
          "Маски сварщика",
          "Щитки защитные лицевые",
          "Очки герметичные",
        ],
        "Защита органов дыхания": ["Респираторы", "Полумаски и полнолицевые маски", "Противогазы", "Фильтры"],
        "Защита органов слуха": ["Наушники противошумные", "Вкладыши противошумные (беруши)"],
        "Защита от падений с высоты": [
          "Привязи страховочные",
          "Стропы",
          "Соединительные элементы",
          "Устройства для подъема",
          "Средства защиты втягивающего типа",
        ],
        "Одноразовые средства защиты": [],
        "Дерматологические средства": [],
      },
    },
    "Защита рук": {
      href: "/catalog/zaschita-ruk",
      subcategories: {
        "Перчатки масло-бензостойкие": [],
        "Перчатки от механических воздействий": [
          "Перчатки кожаные, спилковые",
          "Перчатки с полимерным покрытием",
          "Перчатки без покрытия",
          "Перчатки трикотажные х/б",
          "Антивибрационные перчатки",
          "Перчатки с защитой от порезов",
        ],
        "Перчатки от химических воздействий": [],
        "Перчатки от повышенных температур": [],
        "Перчатки от пониженных температур": [],
        "Перчатки одноразовые": [],
        Рукавицы: [],
        "Садовые перчатки": [],
      },
    },
  }

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await fetch("/api/contacts")
        const contacts = await response.json()

        if (contacts) {
          setContactsData(contacts)
        } else {
          setContactsData({
            phone: "+7 (771) 116-57-59",
            whatsappUrl: "https://wa.me/77711165759",
          })
        }
      } catch (error) {
        console.error("Error loading contacts:", error)
        setContactsData({
          phone: "+7 (771) 116-57-59",
          whatsappUrl: "https://wa.me/77711165759",
        })
      }
    }

    loadContacts()
  }, [])

  useEffect(() => {
    const controlBars = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY
        setShowTopBar(currentScrollY < 10)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlBars)
      return () => window.removeEventListener("scroll", controlBars)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchDropdownOpen(false)
        setShowBackdrop(false)
      }

      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target)) {
        setSearchDropdownOpen(false)
        setMobileSearchFocused(false)
        setShowBackdrop(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside, true)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleLogoClick = () => {
    router.push("/")
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setCityDialogOpen(false)
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/catalog")
    }
  }

  const handleCatalogMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setCatalogDropdownOpen(true)
    if (!activeCategory) {
      setActiveCategory("Спецодежда")
    }
  }

  const handleCatalogMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setCatalogDropdownOpen(false)
      setActiveCategory(null)
    }, 300)
  }

  const handleSearchFocus = () => {
    setSearchDropdownOpen(true)
    setShowBackdrop(true)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (value.trim().length > 0) {
      setSearchDropdownOpen(true)
    }
  }

  const handleMobileSearchFocus = () => {
    setMobileSearchFocused(true)
    setSearchDropdownOpen(true)
    setShowBackdrop(true)
  }

  const categoryIcons = {
    Спецодежда: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16,4H8A2,2 0 0,0 6,6V18A2,2 0 0,0 8,20H16A2,2 0 0,0 18,18V6A2,2 0 0,0 16,4M16,18H8V6H16V18Z" />
      </svg>
    ),
    Спецобувь: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,18H22L20,20H4L2,18M4,15H20C20.6,15 21,15.4 21,16S20.6,17 20,17H4C3.4,17 3,16.6 3,16S3.4,15 4,15M5,10.5C5,9.7 5.7,9 6.5,9S8,9.7 8,10.5V13H16V10.5C16,9.7 16.7,9 17.5,9S19,9.7 19,10.5V14H5V10.5Z" />
      </svg>
    ),
    СИЗ: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C14.8,12.4 14.4,13.2 13.7,13.7L12.9,14.3C12.4,14.7 11.6,14.7 11.1,14.3L10.3,13.7C9.6,13.2 9.2,12.4 9.2,11.5V10.5C9.2,8.6 10.6,7 12,7Z" />
      </svg>
    ),
    "Защита рук": (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19,13H5V11H19V13M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M21,9H3V7H21V9M21,17H3V15H21V17Z" />
      </svg>
    ),
  }

  return (
    <>
      {showBackdrop && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-[9999]"
          style={{
            clipPath: showTopBar
              ? "polygon(0 0, 100% 0, 100% 106px, 0 106px), polygon(0 106px, 100% 106px, 100% 100%, 0 100%)"
              : "polygon(0 0, 100% 0, 100% 66px, 0 66px), polygon(0 66px, 100% 66px, 100% 100%, 0 100%)",
          }}
          onMouseDown={() => {
            setSearchDropdownOpen(false)
            setShowBackdrop(false)
            setMobileSearchFocused(false)
          }}
        />
      )}

      <div className="fixed top-0 left-0 right-0 z-[10000] bg-white shadow-sm">
        <div
          className={`hidden lg:block overflow-hidden transition-all duration-500 ease-in-out border-b border-white ${
            showTopBar ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="flex h-10 items-center justify-between">
              <div className="flex items-center" style={{ width: "228px", flexShrink: 0 }}>
                <Dialog open={cityDialogOpen} onOpenChange={setCityDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-[#ED1B23] transition-colors">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedCity}</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Выберите город</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className={`p-2 text-left text-sm rounded-md transition-colors hover:bg-gray-100 ${
                            selectedCity === city ? "bg-[#ED1B23] text-white hover:bg-[#d91621]" : ""
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <nav className="flex items-center space-x-6 flex-1" style={{ marginLeft: "24px" }}>
                {topLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#ED1B23] transition-colors whitespace-nowrap"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center text-sm text-gray-600 flex-shrink-0">
                <span className="mr-1 pr-1.5">Поддержка:</span>
                {contactsData && (
                  <a href={`tel:${contactsData.phone}`} className="font-medium hover:text-[#ED1B23] transition-colors">
                    {contactsData.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <header className="border-b border-white bg-white">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="hidden lg:flex h-16 items-center gap-6">
              <div className="flex items-center space-x-4" style={{ width: "228px", flexShrink: 0 }}>
                <button onClick={handleLogoClick} className="flex items-center cursor-pointer">
                  <div className="h-8 w-auto">
                    <Image
                      src="/ria-logo.svg"
                      alt="RIA Riafety"
                      width={120}
                      height={32}
                      className="h-8 w-auto"
                      priority
                    />
                  </div>
                </button>
                <div
                  className="relative ml-12 md:ml-16"
                  ref={catalogButtonRef}
                  onMouseEnter={handleCatalogMouseEnter}
                  onMouseLeave={handleCatalogMouseLeave}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-white bg-[#ED1B23] hover:bg-[#d91621] items-center space-x-2"
                  >
                    <LayoutGridIcon className="h-4 w-4" />
                    <span>Каталог</span>
                  </Button>

                  {catalogDropdownOpen && (
                    <div
                      className="fixed mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-50"
                      style={{
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "100%",
                        maxWidth: "1200px",
                        top: showTopBar ? "106px" : "66px",
                      }}
                      onMouseEnter={handleCatalogMouseEnter}
                      onMouseLeave={handleCatalogMouseLeave}
                    >
                      <div className="flex min-h-[450px]">
                        <div className="w-64 bg-white border-r border-gray-200 rounded-l-lg">
                          {Object.entries(catalogStructure).map(([category, data]) => {
                            return (
                              <button
                                key={category}
                                className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 ${
                                  activeCategory === category
                                    ? "bg-gray-100 text-[#ED1B23]"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-[#ED1B23]"
                                }`}
                                onMouseEnter={() => setActiveCategory(category)}
                              >
                                <span
                                  className={`mr-3 ${activeCategory === category ? "text-[#ED1B23]" : "text-gray-500"}`}
                                >
                                  {categoryIcons[category as keyof typeof categoryIcons]}
                                </span>
                                <span className="font-medium text-sm">{category}</span>
                              </button>
                            )
                          })}
                        </div>

                        <div className="flex-1 p-6">
                          {activeCategory && catalogStructure[activeCategory as keyof typeof catalogStructure] && (
                            <div>
                              <div className="grid grid-cols-3 gap-6">
                                {Object.entries(
                                  catalogStructure[activeCategory as keyof typeof catalogStructure].subcategories,
                                ).map(([subcategory, items]) => (
                                  <div key={subcategory} className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-3">{subcategory}</h4>
                                    <div className="space-y-1">
                                      {items.length > 0 ? (
                                        items.map((item, index) => (
                                          <Link
                                            key={index}
                                            href={`/catalog/${activeCategory.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                            className="block text-xs text-gray-600 hover:text-[#ED1B23] transition-colors duration-200 py-1"
                                          >
                                            <span className="leading-tight">{item}</span>
                                          </Link>
                                        ))
                                      ) : (
                                        <Link
                                          href={`/catalog/${activeCategory.toLowerCase()}`}
                                          className="block text-xs text-gray-600 hover:text-[#ED1B23] transition-colors duration-200 py-1"
                                        >
                                          <span className="leading-tight">Все товары категории</span>
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              

              <div className="flex-1 relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={handleSearchFocus}
                    className="w-full pr-12 h-10 border-gray-300 focus:border-gray-300 focus:ring-0 focus:outline-none transition-all duration-200"
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1 h-8 px-3 bg-[#ED1B23] hover:bg-[#d91621]"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                <SearchDropdown
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  onSearchSubmit={handleSearch}
                  isOpen={searchDropdownOpen}
                  onClose={() => {
                    setSearchDropdownOpen(false)
                    setShowBackdrop(false)
                  }}
                />
              </div>

              <div className="flex items-center gap-8 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center h-auto text-xs text-gray-600 hover:text-[#ED1B23] hover:bg-transparent p-0"
                  onClick={() => router.push("/login")}
                >
                  <User className="h-5 w-5 mb-1" />
                  <span>Войти</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center h-auto text-xs text-gray-600 hover:text-[#ED1B23] hover:bg-transparent p-0"
                  onClick={() => router.push("/favorites")}
                >
                  <Heart className="h-5 w-5 mb-1" />
                  <span>Избранное</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center h-auto text-xs text-gray-600 hover:text-[#ED1B23] hover:bg-transparent relative p-0"
                  onClick={() => router.push("/cart")}
                >
                  <ShoppingCart className="h-5 w-5 mb-1" />
                  <span>Корзина</span>
                </Button>
              </div>
            </div>

            <div className="lg:hidden flex h-16 items-center gap-4">
              <div
                className={`flex items-center cursor-pointer flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
                  mobileSearchFocused ? "opacity-0 -translate-x-4 w-0" : "opacity-100 translate-x-0 w-auto"
                }`}
              >
                <button onClick={handleLogoClick} className="flex items-center">
                  <div className="h-8 w-auto">
                    <Image
                      src="/ria-logo.svg"
                      alt="RIA Riafety"
                      width={120}
                      height={32}
                      className="h-8 w-auto"
                      priority
                    />
                  </div>
                </button>
              </div>

              <div
                className={`flex-1 relative transition-all duration-300 ease-in-out ${
                  mobileSearchFocused ? "-ml-4" : ""
                }`}
                ref={mobileSearchRef}
              >
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={handleMobileSearchFocus}
                    className="w-full pr-12 h-10 text-base placeholder:text-base transition-all duration-300 ease-in-out border-gray-300 focus:border-gray-300 focus:ring-0 focus:outline-none"
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1 h-8 px-3 bg-[#ED1B23] hover:bg-[#d91621] transition-all duration-300 ease-in-out"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                <SearchDropdown
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  onSearchSubmit={handleSearch}
                  isOpen={searchDropdownOpen}
                  onClose={() => {
                    setSearchDropdownOpen(false)
                    setShowBackdrop(false)
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          input[type="text"]:focus {
            outline: none !important;
            box-shadow: none !important;
            border-color: #d1d5db !important;
          }

          input[type="text"]:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }

          input:focus {
            outline: none !important;
            box-shadow: none !important;
          }

          input:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }
        `}</style>
      </div>
    </>
  )
}
