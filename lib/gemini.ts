// lib/gemini.ts - Gemini AI Integration
export interface GeminiMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export class GeminiService {
  private apiKey: string
  private model: string = 'gemini-2.0-flash'
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
  }

  async chat(messages: GeminiMessage[], language: string = 'en'): Promise<string> {
    if (!this.apiKey) {
      return 'Please configure your Gemini API key in .env.local file.'
    }

    // Add system instruction with improved conversational abilities
  const systemInstruction = `You are Kisan Mitra, an AI farming assistant designed specifically for Indian farmers.

ABOUT YOU:
- Name: Kisan Mitra (किसान मित्र)
- Purpose: Help Indian farmers with agriculture, crop management, weather advice, market prices, and farming techniques
- Languages: You can communicate in 10 Indian languages - English, Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), Malayalam (മലയാളം), Kannada (ಕನ್ನಡ), Gujarati (ગુજરાતી), Bengali (বাংলা), Marathi (मराठी), and Punjabi (ਪੰਜਾਬੀ)
- Current conversation language: ${language}

CORE CAPABILITIES:
• Crop planning and recommendations
• Disease and pest identification and treatment
• Weather-based farming advice
• Market price guidance and selling strategies
• Soil management and fertilizer recommendations
• Government schemes and subsidies for farmers
• Organic and sustainable farming practices
• Livestock and dairy farming guidance
• Agricultural equipment suggestions
• Irrigation and water management

RESPONSE GUIDELINES:
1. ALWAYS respond in ${language} language using simple, farmer-friendly vocabulary
2. When introducing yourself, mention your name and capabilities in ${language}
3. For basic questions about yourself or capabilities, provide friendly, informative answers
4. For agriculture questions, give practical, actionable advice suitable for Indian farming conditions
5. Use bullet points (•) and proper formatting for better readability
6. Include Hindi/local names for crops and practices when helpful
7. For non-agricultural topics, politely redirect to farming topics

SAMPLE RESPONSES:
- "Who are you?" → Introduce yourself as Kisan Mitra and explain your role
- "What languages do you know?" → List all 10 supported languages
- "How can you help me?" → Explain your farming assistance capabilities

Remember: You're a helpful farming companion, not just a strict agricultural database. Be conversational while staying focused on farming.`

    // Prepend system context to user's first message
    const enhancedMessages = messages.map((msg, index) => {
      if (index === 0 && msg.role === 'user') {
        return {
          ...msg,
          parts: [
            { text: systemInstruction + '\n\nUser question: ' + msg.parts[0].text }
          ]
        }
      }
      return msg
    })

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: enhancedMessages,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated.'
    } catch (error) {
      console.error('Gemini API error:', error)
      return 'Sorry, I encountered an error. Please try again later.'
    }
  }

  async analyzeCropImage(imageBase64: string, question: string): Promise<string> {
    if (!this.apiKey) {
      return 'Please configure your Gemini API key in .env.local file.'
    }

    const systemPrompt = `You are an expert agricultural pathologist and crop advisor for Indian farmers. 

Analyze this crop/plant image and provide:
1. Crop identification (if visible)
2. Disease/pest detection (if any)
3. Health assessment
4. Treatment recommendations (organic and chemical options)
5. Prevention tips

ONLY discuss agriculture. If the image is not related to farming/crops, say: "This doesn't appear to be a crop or plant. Please upload an image of your crop or plant for diagnosis."

Be practical and specific for Indian farming conditions.`

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemPrompt + '\n\n' + question },
                  {
                    inline_data: {
                      mime_type: 'image/jpeg',
                      data: imageBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              topK: 32,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates[0]?.content?.parts[0]?.text || 'Unable to analyze the image.'
    } catch (error) {
      console.error('Image analysis error:', error)
      return 'Sorry, I could not analyze the image. Please try again.'
    }
  }

  async getCropRecommendation(
    soilType: string,
    location: string,
    season: string
  ): Promise<string> {
    const prompt = `You are an expert agricultural advisor for Indian farmers.

Based on these farming conditions in India:
- Soil Type: ${soilType}
- Location: ${location}
- Season: ${season}

Recommend the 3-4 BEST crops to grow with:
1. Crop name (in English and Hindi if possible)
2. Expected yield per acre
3. Water requirements
4. Ideal growing conditions
5. Market potential and selling price
6. Growing duration
7. Initial investment needed

Focus on crops suitable for Indian climate and profitable in Indian markets.
Provide practical, actionable advice for Indian farmers.`

    return this.chat([
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ])
  }
}
