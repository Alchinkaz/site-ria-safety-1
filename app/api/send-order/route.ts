import { type NextRequest, NextResponse } from "next/server"
import { ordersService } from "@/lib/database"

const TELEGRAM_BOT_TOKEN = "7952298985:AAEZGX1iV4mR4_F32Vltb5d2hDxEhrG20tQ"
const TELEGRAM_CHAT_ID = "-1002496607719"

async function sendTelegramMessage(message: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Telegram API error:", errorData)
      throw new Error(`Telegram API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending telegram message:", error)
    throw error
  }
}

function formatDateTime(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")

  return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, productImage, productType, quantity, phone, messenger, city, customCity } = body

    // Валидация данных
    if (!productName || !phone || !city) {
      return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 })
    }

    // Определяем финальный город
    const finalCity = city === "Другой" ? customCity : city

    if (!finalCity) {
      return NextResponse.json({ error: "Город не указан" }, { status: 400 })
    }

    // Формируем контактную информацию
    let contactInfo = `Телефон: ${phone}`
    if (messenger) {
      contactInfo += ` | ${messenger}`
    }

    // Создаем заявку в базе данных
    const order = await ordersService.create({
      productName,
      productImage: productImage || "",
      productType,
      quantity: quantity.toString(), // Конвертируем число в строку для базы
      contact: contactInfo,
      city: finalCity,
    })

    if (!order) {
      return NextResponse.json({ error: "Ошибка при создании заявки" }, { status: 500 })
    }

    // Формируем сообщение для Telegram
    const now = new Date()
    const formattedDateTime = formatDateTime(now)

    let telegramMessage = `🛒 Новая заявка на товар!\n\n`
    telegramMessage += `📦 Товар: ${productName}\n`
    telegramMessage += `🔢 Количество: ${quantity} шт.\n`
    telegramMessage += `📞 Контакт: ${contactInfo}\n`
    telegramMessage += `🏙 Город: ${finalCity}\n`
    telegramMessage += `⏰ Время: ${formattedDateTime}`

    // Отправляем сообщение в Telegram
    try {
      await sendTelegramMessage(telegramMessage)
    } catch (telegramError) {
      console.error("Failed to send telegram message:", telegramError)
      // Не возвращаем ошибку, так как заявка уже сохранена в базе
    }

    return NextResponse.json({
      success: true,
      message: "Заявка успешно отправлена",
      order: order,
    })
  } catch (error) {
    console.error("Error processing order:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
