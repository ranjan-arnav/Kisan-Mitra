'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Check, X, Loader2, AlertCircle } from 'lucide-react'
import { TelegramService } from '@/lib/telegram'
import { getTranslation, getCurrentLanguage } from '@/lib/i18n'

interface TelegramConnectProps {
  onClose: () => void
}

export default function TelegramConnect({ onClose }: TelegramConnectProps) {
  const [linkCode, setLinkCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [linked, setLinked] = useState<any>(TelegramService.getLinkedAccount())
  const currentLang = getCurrentLanguage()

  const handleLink = async () => {
    if (!linkCode || linkCode.length !== 6) {
      setError('Please enter a valid 6-character code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Verify code with backend
      const response = await fetch(`/api/telegram?code=${linkCode}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code')
      }

      // Link account locally
      TelegramService.linkTelegramAccount(
        data.userId,
        parseInt(data.userId),
        { id: parseInt(data.userId), first_name: 'Telegram User' }
      )

      setSuccess(true)
      setLinked(TelegramService.getLinkedAccount())

      // Close after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to link account')
    } finally {
      setLoading(false)
    }
  }

  const handleUnlink = () => {
    TelegramService.unlinkAccount()
    setLinked(null)
    setSuccess(false)
    setLinkCode('')
  }

  if (linked && !success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Telegram Connected
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Send size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {linked.telegramUser.first_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{linked.telegramUser.username || 'telegram_user'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connected on {new Date(linked.linkedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Active features:</strong>
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                Weather alerts
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                Market price notifications
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                Crop reminders
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                AI assistant via chat
              </li>
            </ul>
          </div>

          <button
            onClick={handleUnlink}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
          >
            Unlink Account
          </button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Connect Telegram
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {success ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Check size={40} className="text-green-600" />
            </div>
            <p className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Successfully Linked!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              You can now receive notifications via Telegram
            </p>
          </motion.div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Follow these steps to connect your Telegram account:
              </p>
              <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex gap-3">
                  <span className="font-bold text-green-600">1.</span>
                  <span>Open Telegram and search for <strong>@KisanMitraBot</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-green-600">2.</span>
                  <span>Send <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">/link</code> command</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-green-600">3.</span>
                  <span>Copy the 6-character code</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-green-600">4.</span>
                  <span>Enter the code below</span>
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Enter Linking Code
                </label>
                <input
                  type="text"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-wider border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-green-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertCircle size={20} className="text-red-600" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleLink}
                disabled={loading || linkCode.length !== 6}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Link Account
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Note:</strong> The linking code expires in 10 minutes. Get weather alerts, market updates, and crop reminders directly in Telegram!
              </p>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
