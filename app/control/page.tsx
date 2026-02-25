"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Package,
  Home,
  Phone,
  LogOut,
  Plus,
  Trash2,
  Users,
  SettingsIcon,
  Edit3,
  BarChart3,
  ShoppingCart,
  ClockIcon,
  TrendingUp,
  Award,
  FileText,
  Settings,
  Clock,
  Shield,
  Star,
  Trophy,
  Target,
  Zap,
  Heart,
  CheckCircle,
  Lightbulb,
  Rocket,
  Globe,
  Cpu,
  Database,
  Wifi,
  Battery,
  Smartphone,
  Monitor,
  Headphones,
  Camera,
  Printer,
  HardDrive,
  Keyboard,
  Mouse,
  Speaker,
  Microscope as Microphone,
  Gamepad2,
  Tablet,
  Watch,
  Car,
  Plane,
  Ship,
  Truck,
  Bike,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Key, UserCheck } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, UserPlus } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Импорт сервисов для работы с Supabase
import { userService, productService, homepageService, contactsService, ordersService } from "@/lib/database"
import type { User, Product, Order } from "@/lib/types"

// Lazy-load dashboard
import dynamic from "next/dynamic"
const Dashboard = dynamic(() => import("./dashboard/page").then((m) => m.default), {
  ssr: false,
  loading: () => null,
})

// Доступные иконки для преимуществ
const availableIcons = {
  Award,
  FileText,
  Settings,
  Clock,
  Shield,
  Star,
  Trophy,
  Target,
  Zap,
  Heart,
  CheckCircle,
  Lightbulb,
  Rocket,
  Globe,
  Cpu,
  Database,
  Wifi,
  Battery,
  Smartphone,
  Monitor,
  Headphones,
  Camera,
  Printer,
  HardDrive,
  Keyboard,
  Mouse,
  Speaker,
  Microphone,
  Gamepad2,
  Tablet,
  Watch,
  Car,
  Plane,
  Ship,
  Truck,
  Bike,
  Package,
  Home,
  Phone,
}

