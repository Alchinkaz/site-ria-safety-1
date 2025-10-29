"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, ClockIcon, TrendingUp, Trash2, Package } from "lucide-react"
import { ordersService } from "@/lib/database"
import type { Order } from "@/lib/types"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
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
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const ordersData = await ordersService.getAll()
        setOrders(ordersData)
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const success = await ordersService.updateStatus(orderId, newStatus)
      if (success) {
        const updatedOrders = await ordersService.getAll()
        setOrders(updatedOrders)
      } else {
        alert("Ошибка при обновлении статуса заявки!")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Ошибка при обновлении статуса заявки!")
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Вы уверены, что хотите удалить эту заявку?")) {
      try {
        const success = await ordersService.delete(orderId)
        if (success) {
          const updatedOrders = await ordersService.getAll()
          setOrders(updatedOrders)
        } else {
          alert("Ошибка при удалении заявки!")
        }
      } catch (error) {
        console.error("Error deleting order:", error)
        alert("Ошибка при удалении заявки!")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Заявки с сайта</h1>
          <p className="text-muted-foreground">Просматривайте и управляйте заявками от клиентов</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const todayOrders = orders.filter((order) => isToday(order.createdAt))
  const newOrders = orders.filter((order) => order.status === "new")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Заявки с сайта</h1>
        <p className="text-muted-foreground">Просматривайте и управляйте заявками от клиентов</p>
      </div>

      {/* Статистика заявок */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новые заявки</CardTitle>
            <ClockIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{newOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сегодня</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Список заявок */}
      <Card>
        <CardHeader>
          <CardTitle>Все заявки</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Заявок пока нет</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
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
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{order.productName || "Товар не указан"}</h3>
                          <Badge variant={order.productType === "production" ? "default" : "secondary"}>
                            {order.productType === "production" ? "Производим" : "Поставляем"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Количество: {order.quantity} шт.</p>
                        <p className="text-sm text-muted-foreground">Контакт: {order.contact}</p>
                        <p className="text-sm text-muted-foreground">Город: {order.city}</p>
                        <p className="text-sm text-muted-foreground">Дата: {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value: Order["status"]) => handleUpdateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Новая</SelectItem>
                          <SelectItem value="processing">В обработке</SelectItem>
                          <SelectItem value="completed">Завершена</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => handleDeleteOrder(order.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                      {order.status === "new"
                        ? "Новая заявка"
                        : order.status === "processing"
                          ? "В обработке"
                          : "Завершена"}
                    </Badge>
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
