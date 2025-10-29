"use client"

import { useState, useEffect } from "react"
import { Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Footer() {
  const router = useRouter()
  const [contactsData, setContactsData] = useState<any>(null)

  // Загружаем контакты из Supabase
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
            email: "info@ria-safety.kz",
            address: "Республика Казахстан, 130000, Мангистауская область, г. Актау, 3Б микрорайон, здание 40",
          })
        }
      } catch (error) {
        console.error("Error loading contacts:", error)
        setContactsData({
          phone: "+7 (771) 116-57-59",
          email: "info@ria-safety.kz",
          address: "Республика Казахстан, 130000, Мангистауская область, г. Актау, 3Б микрорайон, здание 40",
        })
      }
    }

    loadContacts()
  }, [])

  // Функция для перехода на главную и скролла вверх
  const handleLogoClick = () => {
    router.push("/")
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-10 max-w-[1200px]">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <button onClick={handleLogoClick} className="flex items-center mb-4 cursor-pointer">
              <div className="h-8 w-auto">
                <Image
                  src="/ria-logo-white.svg"
                  alt="RIA Riafety"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </div>
            </button>
            <p className="text-slate-300 text-sm leading-relaxed">
              Производство и продажа спецодежды и СИЗ
            </p>
          </div>

          {/* Catalog */}
          <div className="md:pl-8">
            <h3 className="text-base font-semibold mb-4 text-white">Каталог</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Распродажа
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Новинки
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Спецодежда
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Спецобувь
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors text-sm">
                  СИЗ
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Защита рук
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">Информация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Обмен и возврат
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Дисконтная программа
                </Link>
              </li>
            </ul>
          </div>

          {/* About Company */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">Компания</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-300 hover:text-white transition-colors text-sm">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Производители
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">Контакты</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-white flex-shrink-0" />
                <a
                  href={`tel:${contactsData?.phone?.replace(/\s/g, "") || "+77711165759"}`}
                  className="text-slate-300 text-sm hover:text-white transition-colors cursor-pointer"
                >
                  {contactsData?.phone || "+7 (771) 116-57-59"}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-white flex-shrink-0" />
                <a
                  href={`mailto:${contactsData?.email || "iinfo@ria-safety.kz"}`}
                  className="text-slate-300 text-sm hover:text-white transition-colors cursor-pointer"
                >
                  {contactsData?.email || "info@ria-safety.kz"}
                </a>
              </div>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed">
              <p>
                {contactsData?.address ||
                  "Республика Казахстан, 130000, Мангистауская область, г. Актау, 3Б микрорайон, здание 40"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6">
          <div className="text-left text-slate-400 text-xs">
            © 2025 ТОО "Ria Safety". Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  )
}
