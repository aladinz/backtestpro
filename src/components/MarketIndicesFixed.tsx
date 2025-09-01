'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, RefreshCw, Eye, Activity } from 'lucide-react'
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
  const [indices, setIndices] = useState<IndexData[]>(() => {
    // Initialize with realistic bearish market data reflecting current down market
    return [
      {
        symbol: '^GSPC',
        name: 'S&P 500',
        price: 5432.18,
        change: -28.45,
        changePercent: -0.52,
        description: 'Large-cap US stocks',
        category: 'US Market'
      },
      {
        symbol: '^IXIC',
        name: 'NASDAQ',
        price: 17234.89,
        change: -142.33,
        changePercent: -0.82,
        description: 'Tech-heavy index',
        category: 'Technology'
      },
      {
        symbol: '^RUT',
        name: 'Russell 2000',
        price: 2156.77,
        change: -18.92,
        changePercent: -0.87,
        description: 'Small-cap US stocks',
        category: 'Small Cap'
      },
      {
        symbol: 'VTI',
        name: 'Total Market',
        price: 267.43,
        change: -2.14,
        changePercent: -0.79,
        description: 'Total US stock market',
        category: 'Broad Market'
      }
    ]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [marketOpen, setMarketOpen] = useState(false)

  const checkMarketOpen = () => {
    const now = new Date()
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
    const day = easternTime.getDay()
    const hour = easternTime.getHours()
    const minute = easternTime.getMinutes()
    const timeInMinutes = hour * 60 + minute
    
    const isWeekday = day >= 1 && day <= 5
    const isMarketHours = timeInMinutes >= 570 && timeInMinutes < 960
    
    return isWeekday && isMarketHours
  }

  const getInitialIndices = (): IndexData[] => [
    {
      symbol: '^GSPC',
      name: 'S&P 500',
      price: 5970.84,
      change: 24.31,
      changePercent: 0.41,
      description: 'Large-cap US stocks',
      category: 'US Market'
    },
    {
      symbol: '^IXIC',
      name: 'NASDAQ',
      price: 19681.75,
      change: 63.18,
      changePercent: 0.32,
      description: 'Tech-heavy index',
      category: 'Technology'
    },
    {
      symbol: '^RUT',
      name: 'Russell 2000',
      price: 2389.17,
      change: -8.45,
      changePercent: -0.35,
      description: 'Small-cap US stocks',
      category: 'Small Cap'
    },
    {
      symbol: 'VTI',
      name: 'Total Market',
      price: 294.58,
      change: 1.22,
      changePercent: 0.42,
      description: 'Total US stock market',
      category: 'Broad Market'
    }
  ]

  const getSymbolFromName = (name: string): string => {
    const symbolMap: { [key: string]: string } = {
      'S&P 500': '^GSPC',
      'NASDAQ': '^IXIC',
      'Russell 2000': '^RUT',
      'Total Market': 'VTI',
      'Dow Jones': '^DJI',
      'VIX': '^VIX'
    }
    
    const cleanName = name.split(' (')[0]
    return symbolMap[cleanName] || name
  }

  const loadMarketData = async (forceRefresh = false) => {
    setIsLoading(true)
    try {
      const data: MarketDataResponse = await fetchLiveMarketData(forceRefresh)
      
      if (data.success && data.data && data.data.indices) {
        const mappedIndices: IndexData[] = Object.entries(data.data.indices).map(([name, marketData]) => {
          const symbol = getSymbolFromName(name)
          return {
            symbol,
            name: name.split(' (')[0],
            price: marketData.price,
            change: marketData.change,
            changePercent: marketData.changePercent,
            description: getIndexDescription(symbol),
            category: getIndexCategory(symbol)
          }
        })
        
        setIndices(mappedIndices)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('MarketIndicesFixed: Error loading market data:', error)
      // Keep existing data if API fails
    } finally {
      setIsLoading(false)
    }
  }

  const getIndexDescription = (symbol: string): string => {
    const descriptions: { [key: string]: string } = {
      '^GSPC': 'Large-cap US stocks',
      '^IXIC': 'Tech-heavy index',
      '^RUT': 'Small-cap US stocks',
      'VTI': 'Total US stock market',
      '^DJI': 'Blue-chip stocks',
      '^VIX': 'Volatility index'
    }
    return descriptions[symbol] || 'Market index'
  }

  const getIndexCategory = (symbol: string): string => {
    const categories: { [key: string]: string } = {
      '^GSPC': 'US Market',
      '^IXIC': 'Technology',
      '^RUT': 'Small Cap',
      'VTI': 'Broad Market',
      '^DJI': 'Blue Chip',
      '^VIX': 'Volatility'
    }
    return categories[symbol] || 'Market'
  }

  useEffect(() => {
    setMarketOpen(checkMarketOpen())
    loadMarketData()
    
    const statusInterval = setInterval(() => {
      setMarketOpen(checkMarketOpen())
    }, 60000)
    
    const dataInterval = setInterval(() => {
      if (checkMarketOpen()) {
        loadMarketData()
      }
    }, 30000)

    return () => {
      clearInterval(statusInterval)
      clearInterval(dataInterval)
    }
  }, [])

  const handleRefresh = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
    }
    // Normal refresh (will use cached data if available for 30 minutes)
    loadMarketData(false)
  }

  const handleForceRefresh = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
    }
    // Force refresh with new data
    loadMarketData(true)
  }

  const handleAnalyze = (symbol: string) => {
    router.push(`/strategy-builder?symbol=${symbol}`)
  }

  const getMarketSentiment = () => {
    if (indices.length === 0) return { sentiment: 'neutral', description: 'No data available' }
    
    const positiveIndices = indices.filter((index: IndexData) => index.changePercent > 0).length
    const negativeIndices = indices.filter((index: IndexData) => index.changePercent < 0).length
    
    if (positiveIndices > negativeIndices) {
      return { sentiment: 'bullish', description: 'Markets trending upward' }
    } else if (negativeIndices > positiveIndices) {
      return { sentiment: 'bearish', description: 'Markets under pressure' }
    } else {
      return { sentiment: 'neutral', description: 'Mixed market signals' }
    }
  }

  const avgChange = indices.length > 0 
    ? indices.reduce((sum: number, index: IndexData) => sum + index.changePercent, 0) / indices.length 
    : 0

  const sentiment = getMarketSentiment()

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Market Indices</h2>
            <p className="text-sm text-slate-400">
              {marketOpen ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Market Open
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  Market Closed
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            {/* Dropdown for refresh options */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-2">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
                  Normal Refresh
                  <div className="text-xs text-gray-500 mt-1">Uses cached data (faster)</div>
                </button>
                <button
                  onClick={handleForceRefresh}
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
                  Force New Data
                  <div className="text-xs text-gray-500 mt-1">Generates fresh values</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Market Sentiment</span>
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className={`text-lg font-bold ${
              sentiment.sentiment === 'bullish' ? 'text-green-400' :
              sentiment.sentiment === 'bearish' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {sentiment.sentiment.charAt(0).toUpperCase() + sentiment.sentiment.slice(1)}
            </span>
            <p className="text-xs text-slate-500 mt-1">{sentiment.description}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Average Change</span>
            {avgChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="mt-2">
            <span className={`text-lg font-bold ${getChangeColor(avgChange)}`}>
              {formatChange(avgChange)}%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Last Update</span>
            <RefreshCw className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-slate-300">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Loading...'}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {indices.map((index: IndexData, i: number) => (
          <motion.div
            key={index.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{index.name}</h3>
                <p className="text-xs text-slate-400">{index.symbol}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{formatPrice(index.price)}</div>
                <div className={`text-sm font-medium flex items-center justify-end ${getChangeColor(index.changePercent)}`}>
                  {index.changePercent >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {formatChange(index.changePercent)}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{index.description}</p>
                <span className="inline-block px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded mt-1">
                  {index.category}
                </span>
              </div>
              
              <button
                onClick={() => handleAnalyze(index.symbol)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 rounded text-blue-400 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Analyze
              </button>
            </div>
            
            <div className={`mt-3 h-1 rounded-full ${getChangeBgColor(index.changePercent)}`}></div>
          </motion.div>
        ))}
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-400 mr-2" />
          <span className="text-slate-400 text-sm">Updating market data...</span>
        </div>
      )}
    </div>
  )
}
