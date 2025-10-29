"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Phone, Mail, Clock, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
)

export default function ContactsPage() {
  const [contactsData, setContactsData] = useState({
    phone: "+7 (771) 116-57-59",
    email: "info@ria-safety.kz",
    address: "Республика Казахстан, 130000, Мангистауская область, г. Актау, 3Б микрорайон, здание 40",
    workingHours: {
      weekdays: "09:00 - 18:00",
      saturday: "09:00 - 15:00",
      sunday: "Выходной",
    },
    whatsappUrl: "https://wa.me/77711165759",
  })
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем данные из Supabase
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/contacts")
        const data = await response.json()

        if (data) {
          setContactsData(data)
        }
      } catch (error) {
        console.error("Error loading contacts:", error)
        // Используем дефолтные данные при ошибке
      } finally {
        setIsLoading(false)
      }
    }

    loadContacts()
  }, [])

  // Функция для открытия WhatsApp chat
  const openWhatsAppChat = () => {
    window.open(contactsData.whatsappUrl || "https://wa.me/77711165759", "_blank")
  }

  // Функция для прямого звонка
  const openCall = () => {
    window.open(`tel:${contactsData.phone.replace(/\s/g, "")}`, "_self")
  }

  // Функция для открытия 2ГИС
  const open2GIS = () => {
    window.open("https://2gis.kz/aktau/firm/70000001034219764?m=51.185455%2C43.640818%2F16", "_blank")
  }

  // Функция для открытия почтового клиента
  const openEmail = () => {
    window.location.href = `mailto:${contactsData.email}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка контактов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[rgba(248,248,248,1)]">
      <div className="bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-4 py-6 pt-24 lg:pt-32">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Контакты</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Contact Information */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Левая колонка с карточками - сужена до 2 колонок */}
            <div className="lg:col-span-2 space-y-4">
              {/* Телефон */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="h-3 w-3 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Телефон</h3>
                  </div>
                  <a
                    href={`tel:${contactsData.phone.replace(/\s/g, "")}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer font-medium text-base mb-2 block"
                  >
                    {contactsData.phone}
                  </a>
                  <p className="text-slate-600 text-xs mb-3">Мобильный телефон</p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={openCall} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                      <Phone className="mr-2 h-3 w-3" />
                      Позвонить
                    </Button>
                    <Button
                      onClick={openWhatsAppChat}
                      className="bg-green-600/20 hover:bg-green-600/30 text-green-700 border-green-200"
                      variant="outline"
                      size="sm"
                    >
                      <WhatsAppIcon className="mr-2 h-3 w-3" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Email */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-3 w-3 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Email</h3>
                  </div>
                  <button
                    onClick={openEmail}
                    className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer font-medium text-base mb-2 block"
                  >
                    {contactsData.email}
                  </button>
                  <p className="text-slate-600 text-xs mb-3">Основная почта</p>
                  <Button
                    onClick={openEmail}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 w-full bg-transparent"
                  >
                    <Mail className="mr-2 h-3 w-3" />
                    Написать
                  </Button>
                </div>
              </Card>

              {/* Режим работы */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="h-3 w-3 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Режим работы</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-700 font-medium text-sm">Пн - Пт:</span>
                      <span className="font-semibold text-slate-900 text-sm">{contactsData.workingHours.weekdays}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-700 font-medium text-sm">Суббота:</span>
                      <span className="font-semibold text-slate-900 text-sm">{contactsData.workingHours.saturday}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-700 font-medium text-sm">Воскресенье:</span>
                      <span className="text-slate-600 text-sm">{contactsData.workingHours.sunday}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Адрес */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-3 w-3 text-[#ED1B23]" />
                    </div>
                    <h3 className="text-lg font-semibold">Адрес</h3>
                  </div>
                  <div className="text-slate-700 leading-relaxed mb-3 text-sm">
                    {contactsData.address.split("\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700 hover:text-white w-full"
                    onClick={open2GIS}
                  >
                    <MapPin className="mr-2 h-3 w-3" />
                    Смотреть в 2ГИС
                  </Button>
                </div>
              </Card>
            </div>

            {/* Правая колонка с картой - расширена до 3 колонок */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div
                  className="w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                  style={{ aspectRatio: "16/10" }}
                >
                  <iframe
                    id="map_893777182"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    src="https://makemap.2gis.ru/widget?data=eJylUt1umzAUfhfvMqg1mOCQu9TZSCQP4arTRqdeRMHJ3JIYmUPTNMq779goe4FxgznfzznHHxdiXaOdbgptDxqc0T2Z_74QOHeazMk3vYHBaRKRztlOOwg4wgZajyPQ6H7rTAfGHrFQrRaTalXS7SEfnj-5eitFRmup-rJY0nqlBhAplW97Ku8f96WYUPmqIBdnKrmCEjHkQiM4rU_IecJzIahcqiEXcdDVEnXoJVfqHcQ9rZf-fdOj33om2a1_iufFRLx-nCoQu5FbfKXy1-O-KR58b9Tmo3_xnUrmv-N1-c8XZ92pHrzvk9fgLFK9myXWCun3QU7me-NeJ1rv_LwPYV_w86Jf43k__mOXxQQveWtb6_B6v-wSmtAMK5_rY6M_yDymt-cakf0Y4jlENCZYWXOE4IBBm-MGQsDT-C7mGctnUcrusimLM_aCetN4w4xfXyJy2HSV7c2Y64W0GyDzQE4Zp2mc8yRPk4i0Hg52nHE-i5MZZ0mG81l7QLMpuuL_Ydv25x-t2-dQBTfo618bHMG1&fullscreen=false"
                    sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
                    className="w-full h-full"
                    title="Карта 2ГИС - местоположение АПДТ"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
