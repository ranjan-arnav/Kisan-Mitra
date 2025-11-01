# 🎯 Quick Test Guide - Language & AI Restrictions

## Test Gemini AI Restrictions

### ❌ Should REJECT These:

1. **Politics:**
   - "Who is the prime minister?"
   - "Tell me about elections"
   - Expected: "I am Kisan Mitra, your farming assistant..."

2. **Sports:**
   - "Who won the cricket match?"
   - "IPL score please"
   - Expected: "I can only help with agriculture..."

3. **Coding:**
   - "How to code in Python?"
   - "Fix this JavaScript error"
   - Expected: Agriculture-only message

4. **General Knowledge:**
   - "What is the capital of India?"
   - "Who discovered gravity?"
   - Expected: Agriculture-only message

### ✅ Should ACCEPT These:

1. **Crops:**
   - "How to grow wheat?"
   - "Best season for rice?"
   - Expected: Detailed farming advice

2. **Soil:**
   - "What is black soil good for?"
   - "How to improve soil fertility?"
   - Expected: Soil management tips

3. **Weather:**
   - "How does rain affect crops?"
   - "Best crops for monsoon?"
   - Expected: Weather-crop relationship

4. **Market:**
   - "When to sell tomatoes?"
   - "Market price trends for wheat?"
   - Expected: Market insights

5. **Pests:**
   - "How to control aphids?"
   - "Organic pest control?"
   - Expected: Pest management solutions

---

## Test Multi-Language Support

### 1. First Time User:

**Steps:**
1. Clear browser localStorage (F12 → Application → Local Storage → Clear)
2. Refresh page
3. Should see **Language Selection Screen**
4. Grid of 10 languages with flags
5. Select Hindi (हिंदी)
6. Should continue to next onboarding screen
7. All text should be in Hindi

**Verify:**
- ✅ Language selection appears first
- ✅ All 10 languages visible
- ✅ Native scripts display correctly (हिंदी, தமிழ், తెలుగు, etc.)
- ✅ Selecting language saves preference
- ✅ Next screens show Hindi text

---

### 2. Language Switcher:

**Steps:**
1. Go to Dashboard
2. Look for **Globe icon (🌍)** in top-right header
3. Click globe icon
4. Dropdown with 10 languages opens
5. Select Tamil (தமிழ்)
6. Page reloads
7. All text changes to Tamil

**Verify:**
- ✅ Globe icon visible in header
- ✅ Dropdown opens smoothly
- ✅ All languages listed
- ✅ Current language highlighted in green
- ✅ Page reloads on selection
- ✅ New language applied everywhere

---

### 3. Language Persistence:

**Steps:**
1. Select a language (e.g., Marathi - मराठी)
2. Close browser completely
3. Reopen app
4. Check if text is still in Marathi

**Verify:**
- ✅ Language persists after browser close
- ✅ Language persists after page refresh
- ✅ Language persists in localStorage

---

### 4. Test Each Language:

Try switching to each language and verify:

1. **English** - All text in English
2. **Hindi (हिंदी)** - Devanagari script
3. **Tamil (தமிழ்)** - Tamil script
4. **Telugu (తెలుగు)** - Telugu script
5. **Malayalam (മലയാളം)** - Malayalam script
6. **Kannada (ಕನ್ನಡ)** - Kannada script
7. **Gujarati (ગુજરાતી)** - Gujarati script
8. **Bengali (বাংলা)** - Bengali script
9. **Marathi (मराठी)** - Devanagari script
10. **Punjabi (ਪੰਜਾਬੀ)** - Gurmukhi script

**Verify:**
- ✅ All scripts render correctly
- ✅ No broken characters (□□□)
- ✅ Text is readable
- ✅ Buttons/labels change language

---

## Quick Visual Checks

### Dashboard Elements to Check:

1. **Header:**
   - Language switcher shows current language
   - Native name visible (e.g., "हिंदी" for Hindi)

2. **Welcome Message:**
   - Changes based on language
   - User's name still shows correctly

3. **Tabs:**
   - "My Crops" → "मेरी फसलें" (Hindi)
   - "Weather" → "மौசம" (Tamil)
   - "Market" → "బజార్" (Telugu)

4. **Buttons:**
   - "Add" → Translated
   - "Save" → Translated
   - "Cancel" → Translated

---

## Console Checks (F12)

### No Errors Expected:

```javascript
// Should NOT see:
❌ "Translation key not found"
❌ "Language undefined"
❌ "localStorage error"

// Should see:
✅ Clean console
✅ No red errors
✅ Smooth transitions
```

---

## Performance Check

### App Should Be Fast:

- ✅ Language selection loads instantly
- ✅ Language switch reloads in < 2 seconds
- ✅ No lag when changing languages
- ✅ All translations load immediately

---

## Mobile Testing (Optional)

### Responsive Design:

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on iPhone/Android sizes
4. Language switcher should work
5. All languages readable on mobile

---

## Expected Results Summary

| Test | Expected Result |
|------|----------------|
| Ask Gemini about politics | ❌ Rejected (agriculture-only message) |
| Ask Gemini about farming | ✅ Answered with farming advice |
| First-time user | ✅ Language selection screen appears |
| Select Hindi | ✅ All text changes to Hindi |
| Close & reopen | ✅ Hindi persists |
| Switch to Tamil | ✅ All text changes to Tamil |
| All 10 languages | ✅ Native scripts display correctly |
| Mobile view | ✅ Language switcher works on mobile |

---

## If Something Breaks:

### Language Not Showing:

1. Check browser console (F12)
2. Check localStorage: `localStorage.getItem('language')`
3. Try clearing localStorage and restart
4. Check if font supports the script

### Gemini Accepting Non-Ag Questions:

1. Check `lib/gemini.ts`
2. Verify system instruction is present
3. Check if API key is valid
3. Try re-deploying

### Translation Missing:

1. Check `lib/i18n.ts`
2. Verify translation key exists
3. Check if all 10 languages have the key
4. Add missing translation

---

**Ready to test!** 🚀
