// lib/types.ts - TypeScript types
export interface UserProfile {
  name: string
  location: string
  farmSize: string
  language: string
  soilType?: string
  crops?: string[]
}

export interface Crop {
  id: string
  name: string
  plantedDate: string
  expectedHarvestDate: string
  status: 'healthy' | 'needs-attention' | 'disease'
  progress: number
  daysToHarvest: number
  notes?: string
}

export interface WeatherData {
  current: {
    temp: number
    condition: string
    humidity: number
    wind: number
    rainfall: number
  }
  forecast: Array<{
    day: string
    temp: number
    condition: string
    icon: string
  }>
}

export interface MarketPrice {
  name: string
  price: number
  change: number
  trend: 'up' | 'down'
  unit: string
  market?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface InputShop {
  name: string
  type: 'pmksk' | 'private'
  distance: number
  items: Array<{
    name: string
    price: number
  }>
  address: string
  phone?: string
}
