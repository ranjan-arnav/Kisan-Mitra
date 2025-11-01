# 🚀 API Integration Guide

## Getting Your API Keys

### 1. Gemini AI (REQUIRED - Already have it!)
You already have this configured:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_existing_key
```

### 2. OpenWeatherMap API (FREE - RECOMMENDED)
**Best for weather data - Easy to set up!**

1. Go to: https://openweathermap.org/api
2. Sign up for FREE account
3. Get API key from dashboard
4. Add to `.env.local`:
```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here
```

**Free tier includes:**
- Current weather
- 5-day forecast
- UV index
- 60 calls/minute

### 3. Google Cloud APIs (OPTIONAL - For better quality)
**For Translation and Speech-to-Text**

1. Go to: https://console.cloud.google.com/
2. Create new project
3. Enable these APIs:
   - Cloud Translation API
   - Cloud Speech-to-Text API
   - Cloud Text-to-Speech API
4. Create credentials → API Key
5. Add to `.env.local`:
```
NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY=your_key_here
```

**Free tier includes:**
- Translation: 500,000 characters/month
- Speech-to-Text: 60 minutes/month
- Text-to-Speech: 1 million characters/month

### 4. Bhashini API (OPTIONAL - Government, Free)
**For Indic language translation**

1. Go to: https://bhashini.gov.in/ulca/
2. Register as developer
3. Get API key and User ID
4. Add to `.env.local`:
```
NEXT_PUBLIC_BHASHINI_API_KEY=your_key_here
NEXT_PUBLIC_BHASHINI_USER_ID=your_user_id_here
```

### 5. AGMARKNET (OPTIONAL - Government market prices)
**For real mandi prices**

1. Go to: https://agmarknet.gov.in/
2. Register for API access
3. Get API key
4. Add to `.env.local`:
```
AGMARKNET_API_KEY=your_key_here
```

**Note:** AGMARKNET may require government approval. App works with demo data if not available.

---

## Setup Instructions

### Step 1: Create `.env.local` file
```bash
# Copy the example file
cp .env.example .env.local
```

### Step 2: Add your keys
Edit `.env.local` and add your API keys.

### Step 3: Restart dev server
```bash
npm run dev
```

---

## What Works Without API Keys

### Already Working (No keys needed):
- ✅ Onboarding flow
- ✅ Crop management (local storage)
- ✅ Voice commands (Web Speech API - browser)
- ✅ Basic speech synthesis (browser)
- ✅ Demo weather data
- ✅ Demo market prices
- ✅ All UI/UX features

### Requires Gemini Key (You have this!):
- ✅ AI Chat Assistant
- ✅ Crop Diagnosis
- ✅ Crop Recommendations
- ✅ Smart Input Finder

### With OpenWeatherMap (FREE):
- 🌤️ Real weather data for any location
- 🌤️ Accurate 5-day forecasts
- 🌤️ UV index and conditions

### With Google Cloud (OPTIONAL):
- 🗣️ Better voice recognition
- 🗣️ High-quality text-to-speech in Indic languages
- 🌐 Professional translation

### With Bhashini (OPTIONAL):
- 🇮🇳 Government-supported Indic translation
- 🇮🇳 Better support for regional languages

### With AGMARKNET (OPTIONAL):
- 💰 Real mandi prices
- 💰 Government market data

---

## Recommended Setup (Minimal)

For a working demo with real features:

1. **Gemini API** (you have this) - AI features
2. **OpenWeatherMap** (free, easy) - Real weather

That's it! Everything else has fallbacks.

---

## Testing Without Keys

The app is designed to work without API keys:

1. **Weather**: Shows realistic demo data
2. **Market**: Shows demo prices with trends
3. **Voice**: Uses browser's built-in speech
4. **Translation**: Falls back to original text

This lets you demo the app immediately!

---

## Priority Order

If you want to add real APIs, do them in this order:

### Priority 1 (FREE & Easy):
1. ✅ Gemini API - You have this!
2. 🌤️ OpenWeatherMap - 5 minutes to setup

### Priority 2 (Better Quality):
3. 🗣️ Google Cloud APIs - Better speech/translation
4. 💰 AGMARKNET - Real market prices

### Priority 3 (Optional):
5. 🇮🇳 Bhashini - Government Indic NLP

---

## Cost Breakdown

### FREE Forever:
- OpenWeatherMap: 60 calls/min (plenty for demo)
- Google Cloud: Free tier (500K translations/month)
- Bhashini: 100% free (government)
- AGMARKNET: Free (government)
- Web Speech API: Free (browser)

### Paid (if you exceed free tier):
- Google Cloud: ~$20/1M characters (translation)
- OpenWeather: $0 for free tier (enough for this app)

**Total Cost for Demo: $0** ✨

---

## Quick Start (Recommended)

1. Keep your Gemini key ✅
2. Get OpenWeatherMap key (5 min, free) 🌤️
3. Run the app - everything works! 🚀

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

**That's all you need!** 🎉

All other APIs are optional enhancements.
