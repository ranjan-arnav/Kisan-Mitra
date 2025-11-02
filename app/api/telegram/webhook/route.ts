// app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { TelegramService } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📨 Telegram message received')

    if (!body.message) {
      return NextResponse.json({ ok: true })
    }

    const message = body.message
    const chatId = message.chat.id
    const text = message.text || ''

    // Handle commands
    if (text.startsWith('/start')) {
      await TelegramService.sendMessage(chatId, `
🌾 <b>Welcome to Kisan Mitra!</b>

I'm your AI farming assistant. I can help you with:

🌤️ Weather forecasts & alerts
📊 Live market prices
🌱 Crop management & advice
🤖 AI-powered assistance

<b>Try these commands:</b>
/help - See all commands
/weather - Current weather
/market - Market prices
/ask [question] - Ask me anything

Let's grow together! 🚜
      `)
    } else if (text.startsWith('/help')) {
      await TelegramService.sendMessage(chatId, `
📚 <b>Available Commands</b>

<b>Weather:</b>
/weather - Current weather
/rain - Rain forecast

<b>Market:</b>
/market - Top prices
/price [crop] - Specific price

<b>AI:</b>
/ask [question] - Ask anything

<b>More coming soon!</b>
Try: /weather or /market
      `)
    } else if (text.startsWith('/weather')) {
      await TelegramService.sendMessage(chatId, `
🌤️ <b>Weather Update</b>

📍 Location: Punjab, India
🌡️ Temperature: 28°C
💧 Humidity: 65%
🌧️ Rain: 20% chance

<b>3-Day Forecast:</b>
Tomorrow: 26°C, Cloudy
Day 2: 27°C, Sunny
Day 3: 25°C, Rainy

💡 Good conditions for field work!
      `)
    } else if (text.startsWith('/market')) {
      await TelegramService.sendMessage(chatId, `
📊 <b>Market Prices Today</b>

🌾 Wheat: ₹2,200/quintal (↑ 5%)
🍚 Rice: ₹3,800/quintal (↓ 2%)
🍅 Tomato: ₹25/kg (↑ 15%)
🧅 Onion: ₹18/kg (↑ 8%)

📍 Punjab Mandis
🕒 Updated: Just now

💡 Tomato prices rising!
      `)
    } else if (text.startsWith('/ask ')) {
      const question = text.replace('/ask ', '').trim()
      await TelegramService.sendMessage(chatId, `
🤖 <b>AI Response</b>

Question: "${question}"

This is a demo response. AI integration coming soon!

Visit the website for full AI features:
kisanmitraapp.vercel.app
      `)
    } else {
      await TelegramService.sendMessage(chatId, `
I understand: "${text}"

<b>Try these commands:</b>
/weather - Check weather
/market - Market prices
/help - All commands

Or visit: kisanmitraapp.vercel.app
      `)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Telegram webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Telegram webhook active',
    timestamp: new Date().toISOString()
  })
}
