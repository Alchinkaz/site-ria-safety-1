"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  X,
  Plus,
  Trash2,
  Award,
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
import { toast } from "@/hooks/use-toast"
import { homepageService } from "@/lib/database"

interface HomepageData {
  hero_title: string
  hero_subtitle: string
  hero_description: string
  hero_button_text: string
  about_title: string
  about_description: string
  advantages: Array<{
    id: string
    title: string
    description: string
    icon: string
    color: string
  }>
}

const AVAILABLE_ICONS = [
  { name: "Award", icon: Award, label: "Награда" },
  { name: "Settings", icon: Settings, label: "Настройки" },
  { name: "Clock", icon: Clock, label: "Время" },
  { name: "Shield", icon: Shield, label: "Защита" },
  { name: "Star", icon: Star, label: "Звезда" },
  { name: "Trophy", icon: Trophy, label: "Трофей" },
  { name: "Target", icon: Target, label: "Цель" },
  { name: "Zap", icon: Zap, label: "Молния" },
  { name: "Heart", icon: Heart, label: "Сердце" },
  { name: "CheckCircle", icon: CheckCircle, label: "Галочка" },
  { name: "Lightbulb", icon: Lightbulb, label: "Лампочка" },
  { name: "Rocket", icon: Rocket, label: "Ракета" },
  { name: "Globe", icon: Globe, label: "Глобус" },
  { name: "Cpu", icon: Cpu, label: "Процессор" },
  { name: "Database", icon: Database, label: "База данных" },
  { name: "Wifi", icon: Wifi, label: "Wi-Fi" },
  { name: "Battery", icon: Battery, label: "Батарея" },
  { name: "Smartphone", icon: Smartphone, label: "Смартфон" },
  { name: "Monitor", icon: Monitor, label: "Монитор" },
  { name: "Headphones", icon: Headphones, label: "Наушники" },
  { name: "Camera", icon: Camera, label: "Камера" },
  { name: "Printer", icon: Printer, label: "Принтер" },
  { name: "HardDrive", icon: HardDrive, label: "Жесткий диск" },
  { name: "Keyboard", icon: Keyboard, label: "Клавиатура" },
  { name: "Mouse", icon: Mouse, label: "Мышь" },
  { name: "Speaker", icon: Speaker, label: "Динамик" },
  { name: "Microphone", icon: Microphone, label: "Микрофон" },
  { name: "Gamepad2", icon: Gamepad2, label: "Геймпад" },
  { name: "Tablet", icon: Tablet, label: "Планшет" },
  { name: "Watch", icon: Watch, label: "Часы" },
  { name: "Car", icon: Car, label: "Автомобиль" },
  { name: "Plane", icon: Plane, label: "Самолет" },
  { name: "Ship", icon: Ship, label: "Корабль" },
  { name: "Truck", icon: Truck, label: "Грузовик" },
  { name: "Bike", icon: Bike, label: "Велосипед" },
]

