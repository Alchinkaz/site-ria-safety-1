"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Save, X, Phone, MapPin, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { contactsService } from "@/lib/database"

interface ContactsData {
  phone: string
  email: string
  address: string
  workingHours: {
    weekdays: string
    saturday: string
    sunday: string
  }
}

export default function ContactsEditor() {
  const [data, setData] = useState<ContactsData>({
    phone: "",
    email: "",
    address: "",
    workingHours: {
      weekdays: "",
      saturday: "",
      sunday: "",
    },
  })
  const [originalData, setOriginalData] = useState<ContactsData>({
    phone: "",
    email: "",
    address: "",
    workingHours: {
      weekdays: "",
      saturday: "",
      sunday: "",
    },
  })
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)

  const loadData = async () => {
    try {
      const contactsData = await contactsService.get()

      if (contactsData) {
        const loadedData = {
          phone: contactsData.phone || "",
          email: contactsData.email || "",
          address: contactsData.address || "",
          workingHours: contactsData.workingHours || {
            weekdays: "",
            saturday: "",
            sunday: "",
          },
        }
        setData(loadedData)
        setOriginalData(JSON.parse(JSON.stringify(loadedData)))
      }
    } catch (error) {
      console.error("Error loading contacts data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveData = async () => {
    try {
      const success = await contactsService.update(data)

      if (!success) {
        toast({
          title: "Ошибка",
          description: "Не удалось сохранить изменения",
          variant: "destructive",
        })
        return
      }

      setOriginalData(JSON.parse(JSON.stringify(data)))
      setHasChanges(false)
      toast({
        title: "Успешно",
        description: "Контактные данные обновлены",
      })
    } catch (error) {
      console.error("Error saving contacts data:", error)
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

  const updateField = (field: keyof ContactsData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateWorkingHours = (day: keyof ContactsData["workingHours"], value: string) => {
    setData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: value,
      },
    }))
    setHasChanges(true)
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка контактных данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Контактные данные</h1>
          <p className="text-muted-foreground">Редактирование контактной информации</p>
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

      {/* Основные контакты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Основные контакты
          </CardTitle>
          <CardDescription>Телефон и электронная почта</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+7 (771) 116-57-59"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="info@ria-safety.kz"
            />
          </div>
        </CardContent>
      </Card>

      {/* Адрес */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Адрес
          </CardTitle>
          <CardDescription>Физический адрес компании</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="address">Полный адрес</Label>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Республика Казахстан, 130000, Мангистауская область, г. Актау, 3Б микрорайон, здание 40"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Режим работы */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Режим работы
          </CardTitle>
          <CardDescription>График работы компании</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weekdays">Понедельник - Пятница</Label>
            <Input
              id="weekdays"
              value={data.workingHours.weekdays}
              onChange={(e) => updateWorkingHours("weekdays", e.target.value)}
              placeholder="09:00 - 18:00"
            />
          </div>
          <div>
            <Label htmlFor="saturday">Суббота</Label>
            <Input
              id="saturday"
              value={data.workingHours.saturday}
              onChange={(e) => updateWorkingHours("saturday", e.target.value)}
              placeholder="09:00 - 15:00"
            />
          </div>
          <div>
            <Label htmlFor="sunday">Воскресенье</Label>
            <Input
              id="sunday"
              value={data.workingHours.sunday}
              onChange={(e) => updateWorkingHours("sunday", e.target.value)}
              placeholder="Выходной"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
