'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, Activity, RefreshCw, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  fetchLiveMarketData, 
  formatPrice, 
  formatChange, 
  getChangeColor, 
  getChangeBgColor,
  MarketDataResponse
} from '@/lib/marketData'

// Interface for display data
interface IndexData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  description: string
  category: string
}

export default function MarketIndices() {
  const router = useRouter()
  const [indices, setIndices] = useState<IndexData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [marketOpen, setMarketOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Function to check if US stock market is open
  const checkMarketOpen = () => {
    const now = new Date()
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
    const day = easternTime.getDay()
    const hour = easternTime.getHours()
    const minute = easternTime.getMinutes()
    const timeInMinutes = hour * 60 + minute
    
    // Market is open Monday (1) through Friday (5), 9:30 AM to 4:00 PM Eastern
    const isWeekday = day >= 1 && day <= 5
    const isMarketHours = timeInMinutes >= 570 && timeInMinutes < 960 // 9:30 AM to 4:00 PM
    
    return isWeekday && isMarketHours
  }

  // Convert API data to display format
  const convertApiDataToIndices = (data: MarketDataResponse): IndexData[] => {
    const apiIndices = data.data.indices
    return [
      {
        symbol: 'SPY',
        name: 'S&P 500',
        price: apiIndices['S&P 500 (SPY)']?.price || 512.34,
        change: apiIndices['S&P 500 (SPY)']?.change || 2.45,
        changePercent: apiIndices['S&P 500 (SPY)']?.changePercent || 0.48,
        description: 'Large Cap',
        category: 'Broad Market'
      },
      {
        symbol: 'QQQ',
        name: 'Nasdaq',
        price: apiIndices['NASDAQ (QQQ)']?.price || 395.67,
        change: apiIndices['NASDAQ (QQQ)']?.change || -1.23,
        changePercent: apiIndices['NASDAQ (QQQ)']?.changePercent || -0.31,
        description: 'Tech Heavy',
        category: 'Technology'
      },
      {
        symbol: 'IWM',
        name: 'Russell 2000',
        price: apiIndices['Russell 2000 (IWM)']?.price || 198.45,
        change: apiIndices['Russell 2000 (IWM)']?.change || 0.67,
        changePercent: apiIndices['Russell 2000 (IWM)']?.changePercent || 0.34,
        description: 'Small Cap',
        category: 'Growth'
      },
      {
        symbol: 'VTI',
        name: 'Total Market',
        price: apiIndices['Total Market (VTI)']?.price || 258.92,
        change: apiIndices['Total Market (VTI)']?.change || 1.12,
        changePercent: apiIndices['Total Market (VTI)']?.changePercent || 0.43,
        description: 'Total Market',
        category: 'Broad Market'
      }
    ]
  }

  // Fetch live market data
  const fetchIndicesData = async () => {
    setIsLoading(true)
    try {
      const marketData = await fetchLiveMarketData()
      const indicesData = convertApiDataToIndices(marketData)
      setIndices(indicesData)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch indices data:', error)
      // Set fallback data if no data exists
      if (indices.length === 0) {
        setIndices([
          { symbol: 'SPY', name: 'S&P 500', price: 512.34, change: 2.45, changePercent: 0.48, description: 'Large Cap', category: 'Broad Market' },
          { symbol: 'QQQ', name: 'Nasdaq', price: 395.67, change: -1.23, changePercent: -0.31, description: 'Tech Heavy', category: 'Technology' },
          { symbol: 'IWM', name: 'Russell 2000', price: 198.45, change: 0.67, changePercent: 0.34, description: 'Small Cap', category: 'Growth' },
          { symbol: 'VTI', name: 'Total Market', price: 258.92, change: 1.12, changePercent: 0.43, description: 'Total Market', category: 'Broad Market' }
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    setMarketOpen(checkMarketOpen())
    fetchIndicesData()

    // Set up intervals
    const marketStatusInterval = setInterval(() => {
      setMarketOpen(checkMarketOpen())
    }, 30000) // Check every 30 seconds

    const dataInterval = setInterval(() => {
      fetchIndicesData()
    }, 60000) // Fetch every minute

    return () => {
      clearInterval(marketStatusInterval)
      clearInterval(dataInterval)
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchIndicesData()
    setIsRefreshing(false)
  }

  const handleAnalyze = (symbol: string) => {
    router.push(`/strategy-builder?symbol=${symbol}`)
  }

  const getMarketSentiment = () => {
    const positiveIndices = indices.filter((index: IndexData) => index.changePercent > 0).length
    const totalIndices = indices.length
    const positiveRatio = positiveIndices / totalIndices
    
    if (positiveRatio >= 0.75) return { text: 'Bullish', color: 'text-green-400', bgColor: 'bg-green-500/20' }
    if (positiveRatio >= 0.5) return { text: 'Mixed', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' }
    return { text: 'Bearish', color: 'text-red-400', bgColor: 'bg-red-500/20' }
  }

  const sentiment = getMarketSentiment()
  const avgChange = indices.reduce((sum: number, index: IndexData) => sum + index.changePercent, 0) / indices.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-400" />
            Market Indices
          </h2>
          <div className="text-sm text-blue-400 mt-1 flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              marketOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span>{marketOpen ? 'Live Market Data' : 'Market Closed'}</span>
            {lastUpdate && (
              <span className="ml-2 text-gray-500">
                • Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <motion.button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${(isRefreshing || isLoading) ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Key Market Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Market Status</div>
          <div className={`text-xl font-bold ${marketOpen ? 'text-green-400' : 'text-red-400'}`}>
            {marketOpen ? 'OPEN' : 'CLOSED'}
          </div>
          <div className="text-sm text-gray-400">US Markets</div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Avg Change</div>
          <div className={`text-xl font-bold ${getChangeColor(avgChange)}`}>
            {formatChange(avgChange, true)}
          </div>
          <div className={`text-sm flex items-center mt-1 ${getChangeColor(avgChange)}`}>
            {avgChange >= 0 ? 
              <TrendingUp className="h-3 w-3 mr-1" /> : 
              <TrendingDown className="h-3 w-3 mr-1" />
            }
            Today
          </div>
        </div>

        <div className={`bg-slate-700/30 p-4 rounded-lg ${sentiment.bgColor} border border-opacity-20`}>
          <div className="text-gray-400 text-sm mb-1">Sentiment</div>
          <div className={`text-xl font-bold ${sentiment.color}`}>
            {sentiment.text}
          </div>
          <div className="text-sm text-gray-400">Overall</div>
        </div>
      </div>

      {/* Indices Grid */}
      <div className="space-y-3">
        {indices.map((index: IndexData, i: number) => (
          <motion.div
            key={index.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`border rounded-lg p-4 transition-all hover:bg-slate-700/20 ${getChangeBgColor(index.change)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{index.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{index.symbol}</span>
                      <span>•</span>
                      <span>{index.description}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Price */}
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    ${formatPrice(index.price)}
                  </div>
                  <div className={`text-sm ${getChangeColor(index.change)}`}>
                    {formatChange(index.change)} ({formatChange(index.changePercent, true)})
                  </div>
                </div>
                
                {/* Action Button */}
                <button
                  onClick={() => handleAnalyze(index.symbol)}
                  className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Analyze</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
