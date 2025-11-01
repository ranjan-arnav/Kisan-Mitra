'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react'
import { GeminiService } from '@/lib/gemini'
import { getTranslation, getCurrentLanguage, type Language } from '@/lib/i18n'

export default function CropDiagnosis() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [currentLang, setCurrentLang] = useState<Language>('en')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const gemini = new GeminiService()

  useEffect(() => {
    setCurrentLang(getCurrentLanguage())
    
    const handleLanguageChange = () => {
      setCurrentLang(getCurrentLanguage())
    }
    
    window.addEventListener('languageChange', handleLanguageChange)
    return () => window.removeEventListener('languageChange', handleLanguageChange)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeCrop = async () => {
    if (!image) return

    setIsAnalyzing(true)
    setResult(null)

    try {
      const base64Image = image.split(',')[1]
      const prompt = `You are an expert agricultural pathologist. Analyze this crop image and provide:

1. **Crop Identification**: What crop is this?
2. **Health Status**: Is the crop healthy or diseased?
3. **Disease/Issue Detected**: If any disease or nutrient deficiency is present, identify it clearly.
4. **Symptoms**: List the visible symptoms you can see.
5. **Treatment**: Provide detailed treatment recommendations including:
   - Organic solutions
   - Chemical pesticides/fungicides (with names)
   - Cultural practices
6. **Prevention**: How to prevent this in the future.
7. **Urgency**: Rate the urgency (Low/Medium/High).

Be specific and practical. Format your response clearly with headings.`

      const response = await gemini.analyzeCropImage(base64Image, prompt)
      setResult(response)
    } catch (error) {
      console.error('Analysis error:', error)
      setResult('Failed to analyze image. Please try again with a clearer photo.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Camera className="text-green-600" size={36} />
          {getTranslation('diagnosis.title', currentLang)}
        </h2>
        <p className="text-gray-600 text-lg mt-2">
          {getTranslation('diagnosis.description', currentLang)}
        </p>
      </div>

      <div className="glass-effect rounded-3xl p-6 shadow-xl">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />

        {!image ? (
          <div className="space-y-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full btn-primary py-6 text-xl flex items-center justify-center gap-3"
            >
              <Camera size={32} />
              {getTranslation('diagnosis.takePhoto', currentLang)}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full btn-secondary py-6 text-xl flex items-center justify-center gap-3"
            >
              <Upload size={32} />
              {getTranslation('diagnosis.uploadFromGallery', currentLang)}
            </motion.button>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <p className="text-blue-800 font-semibold mb-2">{getTranslation('diagnosis.tipsTitle', currentLang)}</p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>{getTranslation('diagnosis.tip1', currentLang)}</li>
                <li>{getTranslation('diagnosis.tip2', currentLang)}</li>
                <li>{getTranslation('diagnosis.tip3', currentLang)}</li>
                <li>{getTranslation('diagnosis.tip4', currentLang)}</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={getTranslation('diagnosis.cropImageAlt', currentLang)}
                className="w-full h-auto max-h-96 object-contain bg-gray-100"
              />
              <button
                onClick={() => {
                  setImage(null)
                  setResult(null)
                }}
                className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-xl shadow-lg"
              >
                {getTranslation('diagnosis.remove', currentLang)}
              </button>
            </div>

            {!result && !isAnalyzing && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={analyzeCrop}
                className="w-full btn-primary py-6 text-xl flex items-center justify-center gap-3"
              >
                <Sparkles size={32} />
                {getTranslation('diagnosis.analyzeWithAI', currentLang)}
              </motion.button>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="animate-spin text-green-600" size={48} />
                <p className="text-lg font-semibold text-gray-700">
                  {getTranslation('diagnosis.analyzing', currentLang)}
                </p>
                <p className="text-sm text-gray-600">{getTranslation('diagnosis.analyzingSubtext', currentLang)}</p>
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 text-green-600 font-bold text-xl">
                  <CheckCircle size={28} />
                  {getTranslation('diagnosis.analysisComplete', currentLang)}
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {result}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setImage(null)
                      setResult(null)
                    }}
                    className="flex-1 btn-secondary py-5 text-lg"
                  >
                    Analyze Another
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigator.share?.({
                        title: 'Crop Diagnosis Report',
                        text: result,
                      })
                    }}
                    className="flex-1 btn-primary py-5 text-lg"
                  >
                    Share Report
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 glass-effect rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-orange-600 flex-shrink-0" size={24} />
          <div>
            <p className="font-semibold text-gray-800">Note:</p>
            <p className="text-sm text-gray-600">
              AI analysis is for guidance only. For serious crop issues, please consult a local
              agricultural expert or extension officer.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
