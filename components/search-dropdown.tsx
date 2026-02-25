"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchDropdownProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (e?: React.FormEvent) => void
  isOpen: boolean
  onClose: () => void
}

export default function SearchDropdown({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isOpen,
  onClose,
}: SearchDropdownProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Загружаем недавние поиски из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Сохраняем поиск в недавние
  const saveSearch = (query: string) => {
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))
    }
  }

  // Удаляем поиск из недавних
  const removeSearch = (query: string) => {
    const updated = recentSearches.filter((s) => s !== query)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  // Обработка клика по недавнему поиску
  const handleRecentSearchClick = (query: string) => {
    onSearchChange(query)
    saveSearch(query)
    onSearchSubmit()
    onClose()
  }

  // Обработка отправки формы
  const handleSubmit = (e?: React.FormEvent) => {
    saveSearch(searchQuery)
    onSearchSubmit(e)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[10001] max-h-80 overflow-y-auto">
      {/* Недавние поиски */}
      {recentSearches.length > 0 && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Недавние поиски
            </h3>
          </div>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <div key={index} className="flex items-center justify-between group">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRecentSearchClick(search)
                  }}
                  className="flex-1 text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {search}
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeSearch(search)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Популярные поиски */}
      <div className="p-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Популярные поиски</h3>
        <div className="space-y-1">
          {["Каски", "Перчатки", "Респираторы", "Спецодежда", "Очки защитные"].map((search, index) => (
            <button
              key={index}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleRecentSearchClick(search)
              }}
              className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Кнопка поиска */}
      {searchQuery.trim() && (
        <div className="p-4 border-t border-gray-100">
          <Button
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleSubmit()
            }}
            className="w-full bg-[#ED1B23] hover:bg-[#d91621] text-white"
          >
            <Search className="h-4 w-4 mr-2" />
            Найти "{searchQuery}"
          </Button>
        </div>
      )}
    </div>
  )
}
