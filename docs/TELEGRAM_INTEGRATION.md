# Telegram Bot Integration Guide

## Overview
Kisan Mitra now includes a Telegram bot that provides weather alerts, market updates, crop reminders, and AI assistance directly in Telegram.

## Features
- 🌤️ **Weather Alerts** - Real-time weather updates and rain warnings
- 📊 **Market Prices** - Live mandi prices and price change notifications
- 🌱 **Crop Reminders** - Task notifications and care schedules
- 🤖 **AI Assistant** - Chat with Kisan Mitra AI in Telegram
- 🔗 **Account Linking** - Sync your web app data with Telegram

## Bot Commands

### `/start`
Initialize the bot and see welcome message with available commands.

### `/link`
Generate a linking code to connect your web app account with Telegram.

**Steps:**
1. Send `/link` in Telegram
2. Copy the 6-character code
3. Open Kisan Mitra web app
4. Go to Settings → Telegram
5. Enter the code

### `/weather`
Get current weather forecast for your location (requires linked account).

### `/market`
View real-time market prices for your crops (requires linked account).

### `/crops`
See your crop information and growth stages (requires linked account).

### `/tasks`
View pending farm tasks and reminders (requires linked account).

### `/help`
Display help message with all available commands.

## Setup Instructions

### 1. Environment Variables
Add the Telegram bot token to your `.env.local`:

```bash
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=7982555038:AAH69R6fzwuKgjv-nqE4PduOz4ocCXugE1o
```

### 2. Deploy to Production
Deploy your app to Vercel or your hosting provider:

```bash
git add .
git commit -m "feat: add Telegram bot integration"
git push
```

### 3. Configure Webhook
After deployment, set up the Telegram webhook:

```bash
node scripts/setup-telegram-webhook.js https://your-app-url.vercel.app/api/telegram
```

Or manually via curl:

```bash
curl -X POST "https://api.telegram.org/bot7982555038:AAH69R6fzwuKgjv-nqE4PduOz4ocCXugE1o/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-app-url.vercel.app/api/telegram"}'
```

### 4. Test the Bot
1. Open Telegram
2. Search for your bot (get username from BotFather)
3. Send `/start`
4. Send `/link` to generate linking code
5. Link your account in the web app

## Architecture

### Components

**`lib/telegram.ts`** - Core Telegram service
- Send messages, weather alerts, market updates
- Manage account linking
- Generate linking codes

**`app/api/telegram/route.ts`** - Webhook API endpoint
- Receives Telegram updates
- Processes commands
- Sends responses

**`components/TelegramConnect.tsx`** - UI component
- Account linking interface
- Code verification
- Connection status

### Data Flow

1. **Linking Process:**
   ```
   User → /link command → Bot generates code → API stores code
   → User enters code in web app → API verifies → Account linked
   ```

2. **Notifications:**
   ```
   Web app event → API checks linked accounts → Telegram API → User receives message
   ```

3. **Commands:**
   ```
   User sends command → Telegram → Webhook → API processes → Response sent
   ```

## Security

### Best Practices
- ✅ Bot token stored in environment variables (not in code)
- ✅ Linking codes expire after 10 minutes
- ✅ Codes are single-use only
- ✅ User data encrypted in localStorage
- ✅ Webhook uses HTTPS only

### Data Privacy
- No user data stored on Telegram servers
- Chat IDs stored locally in browser
- Unlinking removes all Telegram data
- No message logging or analytics

## Customization

### Add New Commands
Edit `app/api/telegram/route.ts`:

```typescript
if (text === '/newcommand') {
  await TelegramService.sendMessage(chatId, 'Your response')
  return NextResponse.json({ ok: true })
}
```

### Custom Notifications
Use `TelegramService` methods:

```typescript
import { TelegramService } from '@/lib/telegram'

// Send custom alert
await TelegramService.sendMessage(
  chatId,
  '🌾 <b>Alert Title</b>\n\nYour message here',
  'HTML'
)

// Send weather alert
await TelegramService.sendWeatherAlert(chatId, weatherData)

// Send market alert
await TelegramService.sendMarketAlert(chatId, marketData)

// Send crop reminder
await TelegramService.sendCropReminder(chatId, taskData)
```

## Troubleshooting

### Bot Not Responding
1. Check webhook is set correctly:
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```
2. Verify API endpoint is accessible
3. Check Vercel logs for errors

### Linking Code Not Working
1. Ensure code is entered within 10 minutes
2. Check code hasn't been used already
3. Verify API route is deployed

### Messages Not Sending
1. Confirm account is linked
2. Check bot token is valid
3. Verify Telegram API is accessible

## Future Enhancements

### Planned Features
- [ ] Scheduled notifications (daily weather, weekly market summary)
- [ ] Image-based crop diagnosis via photo upload
- [ ] Group chat support for farmer communities
- [ ] Voice message support
- [ ] Multi-language bot responses
- [ ] Inline queries for quick data lookup

### Integration Ideas
- [ ] WhatsApp Business API integration
- [ ] SMS fallback for non-smartphone users
- [ ] Email digest reports
- [ ] Push notifications (PWA)

## API Reference

### TelegramService Methods

#### `sendMessage(chatId, text, parseMode?)`
Send a text message to a Telegram user.
- **chatId**: Telegram chat ID
- **text**: Message content (supports HTML/Markdown)
- **parseMode**: 'HTML' or 'Markdown' (default: 'HTML')

#### `sendWeatherAlert(chatId, weather)`
Send formatted weather alert.
- **weather**: `{ location, temp, humidity, condition, rainChance }`

#### `sendMarketAlert(chatId, market)`
Send formatted market price alert.
- **market**: `{ commodity, price, unit, change, mandi }`

#### `sendCropReminder(chatId, task)`
Send formatted crop task reminder.
- **task**: `{ title, crop, dueDate, description }`

#### `linkTelegramAccount(userId, chatId, telegramUser)`
Link Telegram account to web app user.

#### `getLinkedAccount()`
Get currently linked Telegram account details.

#### `unlinkAccount()`
Remove Telegram account link.

## Support

For issues or questions:
- GitHub: [github.com/ranjan-arnav/Kisan-Mitra](https://github.com/ranjan-arnav/Kisan-Mitra)
- Email: support@kisanmitra.app
- Telegram: Contact @KisanMitraSupport

## License
MIT License - See [LICENSE](../LICENSE)
