"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, TrendingUp, BarChart3 } from "lucide-react"
import { productService, ordersService } from "@/lib/database"
import type { User, Order } from "@/lib/types"

interface DashboardProps {
  currentUser?: User
  onNavigate?: (tab: string) => void
}

export default function Dashboard({ currentUser, onNavigate }: DashboardProps = {}) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    productionCount: 0,
    supplyCount: 0,
    totalOrders: 0,
    newOrders: 0,
    todayOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Функция форматирования даты
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Дата не указана"
      }
      return date.toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Дата не указана"
    }
  }

  // Функция проверки, является ли дата сегодняшней
  const isToday = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const today = new Date()
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)

        // Загружаем товары
        const productsData = await productService.getAll()
        const totalProducts = productsData.production.length + productsData.supply.length

        // Загружаем заявки
        const ordersData = await ordersService.getAll()
        const newOrders = ordersData.filter((order) => order.status === "new").length
        const todayOrders = ordersData.filter((order) => isToday(order.createdAt)).length

        setStats({
          totalProducts,
          productionCount: productsData.production.length,
          supplyCount: productsData.supply.length,
          totalOrders: ordersData.length,
          newOrders,
          todayOrders,
        })

        // Последние 5 заявок
        setRecentOrders(ordersData.slice(0, 5))
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Добро пожаловать, {currentUser?.username || "admin"}!</h1>
          <p className="text-muted-foreground">Управляйте содержимым сайта через панель администратора</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Добро пожаловать, {currentUser?.username || "admin"}!</h1>
        <p className="text-muted-foreground">Управляйте содержимым сайта через панель администратора</p>
      </div>

      {/* Статистические карточки */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего товаров</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.productionCount} производим, {stats.supplyCount} поставляем
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заявки сегодня</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">Новых заявок за сегодня</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{stats.newOrders} новых, требуют обработки</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Статус системы</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Активна</div>
            <p className="text-xs text-muted-foreground">Все системы работают нормально</p>
          </CardContent>
        </Card>
      </div>

      {/* Последние заявки */}
      <h2 className="text-xl font-semibold">Последние заявки</h2>

      <Card>
        <CardContent className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Заявок пока нет</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    {order.productImage ? (
                      <img
                        src={order.productImage || "/placeholder.svg"}
                        alt={order.productName || "Товар"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const fallback = target.nextElementSibling as HTMLElement
                          if (fallback) fallback.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 hidden">
                      <Package className="h-6 w-6 text-slate-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{order.productName || "Товар не указан"}</h3>
                      <Badge variant={order.productType === "production" ? "default" : "secondary"}>
                        {order.productType === "production" ? "Производим" : "Поставляем"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Количество: {order.quantity} шт.</p>
                    <p className="text-sm text-muted-foreground">Контакт: {order.contact}</p>
                    <p className="text-sm text-muted-foreground">Город: {order.city}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        order.status === "new" ? "default" : order.status === "processing" ? "secondary" : "outline"
                      }
                      className={
                        order.status === "new"
                          ? "bg-orange-100 text-orange-800"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }
                    >
                      {order.status === "new" ? "Новая" : order.status === "processing" ? "В обработке" : "Завершена"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
