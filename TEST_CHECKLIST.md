# 🧪 Quick Test Checklist

## ✅ Test Voice Search

1. **Open App** → Go to Dashboard
2. **Click Microphone Button** (purple button, bottom right)
3. **Say:** "Weather"
   - ✅ Should open Weather tab
4. **Say:** "Market prices"
   - ✅ Should open Market tab
5. **Say:** "Show my crops"
   - ✅ Should open Crops tab
6. **Say:** "How to grow wheat?"
   - ✅ Should open AI Assistant with your question

---

## ✅ Test Find Buyers

1. **Go to Market tab**
2. **Scroll down**
3. **Click "Find Best Buyers Near You"** button
4. **Modal should appear** with:
   - Crop dropdown
   - Quantity input
   - Location input
   - Submit button
5. **Fill form and click Submit**
   - ✅ Should show alert message
   - ✅ Modal should close

---

## ✅ Test Hydration Error

1. **Open browser console** (F12)
2. **Refresh page**
3. **Check for errors**
   - ❌ Should see NO hydration error
   - ❌ Should see NO "Text content does not match" error
   - ✅ Console should be clean

---

## ✅ Test Market Data

**Current Behavior (Without API Key):**
- Shows demo data (6 crops)
- All features work (search, charts, refresh)
- Realistic prices and trends

**To Test Real Data:**
1. Get AGMARKNET API key from data.gov.in
2. Add to `.env.local`: `NEXT_PUBLIC_AGMARKNET_API_KEY=your_key`
3. Restart app
4. Should see real government mandi prices

---

## ✅ Test Multi-Language

**What's Translated:**
- Onboarding language selection
- Dashboard greeting
- Tab names (My Crops, Weather, Market)

**What's NOT Translated:**
- Weather card details
- Market card details
- Crop management forms

**Test:**
1. Click Globe icon in header
2. Select Hindi
3. Check: Dashboard greeting changes to Hindi
4. Check: Tab names change to Hindi
5. Note: Content inside cards still in English (needs more work)

---

## 🎯 Expected Results

| Feature | Expected | Status |
|---------|----------|--------|
| Voice "Weather" | Opens weather tab | ✅ WORKS |
| Voice "Market" | Opens market tab | ✅ WORKS |
| Voice "Question" | Opens AI assistant | ✅ WORKS |
| Find Buyers button | Opens modal form | ✅ WORKS |
| Hydration error | No errors in console | ✅ FIXED |
| Market data | Shows demo data | ✅ WORKS |
| Language switch | Dashboard changes | ✅ PARTIAL |

---

**All critical issues fixed!** 🎉
