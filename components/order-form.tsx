"use client"

import type React from "react"

import type { ReactElement } from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Phone, MapPin, CheckCircle, ExternalLink, MessageCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
)

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    title: string
    description: string
    image?: string
    type: "production" | "supply"
  } | null
}

const kazakhstanCities = [
  "Алматы",
  "Нур-Султан (Астана)",
  "Шымкент",
  "Актобе",
  "Тараз",
  "Павлодар",
  "Усть-Каменогорск",
  "Семей",
  "Атырау",
  "Костанай",
  "Петропавловск",
  "Актау",
  "Темиртау",
  "Туркестан",
  "Кызылорда",
  "Уральск",
  "Караганда",
  "Талдыкорган",
  "Экибастуз",
  "Рудный",
  "Жанаозен",
  "Балхаш",
  "Кокшетау",
  "Жезказган",
  "Другой",
]

export default function OrderForm({ isOpen, onClose, product }: OrderFormProps): ReactElement | null {
  const [quantity, setQuantity] = useState(1)
  const [phone, setPhone] = useState("")
  const [messenger, setMessenger] = useState("")
  const [city, setCity] = useState("")
  const [customCity, setCustomCity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product || !phone || !city) {
      toast.error("Пожалуйста, заполните все обязательные поля")
      return
    }

    if (city === "Другой" && !customCity.trim()) {
      toast.error("Пожалуйста, укажите название города")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/send-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: product.title,
          productImage: product.image || "",
          productType: product.type,
          quantity,
          phone,
          messenger: messenger || null,
          city,
          customCity: customCity.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Ошибка сети" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      // Принудительно устанавливаем успешное состояние
      setTimeout(() => {
        setIsSuccess(true)
        toast.success("Заявка успешно отправлена!")
      }, 100)
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Произошла ошибка при отправке заявки"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setQuantity(1)
    setPhone("")
    setMessenger("")
    setCity("")
    setCustomCity("")
    setIsSuccess(false)
    onClose()
  }

  const handleWhatsAppClick = async () => {
    try {
      // Загружаем актуальные контакты из Supabase
      const response = await fetch("/api/contacts")
      const contactsData = await response.json()

      const whatsappUrl = contactsData?.whatsappUrl || "https://wa.me/77016579054"
      const message = encodeURIComponent(
        `Здравствуйте! Я отправил заявку на ${product?.title}. Хотел бы уточнить детали.`,
      )
      window.open(`${whatsappUrl}?text=${message}`, "_blank")
    } catch (error) {
      console.error("Error loading contacts:", error)
      // Fallback к стандартному номеру
      const whatsappUrl = "https://wa.me/77016579054"
      const message = encodeURIComponent(
        `Здравствуйте! Я отправил заявку на ${product?.title}. Хотел бы уточнить детали.`,
      )
      window.open(`${whatsappUrl}?text=${message}`, "_blank")
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Запрос цены</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Информация о товаре */}
              <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image || "/placeholder.svg?height=64&width=64"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.title}</h3>
                  <Badge variant={product.type === "production" ? "default" : "secondary"} className="text-xs">
                    {product.type === "production" ? "Производим" : "Поставляем"}
                  </Badge>
                </div>
              </div>

              {/* Количество */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Количество</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-9 w-9 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-semibold">{quantity}</span>
                    <span className="text-sm text-muted-foreground ml-1">шт.</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    className="h-9 w-9 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Контактная информация */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Телефон <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messenger" className="text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Мессенджер <span className="text-sm text-muted-foreground">(необязательно)</span>
                  </Label>
                  <Input
                    id="messenger"
                    type="text"
                    placeholder="@username или ссылка на профиль"
                    value={messenger}
                    onChange={(e) => setMessenger(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Город <span className="text-red-500">*</span>
                  </Label>
                  <Select value={city} onValueChange={setCity} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      {kazakhstanCities.map((cityName) => (
                        <SelectItem key={cityName} value={cityName}>
                          {cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {city === "Другой" && (
                  <div className="space-y-2">
                    <Label htmlFor="customCity" className="text-sm font-medium">
                      Укажите ваш город <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customCity"
                      type="text"
                      placeholder="Введите название города"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 bg-transparent"
                  disabled={isLoading}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#ED1B23] hover:bg-[#d91621]"
                  disabled={isLoading || !phone || !city || (city === "Другой" && !customCity.trim())}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Отправка...
                    </div>
                  ) : (
                    "Отправить заявку"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* Экран успеха */
          <div className="text-center space-y-4 sm:space-y-6 py-2 sm:py-4 px-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-green-900">Заявка отправлена!</h3>
              <p className="text-xs sm:text-sm text-muted-foreground px-2">
                Ваша заявка пр��нята в обработку. Мы свяжемся с вами в ближайшее время для уточнения деталей и расчета
                стоимости.
              </p>
            </div>

            <div className="space-y-3 px-2">
              <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700 h-11 sm:h-10">
                <WhatsAppIcon className="h-4 w-4 mr-2" />
                Написать в WhatsApp
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>

              <Button onClick={handleClose} variant="outline" className="w-full bg-transparent h-11 sm:h-10">
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
