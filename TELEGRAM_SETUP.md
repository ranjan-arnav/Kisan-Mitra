# 🤖 Telegram Bot Setup Guide

## Your Bot Details
- **Bot Name:** Krishi Salahkaar
- **Username:** @krishisalahkaarBot
- **Bot ID:** 7982555038
- **Status:** ✅ Active

---

## Quick Setup (3 Steps)

### Step 1: Wait for Deployment
After pushing to GitHub, wait 1-2 minutes for Vercel to deploy.

Check deployment status:
https://vercel.com/dashboard

### Step 2: Set Webhook
Once deployed, run:
```powershell
node scripts/setup-telegram.js
```

Or manually set webhook:
```powershell
curl -X POST "https://api.telegram.org/bot7982555038:AAH69R6fzwuKgjv-nqE4PduOz4ocCXugE1o/setWebhook" -H "Content-Type: application/json" -d "{\"url\": \"https://kisanmitraapp.vercel.app/api/telegram/webhook\"}"
```

### Step 3: Test the Bot
1. Open Telegram
2. Search for: **@krishisalahkaarBot**
3. Click **Start**
4. Try these commands:
   - `/start` - Welcome message
   - `/help` - Command list
   - `/weather` - Weather update
   - `/market` - Market prices
   - `/ask What crops grow in winter?` - AI question

---

## Available Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome & introduction |
| `/help` | List all commands |
| `/weather` | Current weather forecast |
| `/market` | Live market prices |
| `/ask [question]` | Ask AI anything |

---

## Troubleshooting

### Bot not responding?

**Check 1: Is webhook set?**
```powershell
node scripts/test-telegram.js
```

Look for: `URL: https://kisanmitraapp.vercel.app/api/telegram/webhook`

If it says `(not set)`, run:
```powershell
node scripts/setup-telegram.js
```

**Check 2: Is Vercel deployed?**
Visit: https://kisanmitraapp.vercel.app/api/telegram/webhook

Should see: `{"status":"Telegram webhook active","timestamp":"..."}`

**Check 3: Check Vercel logs**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to "Logs"
4. Send a message to bot
5. Look for: "📨 Telegram message received"

**Check 4: Test webhook manually**
```powershell
curl https://kisanmitraapp.vercel.app/api/telegram/webhook
```

Should return JSON with status.

---

## How It Works

1. **User sends message** → Telegram servers
2. **Telegram sends webhook** → Your Vercel app at `/api/telegram/webhook`
3. **Your app processes** → Calls TelegramService to reply
4. **Bot sends response** → Back to user

---

## Next Steps

### 1. Add Real Data (Priority)
Currently bot shows demo data. Connect to your services:

**Weather:** Edit `app/api/telegram/webhook/route.ts`
```typescript
import { WeatherService } from '@/lib/weather'

// In /weather command:
const weather = await WeatherService.fetchWeather('Punjab')
await TelegramService.sendMessage(chatId, `
🌤️ <b>Weather Update</b>
🌡️ ${weather.current.temp}°C
💧 ${weather.current.humidity}%
...
`)
```

**Market:** Similar integration with your market API

**AI:** Connect Gemini
```typescript
import { GeminiService } from '@/lib/gemini'

// In /ask command:
const answer = await GeminiService.chat(question)
await TelegramService.sendMessage(chatId, answer)
```

### 2. Add User Linking
Let users link Telegram to web account:
- Add `/link CODE` command
- Store mapping in database (Supabase/Firebase)
- Fetch user's crops, location, preferences

### 3. Add Notifications
Send proactive alerts:
```typescript
// Morning weather alert (7 AM daily)
await TelegramService.sendWeatherAlert(chatId, weatherData)

// Price spike alert
if (priceChange > 15%) {
  await TelegramService.sendMarketAlert(chatId, marketData)
}

// Task reminders
await TelegramService.sendCropReminder(chatId, task)
```

### 4. Add Inline Buttons
```typescript
await TelegramService.sendMessage(chatId, 'Choose an action:', {
  reply_markup: {
    inline_keyboard: [
      [{ text: '🌤️ Weather', callback_data: 'weather' }],
      [{ text: '📊 Market', callback_data: 'market' }],
      [{ text: '🤖 AI Chat', callback_data: 'ai' }]
    ]
  }
})
```

---

## Current Limitations

1. **Demo data:** Showing static responses
2. **No user accounts:** Can't personalize
3. **No persistence:** Commands don't remember context
4. **Limited commands:** Only 6 commands active

All fixable with 2-3 hours of integration work!

---

## Testing Checklist

- [ ] Bot responds to `/start`
- [ ] `/help` shows command list
- [ ] `/weather` shows weather data
- [ ] `/market` shows prices
- [ ] `/ask` accepts questions
- [ ] Unknown commands get help message
- [ ] Webhook logs appear in Vercel
- [ ] Response time < 3 seconds

---

## Support

**Bot not working?**
1. Check this guide first
2. Run `node scripts/test-telegram.js`
3. Check Vercel logs
4. Check webhook status

**Need help?**
- GitHub Issues: https://github.com/ranjan-arnav/Kisan-Mitra/issues
- Email: arnavranjan@example.com

---

## Quick Reference

**Test bot:**
```powershell
node scripts/test-telegram.js
```

**Setup webhook:**
```powershell
node scripts/setup-telegram.js
```

**Check webhook:**
```powershell
curl "https://api.telegram.org/bot7982555038:AAH69R6fzwuKgjv-nqE4PduOz4ocCXugE1o/getWebhookInfo"
```

**Delete webhook (for testing locally):**
```powershell
curl -X POST "https://api.telegram.org/bot7982555038:AAH69R6fzwuKgjv-nqE4PduOz4ocCXugE1o/deleteWebhook"
```

**Bot URL:**
https://t.me/krishisalahkaarBot

---

✅ Bot is ready! Just set the webhook and start chatting!
