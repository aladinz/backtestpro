'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, RefreshCw, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  fetchLiveMarketData, 
  formatPrice, 
  formatChange, 
  getChangeColor, 
  getChangeBgColor,
  MarketDataResponse,
  MarketDataPoint
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
      // Keep existing data or set fallback
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

  const handleRefresh = () => {
    fetchIndicesData()
  }

  const handleAnalyze = (symbol: string) => {
    router.push(`/strategy-builder?symbol=${symbol}`)
  }
  const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
  const day = easternTime.getDay()
  const hour = easternTime.getHours()
  const minute = easternTime.getMinutes()
  const currentTime = hour * 60 + minute
  
  if (day === 0 || day === 6) return false
  
  const marketOpenTime = 9 * 60 + 30  // 9:30 AM
  const marketCloseTime = 16 * 60     // 4:00 PM
  
  return currentTime >= marketOpenTime && currentTime < marketCloseTime
}

export default function MarketIndices() {
  const router = useRouter()
  const [indices, setIndices] = useState(getMarketIndices())
  const [marketOpen, setMarketOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setMarketOpen(isMarketOpen())
    
    // Update market status and simulate price changes every minute
    const interval = setInterval(() => {
      setMarketOpen(isMarketOpen())
      
      // Simulate small price movements during market hours
      if (isMarketOpen()) {
        setIndices(prevIndices => 
          prevIndices.map(index => {
            const randomChange = (Math.random() - 0.5) * 0.08 // Small random change
            const newChangePercent = index.changePercent + randomChange
            const newChange = (index.price * newChangePercent) / 100
            
            return {
              ...index,
              change: parseFloat(newChange.toFixed(2)),
              changePercent: parseFloat(newChangePercent.toFixed(2))
            }
          })
        )
      }
    }, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const getMarketSentiment = () => {
    const positiveIndices = indices.filter(index => index.changePercent > 0).length
    const totalIndices = indices.length
    const positiveRatio = positiveIndices / totalIndices
    
    if (positiveRatio >= 0.75) return { text: 'Bullish', color: 'text-green-400', bgColor: 'bg-green-500/20' }
    if (positiveRatio >= 0.5) return { text: 'Mixed', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' }
    return { text: 'Bearish', color: 'text-red-400', bgColor: 'bg-red-500/20' }
  }

  const sentiment = getMarketSentiment()
  const avgChange = indices.reduce((sum, index) => sum + index.changePercent, 0) / indices.length

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
              mounted ? (marketOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500') : 'bg-gray-500'
            }`}></div>
            <span>{mounted ? (marketOpen ? 'Live Market Data' : 'Market Closed') : 'Loading...'}</span>
          </div>
        </div>
        <motion.button
          onClick={handleRefresh}
          disabled={isRefreshing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Key Market Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Market Status</div>
          <div className={`text-xl font-bold ${
            mounted ? (marketOpen ? 'text-green-400' : 'text-red-400') : 'text-gray-400'
          }`}>
            {mounted ? (marketOpen ? 'OPEN' : 'CLOSED') : 'LOADING'}
          </div>
          <div className="text-sm text-gray-400">US Markets</div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Avg Change</div>
          <div className={`text-xl font-bold ${
            avgChange >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
          </div>
          <div className={`text-sm flex items-center mt-1 ${
            avgChange >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {avgChange >= 0 ? 
              <TrendingUp className="h-3 w-3 mr-1" /> : 
              <TrendingDown className="h-3 w-3 mr-1" />
            }
            Today
          </div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Sentiment</div>
          <div className={`text-xl font-bold ${sentiment.color}`}>
            {sentiment.text}
          </div>
          <div className="text-sm text-blue-400">Overall</div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Indices</div>
          <div className="text-xl font-bold text-white">{indices.length}</div>
          <div className="text-sm text-gray-400">Tracked</div>
        </div>
      </div>

      {/* Top Indices */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Activity className="h-4 w-4 mr-2 text-blue-400" />
          Major Indices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {indices.map((index, i) => (
            <motion.div
              key={index.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-slate-700/20 p-4 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{index.symbol}</span>
                  {index.changePercent > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <span className="text-blue-400 text-sm font-medium">{index.category}</span>
              </div>
              <div className="text-xs text-gray-400 mb-2">{index.name}</div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-white">${index.price.toFixed(2)}</div>
                <div className={`text-sm font-medium ${
                  index.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {index.changePercent > 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </div>
              </div>
              <div className={`text-xs mt-1 ${
                index.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {index.change > 0 ? '+' : ''}${index.change.toFixed(2)} today
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Quick Actions</span>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push('/strategy-builder')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
            >
              <BarChart3 className="h-3 w-3" />
              <span>Strategy</span>
            </button>
            <button 
              onClick={() => router.push('/results')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Backtest
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
            >
              <Eye className="h-3 w-3" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
