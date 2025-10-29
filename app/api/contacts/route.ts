import { NextResponse } from "next/server"
import { contactsService } from "@/lib/database"

export async function GET() {
  try {
    const contacts = await contactsService.get()
    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    // Return default contacts if database is unavailable
    return NextResponse.json({
      phone: "+7 (771) 116-57-59",
      email: "info@ria-safety.kz",
      address: "Республика Казахстан, 130000, Мангистауская область, г. Актау, 3Б микрорайон, здание 40",
      workingHours: {
        weekdays: "09:00 - 18:00",
        saturday: "09:00 - 15:00",
        sunday: "Выходной",
      },
    })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const success = await contactsService.update(data)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to update contacts" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating contacts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