// Цветовые схемы
const colorSchemes = {
  green: { bg: "bg-green-100", text: "text-green-800", icon: "text-green-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-800", icon: "text-blue-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-800", icon: "text-purple-600" },
  red: { bg: "bg-red-100", text: "text-red-800", icon: "text-red-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "text-yellow-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-800", icon: "text-indigo-600" },
  pink: { bg: "bg-pink-100", text: "text-pink-800", icon: "text-pink-600" },
  teal: { bg: "bg-teal-100", text: "text-teal-800", icon: "text-teal-600" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-800", icon: "text-cyan-600" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-800", icon: "text-emerald-600" },
  lime: { bg: "bg-lime-100", text: "text-lime-800", icon: "text-lime-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-800", icon: "text-amber-600" },
  rose: { bg: "bg-rose-100", text: "text-rose-800", icon: "text-rose-600" },
  violet: { bg: "bg-violet-100", text: "text-violet-800", icon: "text-violet-600" },
  slate: { bg: "bg-slate-100", text: "text-slate-800", icon: "text-slate-600" },
}

// Компонент формы редактирования товара
const ProductEditForm = ({ product, onSave, onCancel }: any) => {
  const [localData, setLocalData] = useState(() => ({
    ...product,
    features: product.features || [""],
    technical_specs: product.technical_specs || [{ name: "", value: "" }],
    applications: product.applications || [""],
    advantages: product.advantages || [""],
    additional_images: product.additional_images || [],
  }))

  const updateLocalData = (field: string, value: any) => {
    setLocalData((prev) => ({ ...prev, [field]: value }))
  }

  const updateArray = (field: string, index: number, value: any) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) => (i === index ? value : item)),
    }))
  }

  const addToArray = (field: string, defaultValue: any) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }))
  }

  const removeFromArray = (field: string, index: number) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }))
  }

  const addAdditionalImage = () => {
    setLocalData((prev) => ({
      ...prev,
      additional_images: [...prev.additional_images, ""],
    }))
  }

  const removeAdditionalImage = (index: number) => {
    setLocalData((prev) => ({
      ...prev,
      additional_images: prev.additional_images.filter((_: any, i: number) => i !== index),
    }))
  }

  const updateAdditionalImage = (index: number, value: string) => {
    setLocalData((prev) => ({
      ...prev,
      additional_images: prev.additional_images.map((img: string, i: number) => (i === index ? value : img)),
    }))
  }

  const handleSave = () => {
    onSave(localData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Редактировать товар</h1>
          <p className="text-muted-foreground">Изменить информацию о товаре</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onCancel} variant="outline">
            Отмена
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Сохранить изменения
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Изображения товара</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Image */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Основное изображение</Label>
                <div className="space-y-3">
                  <div className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {localData.image ? (
                      <img
                        src={localData.image || "/placeholder.svg"}
                        alt="Основное изображение"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div className="text-center text-slate-500 hidden">
                      <Package className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Предварительный просмотр</p>
                    </div>
                  </div>
                  <Input
                    value={localData.image || ""}
                    onChange={(e) => updateLocalData("image", e.target.value)}
                    placeholder="Ссылка на основное изображение"
                  />
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Дополнительные изображения</Label>
                  <Button onClick={addAdditionalImage} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Добавить
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {localData.additional_images.map((image: string, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-video bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center overflow-hidden">
                        {image ? (
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Дополнительное ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove("hidden")
                            }}
                          />
                        ) : null}
                        <div className="text-center text-slate-400 hidden">
                          <Package className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs">Предпросмотр</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={image}
                          onChange={(e) => updateAdditionalImage(index, e.target.value)}
                          placeholder={`Ссылка на изображение ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => removeAdditionalImage(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {localData.additional_images.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p className="text-sm">Дополнительные изображения не добавлены</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Название товара</Label>
                  <Input
                    id="title"
                    value={localData.title || ""}
                    onChange={(e) => updateLocalData("title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="id">ID товара (для URL)</Label>
                  <Input id="id" value={localData.id || ""} onChange={(e) => updateLocalData("id", e.target.value)} />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Краткое описание</Label>
                <Textarea
                  id="description"
                  value={localData.description || ""}
                  onChange={(e) => updateLocalData("description", e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="full_description">Полное описание</Label>
                <Textarea
                  id="full_description"
                  value={localData.full_description || ""}
                  onChange={(e) => updateLocalData("full_description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Тип товара</Label>
                  <Select
                    value={localData.type || "production"}
                    onValueChange={(value) => updateLocalData("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Производим</SelectItem>
                      <SelectItem value="supply">Поставляем</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Особенности */}
          <Card>
            <CardHeader>
              <CardTitle>Особенности товара</CardTitle>
            </CardHeader>
            <CardContent>
              {localData.features.map((feature: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateArray("features", index, e.target.value)}
                    placeholder={`Особенность ${index + 1}`}
                  />
                  <Button onClick={() => removeFromArray("features", index)} size="sm" variant="outline" type="button">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={() => addToArray("features", "")} size="sm" variant="outline" type="button">
                <Plus className="h-4 w-4 mr-2" />
                Добавить особенность
              </Button>
            </CardContent>
          </Card>

          {/* Технические характеристики */}
          <Card>
            <CardHeader>
              <CardTitle>Технические характеристики</CardTitle>
            </CardHeader>
            <CardContent>
              {localData.technical_specs.map((spec: any, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={spec.name || ""}
                    onChange={(e) => {
                      const newSpecs = [...localData.technical_specs]
                      newSpecs[index] = { ...newSpecs[index], name: e.target.value }
                      updateLocalData("technical_specs", newSpecs)
                    }}
                    placeholder="Название характеристики"
                  />
                  <Input
                    value={spec.value || ""}
                    onChange={(e) => {
                      const newSpecs = [...localData.technical_specs]
                      newSpecs[index] = { ...newSpecs[index], value: e.target.value }
                      updateLocalData("technical_specs", newSpecs)
                    }}
                    placeholder="Значение"
                  />
                  <Button
                    onClick={() => removeFromArray("technical_specs", index)}
                    size="sm"
                    variant="outline"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => addToArray("technical_specs", { name: "", value: "" })}
                size="sm"
                variant="outline"
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить характеристику
              </Button>
            </CardContent>
          </Card>

          {/* Области применения */}
          <Card>
            <CardHeader>
              <CardTitle>Области применения</CardTitle>
            </CardHeader>
            <CardContent>
              {localData.applications.map((application: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={application}
                    onChange={(e) => updateArray("applications", index, e.target.value)}
                    placeholder={`Область применения ${index + 1}`}
                  />
                  <Button
                    onClick={() => removeFromArray("applications", index)}
                    size="sm"
                    variant="outline"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={() => addToArray("applications", "")} size="sm" variant="outline" type="button">
                <Plus className="h-4 w-4 mr-2" />
                Добавить область применения
              </Button>
            </CardContent>
          </Card>

          {/* Преимущества */}
          <Card>
            <CardHeader>
              <CardTitle>Преимущества товара</CardTitle>
            </CardHeader>
            <CardContent>
              {localData.advantages.map((advantage: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={advantage}
                    onChange={(e) => updateArray("advantages", index, e.target.value)}
                    placeholder={`Преимущество ${index + 1}`}
                  />
                  <Button
                    onClick={() => removeFromArray("advantages", index)}
                    size="sm"
                    variant="outline"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={() => addToArray("advantages", "")} size="sm" variant="outline" type="button">
                <Plus className="h-4 w-4 mr-2" />
                Добавить преимущество
              </Button>
            </CardContent>
          </Card>

          {/* Настройки отображения */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки отображения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_features">Показывать особенности</Label>
                  <Switch
                    id="show_features"
                    checked={localData.show_features || false}
                    onCheckedChange={(checked) => updateLocalData("show_features", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_advantages">Показывать преимущества</Label>
                  <Switch
                    id="show_advantages"
                    checked={localData.show_advantages || false}
                    onCheckedChange={(checked) => updateLocalData("show_advantages", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_applications">Показывать области применения</Label>
                  <Switch
                    id="show_applications"
                    checked={localData.show_applications || false}
                    onCheckedChange={(checked) => updateLocalData("show_applications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_download_button">Показывать кнопку скачивания</Label>
                  <Switch
                    id="show_download_button"
                    checked={localData.show_download_button || false}
                    onCheckedChange={(checked) => updateLocalData("show_download_button", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_on_homepage">Показывать на главной</Label>
                  <Switch
                    id="show_on_homepage"
                    checked={localData.show_on_homepage || false}
                    onCheckedChange={(checked) => updateLocalData("show_on_homepage", checked)}
                  />
                </div>
              </div>

              {localData.show_download_button && (
                <div className="mt-4">
                  <Label htmlFor="document_url">Ссылка на документ для скачивания</Label>
                  <Input
                    id="document_url"
                    value={localData.document_url || ""}
                    onChange={(e) => updateLocalData("document_url", e.target.value)}
                    placeholder="https://example.com/document.pdf"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Состояния для управления пользователями
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "admin" as const,
    permissions: {
      homepage: false,
      products: false,
      contacts: false,
    },
  })

  const [showSwitchUser, setShowSwitchUser] = useState(false)

  // Данные для управления
  const [products, setProducts] = useState<{ production: Product[]; supply: Product[] }>({
    production: [],
    supply: [],
  })
  const [homepageData, setHomepageData] = useState<any>(null)
  const [contactsData, setContactsData] = useState<any>(null)

  // Состояния для редактирования главной страницы и контактов
  const [homepageEditData, setHomepageEditData] = useState<any>(null)
  const [contactsEditData, setContactsEditData] = useState<any>(null)
  const [hasHomepageChanges, setHasHomepageChanges] = useState(false)
  const [hasContactsChanges, setHasContactsChanges] = useState(false)

  // Проверка авторизации и загрузка данных пользователя
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("admin_token")
        const userData = localStorage.getItem("current_user")

        if (token === "authenticated" && userData) {
          const user = JSON.parse(userData)
          setCurrentUser(user)
          setIsAuthenticated(true)

          // Загружаем пользователей
          const usersData = await userService.getAll()
          setUsers(usersData)

          // Загружаем заявки
          const ordersData = await ordersService.getAll()
          setOrders(ordersData)

          // Загружаем остальные данные
          await loadAllData()

          // Получаем активную вкладку из URL параметров
          const tabFromUrl = searchParams.get("tab")
          const availableTabsValues = getAvailableTabs(user).map((tab) => tab.value)

          if (tabFromUrl && availableTabsValues.includes(tabFromUrl)) {
            setActiveTab(tabFromUrl)
          } else {
            setActiveTab("dashboard")
          }
        } else {
          router.push("/control/login")
          return
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        router.push("/control/login")
        return
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [searchParams.toString(), router])

  // Загрузка всех данных
  const loadAllData = async () => {
    try {
      const [productsData, homepageResult, contactsResult] = await Promise.all([
        productService.getAll(),
        homepageService.getAll(),
        contactsService.get(),
      ])

      setProducts(productsData)
      setHomepageData(homepageResult)
      setContactsData(contactsResult)
      setHomepageEditData(homepageResult)
      setContactsEditData(contactsResult)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("current_user")
    router.push("/control/login")
  }

  const handleSwitchUser = () => {
    setShowSwitchUser(true)
  }

  const handleSelectUser = async (selectedUser: User) => {
    try {
      // Обновляем время последнего входа
      await userService.updateLastLogin(selectedUser.id)

      // Сохраняем нового пользователя как текущего
      setCurrentUser(selectedUser)
      localStorage.setItem("current_user", JSON.stringify(selectedUser))

      setShowSwitchUser(false)
      setActiveTab("dashboard")

      alert(`Вы вошли как ${selectedUser.username}`)
    } catch (error) {
      console.error("Error switching user:", error)
      alert("Ошибка при переключении пользователя")
    }
  }

  // Функции управления пользователями
  const handleAddUser = async () => {
    if (newUser.username && newUser.password && newUser.password === newUser.confirmPassword) {
      try {
        const user = await userService.create({
          username: newUser.username,
          password: newUser.password,
          role: newUser.role,
          permissions: {
            ...newUser.permissions,
            ...(newUser.role === "superadmin" ? { users: true, orders: true } : {}),
          },
        })

        if (user) {
          const updatedUsers = await userService.getAll()
          setUsers(updatedUsers)

          setNewUser({
            username: "",
            password: "",
            confirmPassword: "",
            role: "admin",
            permissions: {
              homepage: false,
              products: false,
              contacts: false,
            },
          })
          setShowAddUser(false)
          alert("✅ Пользователь успешно создан!")
        } else {
          alert("Ошибка при создании ��ользователя!")
        }
      } catch (error) {
        console.error("Error creating user:", error)
        alert("Ошибка при создании пользователя!")
      }
    } else {
      if (!newUser.username) {
        alert("Введите имя пользователя!")
      } else if (!newUser.password) {
        alert("Введите пароль!")
      } else if (newUser.password !== newUser.confirmPassword) {
        alert("Пароли не совпадают!")
      }
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user })
  }

  const handleSaveUser = async () => {
    if (editingUser) {
      try {
        const updatedUser = await userService.update(editingUser.id, editingUser)
        if (updatedUser) {
          const updatedUsers = await userService.getAll()
          setUsers(updatedUsers)

          // Если редактируем текущего пользователя, обновляем его данные
          if (currentUser && currentUser.id === editingUser.id) {
            setCurrentUser(updatedUser)
            localStorage.setItem("current_user", JSON.stringify(updatedUser))
          }

          setEditingUser(null)
          alert("✅ Пользователь успешно обновлен!")
        }
      } catch (error) {
        console.error("Error updating user:", error)
        alert("Ошибка при обновлении пользователя!")
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (currentUser?.id === userId) {
      alert("Нельзя удалить самого себя!")
      return
    }

    if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      try {
        const success = await userService.delete(userId)
        if (success) {
          const updatedUsers = await userService.getAll()
          setUsers(updatedUsers)
          alert("✅ Пользователь успешно удален!")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Ошибка при удалении пользователя!")
      }
    }
  }

  const handleChangePassword = async () => {
    if (!currentUser) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Новые пароли не совпадают!")
      return
    }

    if (currentUser.password !== passwordData.currentPassword) {
      alert("Неверный текущий пароль!")
      return
    }

    try {
      const updatedUser = await userService.update(currentUser.id, { password: passwordData.newPassword })
      if (updatedUser) {
        setCurrentUser(updatedUser)
        localStorage.setItem("current_user", JSON.stringify(updatedUser))

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setShowChangePassword(false)
        alert("Пароль успешно изменен!")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      alert("Ошибка при изменении пароля!")
    }
  }

  // Функции управления заявками
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const success = await ordersService.updateStatus(orderId, newStatus)
      if (success) {
        const updatedOrders = await ordersService.getAll()
        setOrders(updatedOrders)
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
        }
      } catch (error) {
        console.error("Error deleting order:", error)
        alert("Ошибка при удалении заявки!")
      }
    }
  }

  // Функции управления товарами
  const handleEditProduct = (product: Product, type: string) => {
    setEditingProduct({ ...product, type })
  }

  const handleSaveProduct = async (updatedProduct: any) => {
    try {
      const success = await productService.update(updatedProduct.id, updatedProduct)
      if (success) {
        const updatedProducts = await productService.getAll()
        setProducts(updatedProducts)
        setEditingProduct(null)
        alert("✅ Товар успешно сохранен!")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Ошибка при сохранении товара!")
    }
  }

  const handleDeleteProduct = async (id: string, type: string) => {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
      try {
        const success = await productService.delete(id)
        if (success) {
          const updatedProducts = await productService.getAll()
          setProducts(updatedProducts)
          alert("✅ Товар успешно удален!")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Ошибка при удалении товара!")
      }
    }
  }

  const handleAddProduct = async (newProductData: any) => {
    if (newProductData.title && newProductData.id) {
      try {
        const product = await productService.create(newProductData)
        if (product) {
          const updatedProducts = await productService.getAll()
          setProducts(updatedProducts)

          setNewProduct({
            id: "",
            title: "",
            description: "",
            image: "",
            additional_images: [],
            features: [""],
            type: "production",
            full_description: "",
            technical_specs: [{ name: "", value: "" }],
            applications: [""],
            advantages: [""],
            show_advantages: true,
            show_applications: true,
            show_download_button: true,
            document_url: "",
            show_on_homepage: false,
            show_features: true,
          })
          setShowAddProduct(false)
          alert("✅ Товар успешно добавлен!")
        }
      } catch (error) {
        console.error("Error adding product:", error)
        alert("Ошибка при добавлении товара!")
      }
    }
  }

  // Функции управления главной страницей
  const handleSaveHomepage = async () => {
    try {
      // Обновляем каждую секцию отдельно
      const sections = ["hero", "advantages", "about", "certificates", "cta"]
      for (const section of sections) {
        if (homepageEditData[section]) {
          await homepageService.updateSection(section, homepageEditData[section])
        }
      }

      setHomepageData(homepageEditData)
      setHasHomepageChanges(false)
      alert("✅ Данные главной страницы обновлены!")
    } catch (error) {
      console.error("Error updating homepage:", error)
      alert("Ошибка при обновлении главной страницы!")
    }
  }

  const handleCancelHomepage = () => {
    setHomepageEditData(homepageData)
    setHasHomepageChanges(false)
  }

  // Функции управления контактами
  const handleSaveContacts = async () => {
    try {
      const success = await contactsService.update(contactsEditData)
      if (success) {
        setContactsData(contactsEditData)
        setHasContactsChanges(false)
        alert("✅ Контактные данные обновлены!")
      }
    } catch (error) {
      console.error("Error updating contacts:", error)
      alert("Ошибка при обновлении контактов!")
    }
  }

  const handleCancelContacts = () => {
    setContactsEditData(contactsData)
    setHasContactsChanges(false)
  }

  // Проверка прав доступа
  const hasPermission = (permission: keyof User["permissions"]) => {
    return currentUser?.permissions[permission] === true
  }

  // Получение доступных вкладок
  const getAvailableTabs = (user: User) => {
    return [
      { value: "dashboard", label: "Дашборд", icon: BarChart3 },
      ...(user.permissions.products ? [{ value: "products", label: "Товары", icon: Package }] : []),
      ...(user.permissions.homepage ? [{ value: "homepage", label: "Главная страница", icon: Home }] : []),
      ...(user.permissions.contacts ? [{ value: "contacts", label: "Контакты", icon: Phone }] : []),
      ...(user.permissions.users ? [{ value: "users", label: "Пользователи", icon: Users }] : []),
      { value: "orders", label: "Заявки", icon: ShoppingCart },
      { value: "profile", label: "Профиль", icon: SettingsIcon },
    ]
  }

  // Получение названия текущей вкладки
  const getCurrentTabName = () => {
    const tab = availableTabs.find((tab) => tab.value === activeTab)
    return tab?.label || "Дашборд"
  }

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

  const [newProduct, setNewProduct] = useState({
    id: "",
    title: "",
    description: "",
    image: "",
    additional_images: [],
    features: [""],
    type: "production",
    full_description: "",
    technical_specs: [{ name: "", value: "" }],
    applications: [""],
    advantages: [""],
    show_advantages: true,
    show_applications: true,
    show_download_button: true,
    document_url: "",
    show_on_homepage: false,
    show_features: true,
  })

  // Показываем загрузочный экран пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка панели управления...</p>
        </div>
      </div>
    )
  }

  // Если не авторизован, не показываем ничего (редирект уже произошел)
  if (!isAuthenticated || !currentUser) {
    return null
  }

  const availableTabs = getAvailableTabs(currentUser)

  // Если открыта форма редактирования товара, показываем её
  if (editingProduct) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar variant="inset">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-3">
                <Link href="/" className="flex items-center">
                  <Image
                    src="https://zelimhan1965.github.io/apdt_assets/assets/apdt.svg"
                    alt="АПДТ"
                    width={180}
                    height={54}
                    className="h-14 w-auto"
                    priority
                  />
                </Link>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Управление</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {availableTabs.map((tab) => (
                      <SidebarMenuItem key={tab.value}>
                        <SidebarMenuButton
                          onClick={() => {
                            setEditingProduct(null)
                            setActiveTab(tab.value)
                          }}
                          isActive={activeTab === tab.value}
                          className="w-full"
                        >
                          <tab.icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex flex-col gap-1 p-2">
                    <div
                      onClick={() => setActiveTab("profile")}
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600">
                          {currentUser.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{currentUser.username}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {currentUser.role === "superadmin" ? "Супер-администратор" : "Администратор"}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-2" />
                    <div className="mt-2">
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="sm"
                        className="justify-start h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Выход из системы
                      </Button>
                    </div>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={() => {
                          setEditingProduct(null)
                          setActiveTab("dashboard")
                        }}
                        className="cursor-pointer hover:text-foreground"
                      >
                        Панель управления
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>Редактирование товара</BreadcrumbPage>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <ProductEditForm
                product={editingProduct}
                onSave={handleSaveProduct}
                onCancel={() => setEditingProduct(null)}
              />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  // Основной интерфейс админ-панели
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar variant="inset">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-3">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://zelimhan1965.github.io/apdt_assets/assets/apdt.svg"
                  alt="АПДТ"
                  width={180}
                  height={54}
                  className="h-14 w-auto"
                  priority
                />
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Управление</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {availableTabs.map((tab) => (
                    <SidebarMenuItem key={tab.value}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(tab.value)}
                        isActive={activeTab === tab.value}
                        className="w-full"
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex flex-col gap-1 p-2">
                  <div
                    onClick={() => setActiveTab("profile")}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{currentUser.username}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {currentUser.role === "superadmin" ? "Супер-администратор" : "Администратор"}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-2" />
                  <div className="mt-2">
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Выход из системы
                    </Button>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => setActiveTab("dashboard")}
                      className="cursor-pointer hover:text-foreground"
                    >
                      Панель управления
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {activeTab !== "dashboard" && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbPage>{getCurrentTabName()}</BreadcrumbPage>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Dashboard */}
            {activeTab === "dashboard" && (
              <div>
                <Dashboard />
              </div>
            )}

            {/* Управление товарами */}
            {activeTab === "products" && hasPermission("products") && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Управление товарами</h1>
                    <p className="text-muted-foreground">
                      Добавляйте, редактируйте и управляйте товарами вашего каталога
                    </p>
                  </div>
                  <Button onClick={() => setShowAddProduct(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить товар
                  </Button>
                </div>

                {/* Производимые товары */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Settings className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Производим</CardTitle>
                        <p className="text-sm text-muted-foreground">{products.production.length} товаров</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {products.production.map((product) => (
                        <Card key={product.id} className="group border border-slate-200 overflow-hidden">
                          <div className="relative h-32 bg-slate-100 overflow-hidden">
                            <div className="absolute top-2 right-2 z-10">
                              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800">
                                {product.show_on_homepage ? "На главной" : "В каталоге"}
                              </Badge>
                            </div>
                            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 group-hover:scale-105 transition-transform duration-500">
                              {product.image ? (
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = "none"
                                    target.nextElementSibling?.classList.remove("hidden")
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full flex items-center justify-center hidden">
                                <Package className="h-8 w-8 text-slate-400" />
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditProduct(product, "production")}
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <Edit3 className="h-3 w-3 mr-1" />
                                Редактировать
                              </Button>
                              <Button
                                onClick={() => handleDeleteProduct(product.id, "production")}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Поставляемые товары */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Поставляем</CardTitle>
                        <p className="text-sm text-muted-foreground">{products.supply.length} товаров</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {products.supply.map((product) => (
                        <Card key={product.id} className="group border border-slate-200 overflow-hidden">
                          <div className="relative h-32 bg-slate-100 overflow-hidden">
                            <div className="absolute top-2 right-2 z-10">
                              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                Поставляем
                              </Badge>
                            </div>
                            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 group-hover:scale-105 transition-transform duration-500">
                              {product.image ? (
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = "none"
                                    target.nextElementSibling?.classList.remove("hidden")
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full flex items-center justify-center hidden">
                                <Package className="h-8 w-8 text-slate-400" />
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditProduct(product, "supply")}
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <Edit3 className="h-3 w-3 mr-1" />
                                Редактировать
                              </Button>
                              <Button
                                onClick={() => handleDeleteProduct(product.id, "supply")}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Управление главной страницей */}
            {activeTab === "homepage" && hasPermission("homepage") && homepageEditData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Редактирование главной страницы</h1>
                    <p className="text-muted-foreground">Настройте содержимое главной страницы сайта</p>
                  </div>
                  {hasHomepageChanges && (
                    <div className="flex gap-2">
                      <Button onClick={handleCancelHomepage} variant="outline">
                        Отмена
                      </Button>
                      <Button onClick={handleSaveHomepage} className="bg-blue-600 hover:bg-blue-700">
                        Сохранить изменения
                      </Button>
                    </div>
                  )}
                </div>

                {/* Hero секция */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hero секция</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="hero-badge">Бейдж</Label>
                      <Input
                        id="hero-badge"
                        value={homepageEditData.hero?.badge || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            hero: { ...homepageEditData.hero, badge: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-title">Заголовок</Label>
                      <Input
                        id="hero-title"
                        value={homepageEditData.hero?.title || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            hero: { ...homepageEditData.hero, title: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-subtitle">Подзаголовок</Label>
                      <Textarea
                        id="hero-subtitle"
                        value={homepageEditData.hero?.subtitle || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            hero: { ...homepageEditData.hero, subtitle: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-image">Фоновое изображение (URL)</Label>
                      <Input
                        id="hero-image"
                        value={homepageEditData.hero?.backgroundImage || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            hero: { ...homepageEditData.hero, backgroundImage: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                        placeholder="https://example.com/hero-background.jpg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Если изображение не указано, будет использован синий градиент
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Преимущества */}
                <Card>
                  <CardHeader>
                    <CardTitle>Преимущества компании</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {homepageEditData.advantages?.map((advantage, index) => (
                      <div key={advantage.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Преимущество {index + 1}</h4>
                          <Button
                            onClick={() => {
                              const newAdvantages = homepageEditData.advantages.filter((_, i) => i !== index)
                              const newData = { ...homepageEditData, advantages: newAdvantages }
                              setHomepageEditData(newData)
                              setHasHomepageChanges(true)
                            }}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Заголовок</Label>
                            <Input
                              value={advantage.title}
                              onChange={(e) => {
                                const newAdvantages = [...homepageEditData.advantages]
                                newAdvantages[index] = { ...advantage, title: e.target.value }
                                const newData = { ...homepageEditData, advantages: newAdvantages }
                                setHomepageEditData(newData)
                                setHasHomepageChanges(true)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Иконка</Label>
                            <Select
                              value={advantage.icon}
                              onValueChange={(value) => {
                                const newAdvantages = [...homepageEditData.advantages]
                                newAdvantages[index] = { ...advantage, icon: value }
                                const newData = { ...homepageEditData, advantages: newAdvantages }
                                setHomepageEditData(newData)
                                setHasHomepageChanges(true)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-60">
                                {Object.entries(availableIcons).map(([iconName, IconComponent]) => (
                                  <SelectItem key={iconName} value={iconName}>
                                    <div className="flex items-center gap-2">
                                      <IconComponent className="h-4 w-4" />
                                      <span>{iconName}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea
                            value={advantage.description}
                            onChange={(e) => {
                              const newAdvantages = [...homepageEditData.advantages]
                              newAdvantages[index] = { ...advantage, description: e.target.value }
                              const newData = { ...homepageEditData, advantages: newAdvantages }
                              setHomepageEditData(newData)
                              setHasHomepageChanges(true)
                            }}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label>Цветовая схема</Label>
                          <Select
                            value={advantage.color}
                            onValueChange={(value) => {
                              const newAdvantages = [...homepageEditData.advantages]
                              newAdvantages[index] = { ...advantage, color: value }
                              const newData = { ...homepageEditData, advantages: newAdvantages }
                              setHomepageEditData(newData)
                              setHasHomepageChanges(true)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(colorSchemes).map(([colorName, colorScheme]) => (
                                <SelectItem key={colorName} value={colorName}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded ${colorScheme.bg}`} />
                                    <span className="capitalize">{colorName}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        const newAdvantage = {
                          id: `advantage_${Date.now()}`,
                          title: "Новое преимущество",
                          description: "Описание преимущества",
                          icon: "Award",
                          color: "green",
                        }
                        const newData = {
                          ...homepageEditData,
                          advantages: [...(homepageEditData.advantages || []), newAdvantage],
                        }
                        setHomepageEditData(newData)
                        setHasHomepageChanges(true)
                      }}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить преимущество
                    </Button>
                  </CardContent>
                </Card>

                {/* О компании */}
                <Card>
                  <CardHeader>
                    <CardTitle>О компании</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="about-title">Заголовок</Label>
                      <Input
                        id="about-title"
                        value={homepageEditData.about?.title || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            about: { ...homepageEditData.about, title: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-text1">Первый абзац</Label>
                      <Textarea
                        id="about-text1"
                        value={homepageEditData.about?.text1 || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            about: { ...homepageEditData.about, text1: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-text2">Второй абзац</Label>
                      <Textarea
                        id="about-text2"
                        value={homepageEditData.about?.text2 || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            about: { ...homepageEditData.about, text2: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-image">Изображение (URL)</Label>
                      <Input
                        id="about-image"
                        value={homepageEditData.about?.image || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            about: { ...homepageEditData.about, image: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                        placeholder="https://example.com/about-image.jpg"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Сертификаты */}
                <Card>
                  <CardHeader>
                    <CardTitle>Сертификаты</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {homepageEditData.certificates?.map((cert, index) => (
                      <div key={cert.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Сертификат {index + 1}</h4>
                          <Button
                            onClick={() => {
                              const newCertificates = homepageEditData.certificates.filter((_, i) => i !== index)
                              const newData = { ...homepageEditData, certificates: newCertificates }
                              setHomepageEditData(newData)
                              setHasHomepageChanges(true)
                            }}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Название</Label>
                            <Input
                              value={cert.title}
                              onChange={(e) => {
                                const newCertificates = [...homepageEditData.certificates]
                                newCertificates[index] = { ...cert, title: e.target.value }
                                const newData = { ...homepageEditData, certificates: newCertificates }
                                setHomepageEditData(newData)
                                setHasHomepageChanges(true)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Изображение (URL)</Label>
                            <Input
                              value={cert.image}
                              onChange={(e) => {
                                const newCertificates = [...homepageEditData.certificates]
                                newCertificates[index] = { ...cert, image: e.target.value }
                                const newData = { ...homepageEditData, certificates: newCertificates }
                                setHomepageEditData(newData)
                                setHasHomepageChanges(true)
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea
                            value={cert.description}
                            onChange={(e) => {
                              const newCertificates = [...homepageEditData.certificates]
                              newCertificates[index] = { ...cert, description: e.target.value }
                              const newData = { ...homepageEditData, certificates: newCertificates }
                              setHomepageEditData(newData)
                              setHasHomepageChanges(true)
                            }}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label>Ссылка на документ (URL)</Label>
                          <Input
                            value={cert.documentUrl || ""}
                            onChange={(e) => {
                              const newCertificates = [...homepageEditData.certificates]
                              newCertificates[index] = { ...cert, documentUrl: e.target.value }
                              const newData = { ...homepageEditData, certificates: newCertificates }
                              setHomepageEditData(newData)
                              setHasHomepageChanges(true)
                            }}
                            placeholder="https://example.com/certificate.pdf"
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        const newCertificate = {
                          id: `cert_${Date.now()}`,
                          title: "Новый сертификат",
                          description: "Описание сертификата",
                          image: "/placeholder.svg?height=400&width=300",
                          documentUrl: "",
                        }
                        const newData = {
                          ...homepageEditData,
                          certificates: [...(homepageEditData.certificates || []), newCertificate],
                        }
                        setHomepageEditData(newData)
                        setHasHomepageChanges(true)
                      }}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить сертификат
                    </Button>
                  </CardContent>
                </Card>

                {/* CTA секция */}
                <Card>
                  <CardHeader>
                    <CardTitle>Призыв к действию (CTA)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cta-title">Заголовок</Label>
                      <Input
                        id="cta-title"
                        value={homepageEditData.cta?.title || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            cta: { ...homepageEditData.cta, title: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cta-subtitle">Подзаголовок</Label>
                      <Textarea
                        id="cta-subtitle"
                        value={homepageEditData.cta?.subtitle || ""}
                        onChange={(e) => {
                          const newData = {
                            ...homepageEditData,
                            cta: { ...homepageEditData.cta, subtitle: e.target.value },
                          }
                          setHomepageEditData(newData)
                          setHasHomepageChanges(true)
                        }}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Управление контактами */}
            {activeTab === "contacts" && hasPermission("contacts") && contactsEditData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Управление контактами</h1>
                    <p className="text-muted-foreground">Обновите контактную информацию компании</p>
                  </div>
                  {hasContactsChanges && (
                    <div className="flex gap-2">
                      <Button onClick={handleCancelContacts} variant="outline">
                        Отмена
                      </Button>
                      <Button onClick={handleSaveContacts} className="bg-blue-600 hover:bg-blue-700">
                        Сохранить изменения
                      </Button>
                    </div>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Контактная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          value={contactsEditData.phone || ""}
                          onChange={(e) => {
                            setContactsEditData({ ...contactsEditData, phone: e.target.value })
                            setHasContactsChanges(true)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={contactsEditData.email || ""}
                          onChange={(e) => {
                            setContactsEditData({ ...contactsEditData, email: e.target.value })
                            setHasContactsChanges(true)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp">WhatsApp ссылка</Label>
                        <Input
                          id="whatsapp"
                          value={contactsEditData.whatsappUrl || ""}
                          onChange={(e) => {
                            setContactsEditData({ ...contactsEditData, whatsappUrl: e.target.value })
                            setHasContactsChanges(true)
                          }}
                          placeholder="https://wa.me/77016579054"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Эта ссылка будет использоваться во всех WhatsApp кнопках на сайте
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Адрес</Label>
                      <Textarea
                        id="address"
                        value={contactsEditData.address || ""}
                        onChange={(e) => {
                          setContactsEditData({ ...contactsEditData, address: e.target.value })
                          setHasContactsChanges(true)
                        }}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">Режим работы</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                          <Label htmlFor="weekdays">Будние дни</Label>
                          <Input
                            id="weekdays"
                            value={contactsEditData.workingHours?.weekdays || ""}
                            onChange={(e) => {
                              setContactsEditData({
                                ...contactsEditData,
                                workingHours: { ...contactsEditData.workingHours, weekdays: e.target.value },
                              })
                              setHasContactsChanges(true)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="saturday">Суббота</Label>
                          <Input
                            id="saturday"
                            value={contactsEditData.workingHours?.saturday || ""}
                            onChange={(e) => {
                              setContactsEditData({
                                ...contactsEditData,
                                workingHours: { ...contactsEditData.workingHours, saturday: e.target.value },
                              })
                              setHasContactsChanges(true)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="sunday">Воскресенье</Label>
                          <Input
                            id="sunday"
                            value={contactsEditData.workingHours?.sunday || ""}
                            onChange={(e) => {
                              setContactsEditData({
                                ...contactsEditData,
                                workingHours: { ...contactsEditData.workingHours, sunday: e.target.value },
                              })
                              setHasContactsChanges(true)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Управление пользователями */}
            {activeTab === "users" && hasPermission("users") && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Управление пользователями</h1>
                    <p className="text-muted-foreground">Добавляйте и управляйте пользователями системы</p>
                  </div>
                  <Button onClick={() => setShowAddUser(true)} className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Добавить пользователя
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Список пользователей</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{user.username}</h3>
                                <Badge variant={user.role === "superadmin" ? "default" : "secondary"}>
                                  {user.role === "superadmin" ? "Супер-администратор" : "Администратор"}
                                </Badge>
                                {currentUser?.id === user.id && (
                                  <Badge variant="outline" className="text-green-600 border-green-200">
                                    Вы
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">Создан: {formatDate(user.created_at)}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.permissions.homepage && (
                                  <Badge variant="outline" className="text-xs">
                                    Главная
                                  </Badge>
                                )}
                                {user.permissions.products && (
                                  <Badge variant="outline" className="text-xs">
                                    Товары
                                  </Badge>
                                )}
                                {user.permissions.contacts && (
                                  <Badge variant="outline" className="text-xs">
                                    Контакты
                                  </Badge>
                                )}
                                {user.permissions.users && (
                                  <Badge variant="outline" className="text-xs">
                                    Пользователи
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleEditUser(user)} size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Редактировать
                            </Button>
                            {currentUser?.id !== user.id && (
                              <Button
                                onClick={() => handleDeleteUser(user.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Управление заявками */}
            {activeTab === "orders" && (
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
                      <div className="text-2xl font-bold text-orange-600">
                        {orders.filter((order) => order.status === "new").length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Сегодня</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {
                          orders.filter(
                            (order) => new Date(order.createdAt).toDateString() === new Date().toDateString(),
                          ).length
                        }
                      </div>
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
                                      alt={order.productName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = "none"
                                        target.nextElementSibling?.classList.remove("hidden")
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
                                  order.status === "new"
                                    ? "default"
                                    : order.status === "processing"
                                      ? "secondary"
                                      : "outline"
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
            )}

            {/* Профиль пользователя */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Профиль пользователя</h1>
                  <p className="text-muted-foreground">Управление настройками вашего аккаунта</p>
                </div>

                {/* Информация о пользователе */}
                <Card>
                  <CardHeader>
                    <CardTitle>Информация об аккаунте</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                          {currentUser.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{currentUser.username}</h3>
                        <p className="text-muted-foreground">
                          {currentUser.role === "superadmin" ? "Супер-администратор" : "Администратор"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Аккаунт создан: {formatDate(currentUser.created_at)}
                        </p>
                        {currentUser.last_login && (
                          <p className="text-sm text-muted-foreground">
                            Последний вход: {formatDate(currentUser.last_login)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Разрешения</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.permissions.homepage && (
                          <Badge variant="outline">Управление главной страницей</Badge>
                        )}
                        {currentUser.permissions.products && <Badge variant="outline">Управление товарами</Badge>}
                        {currentUser.permissions.contacts && <Badge variant="outline">Управление контактами</Badge>}
                        {currentUser.permissions.users && <Badge variant="outline">Управление пользователями</Badge>}
                        <Badge variant="outline">Просмотр заявок</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Смена пароля */}
                <Card>
                  <CardHeader>
                    <CardTitle>Безопасность</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={() => setShowChangePassword(true)} variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Изменить пароль
                    </Button>

                    {/* Кнопка переключения пользователя только для супер-админа */}
                    {currentUser.role === "superadmin" && users.length > 1 && (
                      <Button onClick={handleSwitchUser} variant="outline">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Переключить пользователя
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>

      {/* Диалог добавления товара */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавить новый товар</DialogTitle>
            <DialogDescription>Заполните информацию о новом товаре</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-product-title">Название товара</Label>
                <Input
                  id="new-product-title"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="new-product-id">ID товара (для URL)</Label>
                <Input
                  id="new-product-id"
                  value={newProduct.id}
                  onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="new-product-description">Краткое описание</Label>
              <Textarea
                id="new-product-description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="new-product-image">Изображение (URL)</Label>
              <Input
                id="new-product-image"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-product-type">Тип товара</Label>
              <Select value={newProduct.type} onValueChange={(value) => setNewProduct({ ...newProduct, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Производим</SelectItem>
                  <SelectItem value="supply">Поставляем</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="new-product-homepage"
                checked={newProduct.show_on_homepage}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, show_on_homepage: checked })}
              />
              <Label htmlFor="new-product-homepage">Показывать на главной странице</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAddProduct(false)} variant="outline">
              Отмена
            </Button>
            <Button onClick={() => handleAddProduct(newProduct)} className="bg-blue-600 hover:bg-blue-700">
              Добавить товар
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог добавления пользователя */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить нового пользователя</DialogTitle>
            <DialogDescription>Создайте новый аккаунт администратора</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-username">Имя пользователя</Label>
              <Input
                id="new-username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-password">Пароль</Label>
              <Input
                id="new-password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Подтвердите пароль</Label>
              <Input
                id="confirm-password"
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="user-role">Роль</Label>
              <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="superadmin">Супер-администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base font-medium">Разрешения</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="perm-homepage"
                    checked={newUser.permissions.homepage}
                    onCheckedChange={(checked) =>
                      setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, homepage: checked },
                      })
                    }
                  />
                  <Label htmlFor="perm-homepage">Управление главной страницей</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="perm-products"
                    checked={newUser.permissions.products}
                    onCheckedChange={(checked) =>
                      setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, products: checked },
                      })
                    }
                  />
                  <Label htmlFor="perm-products">Управление товарами</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="perm-contacts"
                    checked={newUser.permissions.contacts}
                    onCheckedChange={(checked) =>
                      setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, contacts: checked },
                      })
                    }
                  />
                  <Label htmlFor="perm-contacts">Управление контактами</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAddUser(false)} variant="outline">
              Отмена
            </Button>
            <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
              Создать пользователя
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования пользователя */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
            <DialogDescription>Изменить настройки пользователя</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-username">Имя пользователя</Label>
                <Input
                  id="edit-username"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Роль</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="superadmin">Супер-администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-base font-medium">Разрешения</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-perm-homepage"
                      checked={editingUser.permissions.homepage}
                      onCheckedChange={(checked) =>
                        setEditingUser({
                          ...editingUser,
                          permissions: { ...editingUser.permissions, homepage: checked },
                        })
                      }
                    />
                    <Label htmlFor="edit-perm-homepage">Управление главной страницей</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-perm-products"
                      checked={editingUser.permissions.products}
                      onCheckedChange={(checked) =>
                        setEditingUser({
                          ...editingUser,
                          permissions: { ...editingUser.permissions, products: checked },
                        })
                      }
                    />
                    <Label htmlFor="edit-perm-products">Управление товарами</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-perm-contacts"
                      checked={editingUser.permissions.contacts}
                      onCheckedChange={(checked) =>
                        setEditingUser({
                          ...editingUser,
                          permissions: { ...editingUser.permissions, contacts: checked },
                        })
                      }
                    />
                    <Label htmlFor="edit-perm-contacts">Управление контактами</Label>
                  </div>
                  {editingUser.role === "superadmin" && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-perm-users"
                        checked={editingUser.permissions.users}
                        onCheckedChange={(checked) =>
                          setEditingUser({
                            ...editingUser,
                            permissions: { ...editingUser.permissions, users: checked },
                          })
                        }
                      />
                      <Label htmlFor="edit-perm-users">Управление пользователями</Label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setEditingUser(null)} variant="outline">
              Отмена
            </Button>
            <Button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700">
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог смены пароля */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить пароль</DialogTitle>
            <DialogDescription>Введите текущий пароль и новый пароль</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Текущий пароль</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-password-change">Новый пароль</Label>
              <Input
                id="new-password-change"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="confirm-new-password">Подтвердите новый пароль</Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowChangePassword(false)} variant="outline">
              Отмена
            </Button>
            <Button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700">
              Изменить пароль
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог переключения пользователя */}
      <Dialog open={showSwitchUser} onOpenChange={setShowSwitchUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Переключить пользователя</DialogTitle>
            <DialogDescription>Выберите пользователя для входа в систему</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {users
              .filter((user) => user.id !== currentUser?.id)
              .map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{user.username}</h3>
                      <Badge variant={user.role === "superadmin" ? "default" : "secondary"}>
                        {user.role === "superadmin" ? "Супер-админ" : "Админ"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.last_login ? `Последний вход: ${formatDate(user.last_login)}` : "Никогда не входил"}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSwitchUser(false)} variant="outline">
              Отмена
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
