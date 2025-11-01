'use client'

import { useState, useEffect, useMemo, type ComponentType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sprout,
  Sun,
  Cloud,
  Droplets,
  TrendingUp,
  User,
  MapPin,
  Smartphone,
  ChevronRight,
  CheckCircle,
  Globe,
  BellRing,
} from 'lucide-react'
import {
  languages,
  type Language,
  getTranslation,
  setCurrentLanguage as setAppLanguage,
  getCurrentLanguage,
} from '@/lib/i18n'
import { NotificationService } from '@/lib/notification'
import { storage } from '@/lib/storage'

interface OnboardingFlowProps {
  onComplete: (userData?: any) => void
}

type OnboardingStep = {
  id: string
  title: string
  subtitle: string
  description: string
  icon: ComponentType<{ size?: number | string; className?: string }>
  color: string
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [currentLanguage, setCurrentLang] = useState<Language>('en')
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    farmSize: '',
  })
  const [showForm, setShowForm] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [requestingNotifications, setRequestingNotifications] = useState(false)

  useEffect(() => {
    const savedLang = getCurrentLanguage()
    setCurrentLang(savedLang)

    const storedUser = storage.getUser()
    if (storedUser) {
      setFormData({
        name: storedUser.name || '',
        location: storedUser.location || '',
        farmSize: storedUser.farmSize || '',
      })
    }

    if (typeof window !== 'undefined' && typeof window.Notification !== 'undefined') {
      setNotificationsEnabled(window.Notification.permission === 'granted')
    }
  }, [])

  const onboardingSteps: OnboardingStep[] = useMemo(
    () => [
      {
        id: 'weather',
        title: getTranslation('onboarding.slides.weatherTitle', currentLanguage),
        subtitle: getTranslation('onboarding.slides.weatherSubtitle', currentLanguage),
        description: getTranslation('onboarding.slides.weatherDescription', currentLanguage),
        icon: Cloud,
        color: 'from-blue-400 to-cyan-500',
      },
      {
        id: 'crops',
        title: getTranslation('onboarding.slides.cropTitle', currentLanguage),
        subtitle: getTranslation('onboarding.slides.cropSubtitle', currentLanguage),
        description: getTranslation('onboarding.slides.cropDescription', currentLanguage),
        icon: Sprout,
        color: 'from-green-400 to-emerald-500',
      },
      {
        id: 'market',
        title: getTranslation('onboarding.slides.marketTitle', currentLanguage),
        subtitle: getTranslation('onboarding.slides.marketSubtitle', currentLanguage),
        description: getTranslation('onboarding.slides.marketDescription', currentLanguage),
        icon: TrendingUp,
        color: 'from-purple-400 to-pink-500',
      },
      {
        id: 'ai',
        title: getTranslation('onboarding.slides.aiTitle', currentLanguage),
        subtitle: getTranslation('onboarding.slides.aiSubtitle', currentLanguage),
        description: getTranslation('onboarding.slides.aiDescription', currentLanguage),
        icon: Smartphone,
        color: 'from-indigo-400 to-purple-500',
      },
    ],
    [currentLanguage]
  )

  const handleLanguageSelect = (lang: Language) => {
    setCurrentLang(lang)
    setAppLanguage(lang)
    setCurrentStep(0)
  }

  const handleNext = () => {
    setCurrentStep((prev) => {
      if (prev < onboardingSteps.length - 1) {
        return prev + 1
      }
      setShowForm(true)
      return prev
    })
  }

  const handleSkip = () => {
    storage.setOnboarded(true)
    onComplete()
  }

  const handleSubmit = () => {
    const profile = {
      ...formData,
      language: currentLanguage,
    }
    storage.setUser(profile)
    storage.setOnboarded(true)
    onComplete(profile)
  }

  const handleEnableNotifications = async () => {
    if (notificationsEnabled || requestingNotifications) return
    setRequestingNotifications(true)
    try {
      const granted = await NotificationService.requestPermission()
      setNotificationsEnabled(granted)
    } catch (error) {
      console.error('Notification permission failed', error)
      setNotificationsEnabled(false)
    } finally {
      setRequestingNotifications(false)
    }
  }

  const currentSlide = onboardingSteps[Math.max(currentStep, 0)]
  const IconComponent = currentSlide?.icon || Cloud

  const renderLanguageSelection = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-green-200 opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sprout size={60} />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-blue-200 opacity-30"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Globe size={50} />
        </motion.div>
      </div>

      <div className="w-full max-w-3xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 md:p-10 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
          >
            <Globe size={48} className="text-white" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-800 dark:text-gray-100">
            {getTranslation('onboarding.selectLanguage', currentLanguage)}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg">
            {getTranslation('onboarding.languageDescription', currentLanguage)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {languages.map((lang, index) => {
              const active = currentLanguage === lang.code
              return (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`glass-effect p-4 rounded-2xl transition-all text-left group border-2 ${
                    active ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-transparent'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={active}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden>
                      {lang.flag}
                    </span>
                    <div>
                      <div className={`font-bold text-gray-800 dark:text-gray-100 group-hover:text-green-600 transition-colors ${active ? 'text-green-600' : ''}`}>
                        {lang.nativeName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">{lang.name}</div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )

  const renderStepContent = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-green-200 opacity-30"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sprout size={60} />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-blue-200 opacity-30"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Droplets size={50} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-16 text-yellow-200 opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sun size={70} />
        </motion.div>
      </div>

      <div className="w-full max-w-xl z-10">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key={currentSlide?.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.35 }}
              className="glass-effect rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${currentSlide?.color} flex items-center justify-center shadow-lg`}
              >
                <IconComponent size={48} className="text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <div className="text-sm text-tertiary mb-2">
                  {currentStep + 1}/{onboardingSteps.length}
                </div>
                <h1 className="text-3xl font-bold mb-2 text-gray-800">
                  {currentSlide?.title}
                </h1>
                <p className="text-xl text-green-600 font-semibold mb-4">
                  {currentSlide?.subtitle}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {currentSlide?.description}
                </p>
              </motion.div>

              <div className="flex justify-center gap-2 mb-8">
                {onboardingSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep ? 'w-8 bg-green-600' : 'w-2 bg-gray-300'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.35 + index * 0.08 }}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <motion.button
                  onClick={handleNext}
                  className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3"
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentStep < onboardingSteps.length - 1
                    ? getTranslation('onboarding.next', currentLanguage)
                    : getTranslation('onboarding.getStarted', currentLanguage)}
                  <ChevronRight size={26} />
                </motion.button>

                <motion.button
                  onClick={handleSkip}
                  className="w-full py-4 text-lg text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  {getTranslation('onboarding.skip', currentLanguage)}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="glass-effect rounded-3xl p-8 md:p-10 shadow-2xl space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
              >
                <User size={48} className="text-white" />
              </motion.div>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {getTranslation('onboarding.form.title', currentLanguage)}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {getTranslation('onboarding.form.subtitle', currentLanguage)}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    <User className="inline mr-2" size={22} />
                    {getTranslation('onboarding.form.nameLabel', currentLanguage)}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={getTranslation('onboarding.form.namePlaceholder', currentLanguage)}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    <MapPin className="inline mr-2" size={22} />
                    {getTranslation('onboarding.form.locationLabel', currentLanguage)}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={getTranslation('onboarding.form.locationPlaceholder', currentLanguage)}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    <Sprout className="inline mr-2" size={22} />
                    {getTranslation('onboarding.form.sizeLabel', currentLanguage)}
                  </label>
                  <input
                    type="text"
                    value={formData.farmSize}
                    onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                    placeholder={getTranslation('onboarding.form.sizePlaceholder', currentLanguage)}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    {getTranslation('onboarding.form.helpText', currentLanguage)}
                  </p>
                </div>
              </div>

              <div className="glass-effect border border-green-200 dark:border-green-700 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <BellRing size={24} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-primary">
                      {getTranslation('onboarding.notifications.title', currentLanguage)}
                    </h3>
                    <p className="text-sm text-secondary mb-3">
                      {getTranslation('onboarding.notifications.subtitle', currentLanguage)}
                    </p>
                    <button
                      onClick={handleEnableNotifications}
                      disabled={notificationsEnabled || requestingNotifications}
                      className={`btn-secondary w-full sm:w-auto px-5 py-3 flex items-center justify-center gap-2 ${
                        notificationsEnabled ? 'bg-green-600 text-white hover:bg-green-600' : ''
                      }`}
                    >
                      {notificationsEnabled ? (
                        <>
                          <CheckCircle size={20} />
                          {getTranslation('onboarding.notifications.enableButton', currentLanguage)}
                        </>
                      ) : (
                        <>
                          {requestingNotifications && <span className="animate-pulse">•</span>}
                          {getTranslation('onboarding.notifications.enableButton', currentLanguage)}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleSubmit}
                className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3"
                whileTap={{ scale: 0.95 }}
                disabled={!formData.name || !formData.location}
              >
                <CheckCircle size={26} />
                {getTranslation('onboarding.finish', currentLanguage)}
              </motion.button>

              <button
                onClick={handleSkip}
                className="w-full py-4 text-lg text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {getTranslation('onboarding.skip', currentLanguage)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  return currentStep === -1 ? renderLanguageSelection() : renderStepContent()
}
