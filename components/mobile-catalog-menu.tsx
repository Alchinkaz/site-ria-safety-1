"use client"

import { useState } from "react"
import { X, ChevronRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MobileCatalogMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileCatalogMenu({ isOpen, onClose }: MobileCatalogMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // Обновленная структура каталога на основе предоставленных изображений
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
          "Привязи страховочные, удерживающие и для позиционирования",
          "Стропы",
          "Соединительные элементы",
          "Устройства для подъема и позиционирования",
          "Устройства для спуска и позиционирования",
          "Средства защиты втягивающего типа",
          "Гибкие анкерные линии",
          "Анкерные устройства",
          "Канаты",
          "Блок-ролики",
          "Защита от падения инструмента",
          "Спасение и эвакуация",
          "Инсталляционное оборудование",
          "Вспомогательное оборудование",
          "Прочие промышленные СИЗ",
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

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  const handleLinkClick = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Menu Content */}
      <div className="absolute inset-0 bg-white flex flex-col">
        {/* Header - фиксированный */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-[#ED1B23]">Каталог</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2 hover:bg-gray-100">
            <X className="h-6 w-6 text-gray-600" />
          </Button>
        </div>

        {/* Scrollable Content - скрытые полосы прокрутки */}
        <div
          className="flex-1 overflow-y-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="pb-4">
            {Object.entries(catalogStructure).map(([category, data]) => (
              <div key={category} className="border-b border-gray-100 last:border-b-0">
                {/* Main Category */}
                <div className="flex items-center bg-white">
                  <Link
                    href={data.href}
                    onClick={handleLinkClick}
                    className="flex-1 px-4 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {category}
                  </Link>
                  {Object.keys(data.subcategories).length > 0 && (
                    <button
                      onClick={() => toggleCategory(category)}
                      className="pr-4 pl-2 py-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedCategory === category ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategories - только основные подкатегории */}
                {expandedCategory === category && (
                  <div className="bg-gray-50 animate-in slide-in-from-top-2 duration-200">
                    {Object.keys(data.subcategories).map((subcategory) => (
                      <div key={subcategory} className="border-b border-gray-200 last:border-b-0">
                        <Link
                          href={`/catalog/${category.toLowerCase()}/${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={handleLinkClick}
                          className="flex items-center min-h-[56px] px-4 font-medium text-gray-800 hover:text-[#ED1B23] transition-colors text-left"
                        >
                          {subcategory}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer - фиксированный */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <Link
            href="/catalog"
            onClick={handleLinkClick}
            className="block w-full text-center py-3 px-4 bg-[#ED1B23] text-white rounded-lg hover:bg-[#d91621] transition-colors font-semibold shadow-md"
          >
            Посмотреть все товары
          </Link>
        </div>
      </div>
    </div>
  )
}
