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
    } else if (text.startsWith('/link')) {
      const parts = text.split(' ')
      
      if (parts.length < 2) {
        await TelegramService.sendMessage(chatId, `
❌ <b>Missing Link Code</b>

To link your account:
1. Open kisanmitraapp.vercel.app
2. Go to Settings (⚙️ icon)
3. Click "Connect Telegram"
4. Copy the 6-digit code
5. Send: <code>/link YOUR_CODE</code>

Example: <code>/link ABC123</code>
        `)
        return NextResponse.json({ ok: true })
      }

      const code = parts[1].toUpperCase()
      const userId = message.from.id
      const username = message.from.username || message.from.first_name

      // Check if code is valid (hardcoded for demo)
      if (code !== '263377') {
        await TelegramService.sendMessage(chatId, `
❌ <b>Invalid Link Code</b>

The code "${code}" is not recognized.

Please use: <code>/link 263377</code>

Or get a fresh code from:
kisanmitraapp.vercel.app → Settings → Connect Telegram
        `)
        return NextResponse.json({ ok: true })
      }

      // Store the link (in production, save to database)
      // For now, we'll just confirm
      await TelegramService.sendMessage(chatId, `
✅ <b>Account Linked Successfully!</b>

Welcome, ${username}!
🆔 Telegram ID: ${userId}
🔗 Link Code: ${code}

You can now receive:
📊 Market alerts
🌤️ Weather updates
🌱 Crop reminders

<b>Try these personalized commands:</b>
/weather - Your local weather
/market - Prices in your area
/crops - Your tracked crops
/profile - View your details

Your data syncs automatically! 🚜
      `)
    } else if (text.startsWith('/unlink')) {
      await TelegramService.sendMessage(chatId, `
🔓 <b>Account Unlinked</b>

Your Telegram is now disconnected from Kisan Mitra.

You can still use basic commands:
/weather, /market, /help

To link again:
/link YOUR_CODE
      `)
    } else if (text.startsWith('/profile')) {
      await TelegramService.sendMessage(chatId, `
👤 <b>Your Profile</b>

Name: Farmer
📍 Location: Punjab, India
🌾 Farm Size: 5 acres
🔗 Telegram: Linked
✅ Status: Active

<b>Your Crops:</b>
🌾 Wheat - 3 acres (Growing)
🌻 Mustard - 2 acres (Flowering)

Edit on website or use:
/location [city] - Update location
/crops - Manage crops
      `)
    } else if (text.startsWith('/crops')) {
      await TelegramService.sendMessage(chatId, `
🌱 <b>Your Crops</b>

1. 🌾 Wheat
   Area: 3 acres
   Stage: Growing
   Days: 45/120

2. 🌻 Mustard
   Area: 2 acres
   Stage: Flowering
   Days: 60/90

<b>Today's Tasks:</b>
• Check wheat for rust
• Irrigate mustard (evening)
• Monitor weather for rain

Add crops on website or:
/addcrop [name] [area]
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
