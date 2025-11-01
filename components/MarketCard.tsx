'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, IndianRupee, AlertTriangle, RefreshCw, Search, LineChart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { MarketService, type MarketPrice } from '@/lib/market'
import { getTranslation, getCurrentLanguage, type Language } from '@/lib/i18n'

interface MarketCardProps {
  fullView?: boolean
}

export default function MarketCard({ fullView = false }: MarketCardProps) {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [showBuyerModal, setShowBuyerModal] = useState(false)
  const [currentLang, setCurrentLang] = useState<Language>('en')

  useEffect(() => {
    loadPrices()
    setCurrentLang(getCurrentLanguage())
    
    const handleLanguageChange = () => {
      setCurrentLang(getCurrentLanguage())
    }
    
    window.addEventListener('languageChange', handleLanguageChange)
    return () => window.removeEventListener('languageChange', handleLanguageChange)
  }, [])

  const loadPrices = async () => {
    setLoading(true)
    try {
      const data = await MarketService.fetchMarketPrices()
      setPrices(data)
      // Format time on client side only to avoid hydration mismatch
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Failed to load market prices:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrices = searchQuery
    ? MarketService.searchPrices(searchQuery)
    : prices

  const advice = MarketService.getMarketAdvice(prices)

  const getCropEmoji = (name: string) => {
    const emojis: Record<string, string> = {
      wheat: '🌾',
      rice: '🌾',
      tomato: '🍅',
      onion: '🧅',
      potato: '🥔',
      cotton: '🌱',
    }
    return emojis[name.toLowerCase()] || '🌾'
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold flex items-center gap-2 text-primary">
          <TrendingUp className="text-purple-600" size={32} />
          {getTranslation('crops.marketPrices', currentLang)}
        </h3>
        <button 
          onClick={loadPrices}
          disabled={loading}
          className={`font-semibold text-lg flex items-center gap-2 disabled:opacity-50 text-purple-600 dark:text-purple-400`}
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          {getTranslation('common.refresh', currentLang)}
        </button>
      </div>

      <div className={`glass-effect rounded-3xl p-6 shadow-xl ''`}>
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={20} />
          <input
            type="text"
            placeholder={getTranslation('crops.searchCrops', currentLang)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 focus:outline-none bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-primary placeholder-gray-400 focus:border-purple-500"
          />
        </div>

        {/* Last Updated */}
        <div className="text-sm mb-4 text-center text-tertiary">
          {lastUpdated ? getTranslation('common.lastUpdated', currentLang).replace('{time}', lastUpdated) : getTranslation('common.loading', currentLang)}
        </div>

        {/* Market Advisory */}
        {advice.length > 0 && (
          <div className="mb-4 space-y-2">
            {advice.map((tip, index) => {
              const icon = tip.key === 'highPriceIncrease' ? '📈' : tip.key === 'pricesDecline' ? '📉' : '💹'
              const cropNames = tip.crops.map(crop => getTranslation(`crops.${crop.toLowerCase()}`, currentLang) || crop).join(', ')
              
              let message = ''
              if (tip.key === 'highPriceIncrease') {
                message = `${icon} ${getTranslation('market.highpriceincrease', currentLang)} ${cropNames}. ${getTranslation('market.highpriceincreaseadvice', currentLang)}`
              } else if (tip.key === 'pricesDecline') {
                message = `${icon} ${getTranslation('market.pricesdecline', currentLang)} ${cropNames}. ${getTranslation('market.pricesdeclineadvice', currentLang)}`
              } else if (tip.key === 'stablePrices') {
                message = `${icon} ${getTranslation('market.stableprices', currentLang)} ${cropNames}. ${getTranslation('market.stablepricesadvice', currentLang)}`
              }
              
              return (
                <div key={index} className="flex items-start gap-3 border-2 rounded-2xl p-4 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700">
                  <AlertTriangle className="text-yellow-600 dark:text-yellow-300 flex-shrink-0 mt-1" size={24} />
                  <p className="text-sm font-semibold text-secondary">
                    {message}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Price List */}
        <div className="space-y-3">
          {filteredPrices.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl p-4 shadow-md border-2 bg-white dark:bg-gray-700/50 border-gray-100 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">{getCropEmoji(item.name)}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary">{getTranslation(`crops.${item.name.toLowerCase()}`, currentLang) || item.name}</h4>
                    <p className="text-sm text-secondary">
                      {(() => {
                        const marketKey = item.market.toLowerCase().replace(/\s+/g, '')
                        const translation = getTranslation(`market.${marketKey}`, currentLang)
                        return translation && translation !== `market.${marketKey}` ? translation : item.market
                      })()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                    <IndianRupee size={20} />
                    {item.price}
                  </div>
                  <p className="text-xs text-tertiary">{getTranslation('crops.per', currentLang)} {item.unit}</p>
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold mt-1 ${
                      item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.trend === 'up' ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {Math.abs(item.change)}%
                  </div>
                </div>
              </div>

              {/* Price History Mini Chart */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs mb-3 text-tertiary">
                  <span className="flex items-center gap-1">
                    <LineChart size={14} />
                    {getTranslation('crops.lineChart', currentLang)}
                  </span>
                  <span className="font-medium">{getTranslation(`market.${MarketService.getBestSellingTime(item.name)}`, currentLang) || 'No data'}</span>
                </div>
                <div className="relative">
                  {/* Y-axis labels */}
                  {item.priceHistory && item.priceHistory.length > 0 && (
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 dark:text-gray-300 w-8 -ml-10">
                      <span>₹{Math.max(...item.priceHistory.map(p => p.price))}</span>
                      <span>₹{Math.round((Math.max(...item.priceHistory.map(p => p.price)) + Math.min(...item.priceHistory.map(p => p.price))) / 2)}</span>
                      <span>₹{Math.min(...item.priceHistory.map(p => p.price))}</span>
                    </div>
                  )}
                  {/* Price grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between h-16 opacity-20">
                    <div className="border-t border-gray-300 dark:border-gray-600"></div>
                    <div className="border-t border-gray-300 dark:border-gray-600"></div>
                    <div className="border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="flex items-end justify-between h-16 gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 relative ml-2">
                    {item.priceHistory && item.priceHistory.length > 0 ? item.priceHistory.map((point, idx) => {
                    const maxPrice = Math.max(...item.priceHistory.map(p => p.price))
                    const minPrice = Math.min(...item.priceHistory.map(p => p.price))
                    const priceRange = maxPrice - minPrice
                    
                    // Calculate height with better scaling
                    let heightPercent
                    if (priceRange === 0) {
                      heightPercent = 50 // If all prices are same, show 50% height
                    } else {
                      const normalizedHeight = ((point.price - minPrice) / priceRange) * 80 + 20 // Scale to 20-100%
                      heightPercent = Math.max(normalizedHeight, 8) // minimum 8%
                    }
                    const computedHeight = `${heightPercent}%`
                    
                    // Determine individual bar color based on previous price
                    let barColor = 'bg-gray-400' // default
                    if (idx > 0) {
                      const prevPrice = item.priceHistory[idx - 1].price
                      if (point.price > prevPrice) {
                        barColor = 'bg-green-400'
                      } else if (point.price < prevPrice) {
                        barColor = 'bg-red-400'
                      } else {
                        barColor = 'bg-yellow-400'
                      }
                    } else {
                      // First bar, use overall trend
                      barColor = item.trend === 'up' ? 'bg-green-400' : 'bg-red-400'
                    }
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col justify-end h-full group relative">
                        <motion.div 
                          className={`w-full rounded-t-md transition-all duration-300 hover:opacity-80 shadow-sm ${barColor}`}
                          initial={{ height: computedHeight }}
                          animate={{ height: computedHeight }}
                        />
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          ₹{point.price}
                        </div>
                        {/* Day label */}
                        <div className="text-xs text-center text-gray-500 dark:text-gray-300 mt-1 absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                          {idx + 1}
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="text-xs text-gray-500 dark:text-gray-300 flex items-center justify-center h-full">
                      <span className="flex items-center gap-1">
                        <LineChart size={16} className="text-gray-400 dark:text-gray-300" />
                        No chart data available
                      </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Chart legend */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-300 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                    <span>वृद्धि (Rise)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                    <span>गिरावट (Fall)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                    <span>स्थिर (Stable)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowBuyerModal(true)}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-shadow"
        >
          {getTranslation('market.findBuyersButton', currentLang)}
        </motion.button>
      </div>

      {/* Buyer Modal */}
      <AnimatePresence>
        {showBuyerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-primary mb-4">{getTranslation('market.buyerModalTitle', currentLang)}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">{getTranslation('market.selectCrop', currentLang)}</label>
                  <select 
                    title="Select crop to sell"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option>{getTranslation('market.selectCrop', currentLang)}</option>
                    {prices.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">{getTranslation('market.quantityLabel', currentLang)}</label>
                  <input 
                    type="number" 
                    placeholder={getTranslation('market.quantityPlaceholder', currentLang)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">{getTranslation('market.locationLabel', currentLang)}</label>
                  <input 
                    type="text" 
                    placeholder={getTranslation('market.locationPlaceholder', currentLang)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4 mb-6">
                <p className="text-sm text-green-800 font-semibold">
                  {getTranslation('market.featureComingSoon', currentLang)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBuyerModal(false)}
                  className="btn-secondary flex-1"
                >
                  {getTranslation('common.cancel', currentLang)}
                </button>
                <button
                  onClick={() => {
                    alert('Feature coming soon! We\'ll notify you when buyers connect.')
                    setShowBuyerModal(false)
                  }}
                  className="btn-primary flex-1"
                >
                  {getTranslation('common.submit', currentLang)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
