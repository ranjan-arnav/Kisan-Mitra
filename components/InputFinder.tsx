'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, Store, IndianRupee, Phone, Navigation } from 'lucide-react'
import type { InputShop } from '@/lib/types'
import { getTranslation, getCurrentLanguage, type Language } from '@/lib/i18n'

export default function InputFinder() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'pmksk' | 'private'>('all')
  const [currentLang, setCurrentLang] = useState<Language>('en')

  useEffect(() => {
    setCurrentLang(getCurrentLanguage())
    
    const handleLanguageChange = () => {
      setCurrentLang(getCurrentLanguage())
    }
    
    window.addEventListener('languageChange', handleLanguageChange)
    return () => window.removeEventListener('languageChange', handleLanguageChange)
  }, [])

  // Demo data for input shops
  const shops: InputShop[] = [
    {
      name: 'PMKSK Fertilizer Center',
      type: 'pmksk',
      distance: 2.5,
      address: 'Near Bus Stand, Main Road',
      phone: '+91 98765 43210',
      items: [
        { name: 'Urea (50kg)', price: 266 },
        { name: 'DAP (50kg)', price: 1350 },
        { name: 'NPK (50kg)', price: 1050 },
      ],
    },
    {
      name: 'Green Valley Agro Store',
      type: 'private',
      distance: 1.8,
      address: 'Market Road, Shop No. 15',
      phone: '+91 98765 43211',
      items: [
        { name: 'Urea (50kg)', price: 280 },
        { name: 'DAP (50kg)', price: 1400 },
        { name: 'NPK (50kg)', price: 1100 },
        { name: 'Organic Fertilizer', price: 450 },
      ],
    },
    {
      name: 'PMKSK Seeds & Pesticides',
      type: 'pmksk',
      distance: 4.2,
      address: 'Agriculture Office Complex',
      phone: '+91 98765 43212',
      items: [
        { name: 'Pesticide A', price: 350 },
        { name: 'Pesticide B', price: 420 },
        { name: 'Seeds (1kg)', price: 180 },
      ],
    },
    {
      name: 'Farmer Choice Inputs',
      type: 'private',
      distance: 3.5,
      address: 'Highway Junction',
      phone: '+91 98765 43213',
      items: [
        { name: 'Urea (50kg)', price: 275 },
        { name: 'Pesticide A', price: 340 },
        { name: 'Pesticide B', price: 410 },
      ],
    },
    {
      name: 'Kisan Seva Kendra',
      type: 'pmksk',
      distance: 5.0,
      address: 'Village Center',
      phone: '+91 98765 43214',
      items: [
        { name: 'DAP (50kg)', price: 1345 },
        { name: 'NPK (50kg)', price: 1045 },
        { name: 'Micronutrients', price: 280 },
      ],
    },
  ]

  const filteredShops = shops.filter((shop) => {
    const matchesType = selectedType === 'all' || shop.type === selectedType
    const matchesSearch =
      searchQuery === '' ||
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesType && matchesSearch
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Store className="text-purple-600" size={36} />
          {getTranslation('inputFinder.title', currentLang)}
        </h2>
        <p className="text-gray-600 text-lg mt-2">
          {getTranslation('inputFinder.description', currentLang)}
        </p>
      </div>

      <div className="glass-effect rounded-3xl p-6 shadow-xl space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation('inputFinder.searchPlaceholder', currentLang)}
            className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType('all')}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
              selectedType === 'all'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            {getTranslation('inputFinder.allShops', currentLang)} ({shops.length})
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType('pmksk')}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
              selectedType === 'pmksk'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            {getTranslation('inputFinder.pmkskCenters', currentLang)}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType('private')}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
              selectedType === 'private'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            {getTranslation('inputFinder.privateShops', currentLang)}
          </motion.button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredShops.length === 0 ? (
            <div className="text-center py-12">
              <Store className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-xl text-gray-600">No shops found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredShops.map((shop, index) => (
              <motion.div
                key={shop.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{shop.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          shop.type === 'pmksk'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {shop.type === 'pmksk' ? 'PMKSK' : 'Private'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <MapPin size={16} />
                      <span>{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Navigation size={16} />
                      <span>{shop.distance} {getTranslation('inputFinder.kmAway', currentLang)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-bold text-gray-700 mb-2">{getTranslation('inputFinder.currentPrices', currentLang)}:</p>
                  <div className="space-y-2">
                    {shop.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-bold text-gray-900 flex items-center">
                          <IndianRupee size={14} />
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.a
                    href={`tel:${shop.phone}`}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Phone size={20} />
                    {getTranslation('inputFinder.call', currentLang)}
                  </motion.a>
                  <motion.a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(
                      shop.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Navigation size={20} />
                    {getTranslation('inputFinder.getDirections', currentLang)}
                  </motion.a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 glass-effect rounded-2xl p-4">
        <p className="text-sm text-gray-600">
          💡 <span className="font-semibold">Tip:</span> PMKSK shops usually offer subsidized
          prices on fertilizers and seeds. Compare prices before buying!
        </p>
      </div>
    </motion.div>
  )
}
