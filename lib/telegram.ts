// lib/telegram.ts - Telegram Bot Service
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

export interface TelegramMessage {
  message_id: number
  from: TelegramUser
  chat: {
    id: number
    type: string
  }
  text?: string
  date: number
}

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
}

export class TelegramService {
  private static readonly BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
  private static readonly API_BASE = `https://api.telegram.org/bot${this.BOT_TOKEN}`

  static async sendMessage(chatId: number, text: string, parseMode: 'HTML' | 'Markdown' = 'HTML') {
    try {
      const response = await fetch(`${this.API_BASE}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: parseMode,
        }),
      })

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to send Telegram message:', error)
      throw error
    }
  }

  static async sendWeatherAlert(chatId: number, weather: any) {
    const text = `
🌤️ <b>Weather Update</b>

📍 Location: ${weather.location}
🌡️ Temperature: ${weather.temp}°C
💧 Humidity: ${weather.humidity}%
☁️ Condition: ${weather.condition}
${weather.rainChance > 50 ? `\n⚠️ Rain expected: ${weather.rainChance}%` : ''}

Stay safe! 🌾
`
    return this.sendMessage(chatId, text)
  }

  static async sendMarketAlert(chatId: number, market: any) {
    const text = `
📊 <b>Market Update</b>

🌾 Commodity: ${market.commodity}
💰 Price: ₹${market.price}/${market.unit}
📈 Change: ${market.change > 0 ? '↗️' : '↘️'} ${Math.abs(market.change)}%
📍 Mandi: ${market.mandi}

${market.change > 10 ? '🔥 <b>Good time to sell!</b>' : ''}
`
    return this.sendMessage(chatId, text)
  }

  static async sendCropReminder(chatId: number, task: any) {
    const text = `
🌱 <b>Crop Reminder</b>

📋 Task: ${task.title}
🌾 Crop: ${task.crop}
⏰ Due: ${task.dueDate}

${task.description ? `\n📝 ${task.description}` : ''}

Complete your task! ✅
`
    return this.sendMessage(chatId, text)
  }

  static async getMe() {
    try {
      const response = await fetch(`${this.API_BASE}/getMe`)
      return await response.json()
    } catch (error) {
      console.error('Failed to get bot info:', error)
      throw error
    }
  }

  static async setWebhook(url: string) {
    try {
      const response = await fetch(`${this.API_BASE}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      return await response.json()
    } catch (error) {
      console.error('Failed to set webhook:', error)
      throw error
    }
  }

  // Generate a unique linking code for user authentication
  static generateLinkCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Store telegram chat ID with user data (localStorage)
  static linkTelegramAccount(userId: string, chatId: number, telegramUser: TelegramUser) {
    if (typeof window === 'undefined') return

    const linkData = {
      chatId,
      telegramUser,
      linkedAt: new Date().toISOString(),
    }

    localStorage.setItem('kisanMitraTelegram', JSON.stringify(linkData))
  }

  // Get linked Telegram account
  static getLinkedAccount(): { chatId: number; telegramUser: TelegramUser } | null {
    if (typeof window === 'undefined') return null

    const data = localStorage.getItem('kisanMitraTelegram')
    return data ? JSON.parse(data) : null
  }

  // Unlink Telegram account
  static unlinkAccount() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('kisanMitraTelegram')
  }
}