const COLOR_SCHEMES = [
  { name: "blue", label: "Синий", color: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50" },
  { name: "green", label: "Зеленый", color: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50" },
  {
    name: "purple",
    label: "Фиолетовый",
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  { name: "red", label: "Красный", color: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-50" },
  { name: "orange", label: "Оранжевый", color: "bg-orange-500", textColor: "text-orange-600", bgColor: "bg-orange-50" },
  { name: "yellow", label: "Желтый", color: "bg-yellow-500", textColor: "text-yellow-600", bgColor: "bg-yellow-50" },
  { name: "pink", label: "Розовый", color: "bg-pink-500", textColor: "text-pink-600", bgColor: "bg-pink-50" },
  { name: "indigo", label: "Индиго", color: "bg-indigo-500", textColor: "text-indigo-600", bgColor: "bg-indigo-50" },
  { name: "teal", label: "Бирюзовый", color: "bg-teal-500", textColor: "text-teal-600", bgColor: "bg-teal-50" },
  { name: "cyan", label: "Голубой", color: "bg-cyan-500", textColor: "text-cyan-600", bgColor: "bg-cyan-50" },
  {
    name: "emerald",
    label: "Изумрудный",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  { name: "lime", label: "Лайм", color: "bg-lime-500", textColor: "text-lime-600", bgColor: "bg-lime-50" },
  { name: "amber", label: "Янтарный", color: "bg-amber-500", textColor: "text-amber-600", bgColor: "bg-amber-50" },
  { name: "rose", label: "Роза", color: "bg-rose-500", textColor: "text-rose-600", bgColor: "bg-rose-50" },
  { name: "violet", label: "Фиалковый", color: "bg-violet-500", textColor: "text-violet-600", bgColor: "bg-violet-50" },
  { name: "slate", label: "Серый", color: "bg-slate-500", textColor: "text-slate-600", bgColor: "bg-slate-50" },
]

export default function HomepageEditor() {
  const [data, setData] = useState<HomepageData>({
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    hero_button_text: "",
    about_title: "",
    about_description: "",
    advantages: [],
  })
  const [originalData, setOriginalData] = useState<HomepageData>({
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    hero_button_text: "",
    about_title: "",
    about_description: "",
    advantages: [],
  })
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)

  const loadData = async () => {
    try {
      const homepageData = await homepageService.getAll()

      if (homepageData) {
        const loadedData = {
          hero_title: homepageData.hero?.title || "",
          hero_subtitle: homepageData.hero?.subtitle || "",
          hero_description: homepageData.hero?.description || "",
          hero_button_text: homepageData.hero?.buttonText || "",
          about_title: homepageData.about?.title || "",
          about_description: homepageData.about?.description || "",
          advantages: homepageData.advantages || [],
        }
        setData(loadedData)
        setOriginalData(JSON.parse(JSON.stringify(loadedData)))
      }
    } catch (error) {
      console.error("Error loading homepage data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveData = async () => {
    try {
      await homepageService.updateSection("hero", {
        title: data.hero_title,
        subtitle: data.hero_subtitle,
        description: data.hero_description,
        buttonText: data.hero_button_text,
      })

      await homepageService.updateSection("about", {
        title: data.about_title,
        description: data.about_description,
      })

      await homepageService.updateSection("advantages", data.advantages)

      setOriginalData(JSON.parse(JSON.stringify(data)))
      setHasChanges(false)
      toast({
        title: "Успешно",
        description: "Изменения сохранены",
      })
    } catch (error) {
      console.error("Error saving homepage data:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      })
    }
  }

  const cancelChanges = () => {
    setData(JSON.parse(JSON.stringify(originalData)))
    setHasChanges(false)
  }

  const updateField = (field: keyof HomepageData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const addAdvantage = () => {
    const newAdvantage = {
      id: Date.now().toString(),
      title: "",
      description: "",
      icon: "Award",
      color: "blue",
    }
    updateField("advantages", [...data.advantages, newAdvantage])
  }

  const updateAdvantage = (id: string, field: string, value: string) => {
    const updatedAdvantages = data.advantages.map((advantage) =>
      advantage.id === id ? { ...advantage, [field]: value } : advantage,
    )
    updateField("advantages", updatedAdvantages)
  }

  const removeAdvantage = (id: string) => {
    const updatedAdvantages = data.advantages.filter((advantage) => advantage.id !== id)
    updateField("advantages", updatedAdvantages)
  }

  const getIconComponent = (iconName: string) => {
    const iconData = AVAILABLE_ICONS.find((icon) => icon.name === iconName)
    return iconData ? iconData.icon : Award
  }

  const getColorScheme = (colorName: string) => {
    return COLOR_SCHEMES.find((scheme) => scheme.name === colorName) || COLOR_SCHEMES[0]
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Главная страница</h1>
          <p className="text-muted-foreground">Редактирование контента главной страницы</p>
        </div>
        {hasChanges && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={cancelChanges}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button onClick={saveData}>
              <Save className="w-4 h-4 mr-2" />
              Сохранить изменения
            </Button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Главный блок (Hero)</CardTitle>
          <CardDescription>Основной заголовок и описание на главной странице</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero_title">Заголовок</Label>
            <Input
              id="hero_title"
              value={data.hero_title}
              onChange={(e) => updateField("hero_title", e.target.value)}
              placeholder="Основной заголовок"
            />
          </div>
          <div>
            <Label htmlFor="hero_subtitle">Подзаголовок</Label>
            <Input
              id="hero_subtitle"
              value={data.hero_subtitle}
              onChange={(e) => updateField("hero_subtitle", e.target.value)}
              placeholder="Подзаголовок"
            />
          </div>
          <div>
            <Label htmlFor="hero_description">Описание</Label>
            <Textarea
              id="hero_description"
              value={data.hero_description}
              onChange={(e) => updateField("hero_description", e.target.value)}
              placeholder="Описание компании"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="hero_button_text">Текст кнопки</Label>
            <Input
              id="hero_button_text"
              value={data.hero_button_text}
              onChange={(e) => updateField("hero_button_text", e.target.value)}
              placeholder="Текст на кнопке"
            />
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>О компании</CardTitle>
          <CardDescription>Раздел с информацией о компании</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="about_title">Заголовок раздела</Label>
            <Input
              id="about_title"
              value={data.about_title}
              onChange={(e) => updateField("about_title", e.target.value)}
              placeholder="Заголовок раздела о компании"
            />
          </div>
          <div>
            <Label htmlFor="about_description">Описание</Label>
            <Textarea
              id="about_description"
              value={data.about_description}
              onChange={(e) => updateField("about_description", e.target.value)}
              placeholder="Подробное описание компании"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advantages Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Преимущества компании</CardTitle>
              <CardDescription>Ключевые преимущества и особенности</CardDescription>
            </div>
            <Button onClick={addAdvantage}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить преимущество
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.advantages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Преимущества не добавлены</p>
              <p className="text-sm">Нажмите "Добавить преимущество" чтобы начать</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.advantages.map((advantage, index) => {
                const IconComponent = getIconComponent(advantage.icon)
                const colorScheme = getColorScheme(advantage.color)

                return (
                  <div key={advantage.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${colorScheme.bgColor}`}>
                          <IconComponent className={`w-5 h-5 ${colorScheme.textColor}`} />
                        </div>
                        <Badge variant="outline">Преимущество {index + 1}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAdvantage(advantage.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label>Название</Label>
                          <Input
                            value={advantage.title}
                            onChange={(e) => updateAdvantage(advantage.id, "title", e.target.value)}
                            placeholder="Название преимущества"
                          />
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea
                            value={advantage.description}
                            onChange={(e) => updateAdvantage(advantage.id, "description", e.target.value)}
                            placeholder="Описание преимущества"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Иконка</Label>
                          <Select
                            value={advantage.icon}
                            onValueChange={(value) => updateAdvantage(advantage.id, "icon", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {AVAILABLE_ICONS.map((iconData) => {
                                const Icon = iconData.icon
                                return (
                                  <SelectItem key={iconData.name} value={iconData.name}>
                                    <div className="flex items-center space-x-2">
                                      <Icon className="w-4 h-4" />
                                      <span>{iconData.label}</span>
                                    </div>
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Цветовая схема</Label>
                          <Select
                            value={advantage.color}
                            onValueChange={(value) => updateAdvantage(advantage.id, "color", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COLOR_SCHEMES.map((scheme) => (
                                <SelectItem key={scheme.name} value={scheme.name}>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded ${scheme.color}`}></div>
                                    <span>{scheme.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
