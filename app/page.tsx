'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OnboardingFlow from '@/components/OnboardingFlow'
import { storage } from '@/lib/storage'
import { getTranslation, getCurrentLanguage, type Language } from '@/lib/i18n'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentLang, setCurrentLang] = useState<Language>('en')

  useEffect(() => {
    setCurrentLang(getCurrentLanguage())
    
    // Small delay to ensure localStorage is available
    const timer = setTimeout(() => {
      const hasCompletedOnboarding = storage.isOnboarded()
      
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true)
      } else {
        router.push('/dashboard')
      }
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  const handleOnboardingComplete = (userData?: any) => {
    storage.setOnboarded(true)
    if (userData) {
      storage.setUser(userData)
    }
    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
        <p className="text-gray-600 font-semibold">{getTranslation('common.loading', currentLang)}</p>
      </div>
    )
  }

  if (!showOnboarding) {
    return null
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />
}
