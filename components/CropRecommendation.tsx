'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sprout, Loader2, CheckCircle, MapPin, Droplets } from 'lucide-react'
import { GeminiService } from '@/lib/gemini'
import { storage } from '@/lib/storage'
import { getTranslation, getCurrentLanguage, type Language } from '@/lib/i18n'

export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    soilType: '',
    location: storage.getUser()?.location || '',
    season: '',
    waterAvailability: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState<string | null>(null)
  const [currentLang, setCurrentLang] = useState<Language>('en')
  const gemini = new GeminiService()

  useEffect(() => {
    setCurrentLang(getCurrentLanguage())
    
    const handleLanguageChange = () => {
      setCurrentLang(getCurrentLanguage())
    }
    
    window.addEventListener('languageChange', handleLanguageChange)
    return () => window.removeEventListener('languageChange', handleLanguageChange)
  }, [])

  const soilTypes = [
    { key: 'loamy', label: getTranslation('cropRecommendation.loamy', currentLang) },
    { key: 'clay', label: getTranslation('cropRecommendation.clay', currentLang) },
    { key: 'sandy', label: getTranslation('cropRecommendation.sandy', currentLang) },
    { key: 'silt', label: getTranslation('cropRecommendation.silt', currentLang) },
    { key: 'redSoil', label: getTranslation('cropRecommendation.redSoil', currentLang) },
    { key: 'blackSoil', label: getTranslation('cropRecommendation.blackSoil', currentLang) },
    { key: 'alluvial', label: getTranslation('cropRecommendation.alluvial', currentLang) },
  ]
  const seasons = [
    { key: 'kharif', label: getTranslation('cropRecommendation.kharif', currentLang) },
    { key: 'rabi', label: getTranslation('cropRecommendation.rabi', currentLang) },
    { key: 'zaid', label: getTranslation('cropRecommendation.zaid', currentLang) },
  ]
  const waterLevels = [
    { key: 'abundant', label: getTranslation('cropRecommendation.abundant', currentLang) },
    { key: 'moderate', label: getTranslation('cropRecommendation.moderate', currentLang) },
    { key: 'limited', label: getTranslation('cropRecommendation.limited', currentLang) },
    { key: 'rainDependent', label: getTranslation('cropRecommendation.rainDependent', currentLang) },
  ]

  const handleGenerate = async () => {
    if (!formData.soilType || !formData.location || !formData.season) {
      alert(getTranslation('cropRecommendation.fillRequiredFields', currentLang))
      return
    }

    setIsGenerating(true)
    setRecommendations(null)

    try {
      const response = await gemini.getCropRecommendation(
        formData.soilType,
        formData.location,
        `${formData.season} with ${formData.waterAvailability} water availability`
      )
      setRecommendations(response)
    } catch (error) {
      console.error('Recommendation error:', error)
      setRecommendations(getTranslation('cropRecommendation.errorMessage', currentLang))
    } finally {
      setIsGenerating(false)
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
          <Sprout className="text-green-600" size={36} />
          {getTranslation('cropRecommendation.title', currentLang)}
        </h2>
        <p className="text-gray-600 text-lg mt-2">
          {getTranslation('cropRecommendation.description', currentLang)}
        </p>
      </div>

      <div className="glass-effect rounded-3xl p-6 shadow-xl space-y-6">
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-3">
            <Droplets className="inline mr-2" size={24} />
            {getTranslation('cropRecommendation.soilType', currentLang)}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {soilTypes.map((type) => (
              <motion.button
                key={type.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, soilType: type.label })}
                className={`py-4 px-4 rounded-2xl font-semibold transition-all ${
                  formData.soilType === type.label
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}
              >
                {type.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-800 mb-3">
            <MapPin className="inline mr-2" size={24} />
            {getTranslation('cropRecommendation.location', currentLang)}
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder={getTranslation('cropRecommendation.locationPlaceholder', currentLang)}
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-800 mb-3">
            {getTranslation('cropRecommendation.season', currentLang)}
          </label>
          <div className="space-y-3">
            {seasons.map((season) => (
              <motion.button
                key={season.key}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ ...formData, season: season.label })}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-left transition-all ${
                  formData.season === season.label
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}
              >
                {season.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-800 mb-3">
            {getTranslation('cropRecommendation.waterAvailability', currentLang)}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {waterLevels.map((level) => (
              <motion.button
                key={level.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, waterAvailability: level.label })}
                className={`py-4 px-4 rounded-2xl font-semibold transition-all ${
                  formData.waterAvailability === level.label
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}
              >
                {level.label}
              </motion.button>
            ))}
          </div>
        </div>

        {!recommendations && !isGenerating && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            className="w-full btn-primary py-6 text-xl"
          >
            {getTranslation('cropRecommendation.generateRecommendations', currentLang)}
          </motion.button>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="animate-spin text-green-600" size={56} />
            <p className="text-xl font-semibold text-gray-700">
              {getTranslation('cropRecommendation.analyzing', currentLang)}
            </p>
            <p className="text-sm text-gray-600">
              {getTranslation('cropRecommendation.gettingRecommendations', currentLang)}
            </p>
          </div>
        )}

        {recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-green-600 font-bold text-xl">
              <CheckCircle size={28} />
              {getTranslation('cropRecommendation.recommendationsReady', currentLang)}
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base">
                {recommendations}
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setRecommendations(null)
                  setFormData({
                    soilType: '',
                    location: storage.getUser()?.location || '',
                    season: '',
                    waterAvailability: '',
                  })
                }}
                className="flex-1 btn-secondary py-5 text-lg"
              >
                {getTranslation('cropRecommendation.newSearch', currentLang)}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.share?.({
                    title: getTranslation('cropRecommendation.shareTitle', currentLang),
                    text: recommendations,
                  })
                }}
                className="flex-1 btn-primary py-5 text-lg"
              >
                {getTranslation('cropRecommendation.share', currentLang)}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
