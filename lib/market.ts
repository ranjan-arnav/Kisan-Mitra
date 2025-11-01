// lib/market.ts - Market prices service
export interface MarketPrice {
  id: string
  name: string
  price: number
  change: number
  trend: 'up' | 'down'
  unit: string
  market: string
  lastUpdated: Date
  priceHistory: Array<{ date: string; price: number }>
}

export class MarketService {
  private static readonly DEMO_PRICES: MarketPrice[] = [
    {
      id: '1',
      name: 'Wheat',
      price: 2100,
      change: 5.2,
      trend: 'up',
      unit: 'quintal',
      market: 'Local Mandi',
      lastUpdated: new Date(),
      priceHistory: [
        { date: '2025-10-24', price: 1950 },
        { date: '2025-10-25', price: 2000 },
        { date: '2025-10-26', price: 2050 },
        { date: '2025-10-27', price: 2080 },
        { date: '2025-10-31', price: 2100 },
      ],
    },
    {
      id: '2',
      name: 'Rice',
      price: 3200,
      change: -2.1,
      trend: 'down',
      unit: 'quintal',
      market: 'Regional Mandi',
      lastUpdated: new Date(),
      priceHistory: [
        { date: '2025-10-24', price: 3300 },
        { date: '2025-10-25', price: 3280 },
        { date: '2025-10-26', price: 3250 },
        { date: '2025-10-27', price: 3220 },
        { date: '2025-10-31', price: 3200 },
      ],
    },
    {
      id: '3',
      name: 'Tomato',
      price: 25,
      change: 12.5,
      trend: 'up',
      unit: 'kg',
      market: 'Vegetable Market',
      lastUpdated: new Date(),
      priceHistory: [
        { date: '2025-10-24', price: 18 },
        { date: '2025-10-25', price: 20 },
        { date: '2025-10-26', price: 22 },
        { date: '2025-10-27', price: 23 },
        { date: '2025-10-31', price: 25 },
      ],
    },
    {
      id: '4',
      name: 'Onion',
      price: 18,
      change: -8.3,
      trend: 'down',
      unit: 'kg',
      market: 'Vegetable Market',
      lastUpdated: new Date(),
      priceHistory: [
        { date: '2025-10-24', price: 22 },
        { date: '2025-10-25', price: 21 },
        { date: '2025-10-26', price: 20 },
        { date: '2025-10-27', price: 19 },
        { date: '2025-10-31', price: 18 },
      ],
    },
    {
      id: '5',
      name: 'Potato',
      price: 15,
      change: 3.2,
      trend: 'up',
      unit: 'kg',
      market: 'Vegetable Market',
      lastUpdated: new Date(),
      priceHistory: [
        { date: '2025-10-24', price: 14 },
        { date: '2025-10-25', price: 14.2 },
        { date: '2025-10-26', price: 14.5 },
        { date: '2025-10-27', price: 14.8 },
        { date: '2025-10-31', price: 15 },
      ],
    },
    {
      id: '6',
      name: 'Cotton',
      price: 5800,
      change: 1.8,
      trend: 'up',
      unit: 'quintal',
      market: 'Cotton Market',
      lastUpdated: new Date(),
      priceHistory: [
        { date: '2025-10-24', price: 5650 },
        { date: '2025-10-25', price: 5700 },
        { date: '2025-10-26', price: 5750 },
        { date: '2025-10-27', price: 5780 },
        { date: '2025-10-31', price: 5800 },
      ],
    },
  ]

  static getMarketPrices(): MarketPrice[] {
    return this.DEMO_PRICES
  }

  static async fetchMarketPrices(state?: string, market?: string): Promise<MarketPrice[]> {
    try {
      // Try to use AGMARKNET API
      const { AGMARKNETService } = await import('./agmarknet')
      
      const agmarknetPrices = await AGMARKNETService.fetchMarketPrices(state, undefined, market)
      
      if (agmarknetPrices.length > 0) {
        console.log('Using real AGMARKNET data')
        return agmarknetPrices
      }
      
      // Fallback to demo data
      console.warn('AGMARKNET API not available, using demo data')
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.DEMO_PRICES)
        }, 500)
      })
    } catch (error) {
      console.error('Failed to fetch market prices:', error)
      // Return demo data on error
      return this.DEMO_PRICES
    }
  }

  static searchPrices(query: string): MarketPrice[] {
    return this.DEMO_PRICES.filter((price) =>
      price.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  static getPriceById(id: string): MarketPrice | undefined {
    return this.DEMO_PRICES.find((price) => price.id === id)
  }

  static getMarketAdvice(prices: MarketPrice[]): Array<{key: string, crops: string[]}> {
    const advice: Array<{key: string, crops: string[]}> = []

    const highGainers = prices.filter((p) => p.change > 10)
    if (highGainers.length > 0) {
      advice.push({
        key: 'highPriceIncrease',
        crops: highGainers.map((p) => p.name)
      })
    }

    const declining = prices.filter((p) => p.change < -5)
    if (declining.length > 0) {
      advice.push({
        key: 'pricesDecline',
        crops: declining.map((p) => p.name)
      })
    }

    const stable = prices.filter((p) => Math.abs(p.change) < 2)
    if (stable.length > 0) {
      advice.push({
        key: 'stablePrices', 
        crops: stable.map((p) => p.name)
      })
    }

    return advice
  }

  static getBestSellingTime(cropName: string): string {
    const price = this.DEMO_PRICES.find(
      (p) => p.name.toLowerCase() === cropName.toLowerCase()
    )
    if (!price) return 'nodata'

    if (price.trend === 'up' && price.change > 5) {
      return 'goodtimetosell'
    } else if (price.trend === 'down') {
      return 'considerwaiting'
    } else {
      return 'marketstable'
    }
  }
}
