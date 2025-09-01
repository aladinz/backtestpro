'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, RefreshCw, Eye } from 'lucide-react'
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
interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export default function LiveMarkets() {
  const router = useRouter()
  const [stocks, setStocks] = useState<StockData[]>([])
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
  const convertApiDataToStocks = (data: MarketDataResponse): StockData[] => {
    const apiStocks = data.data.stocks
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: apiStocks['Apple (AAPL)']?.price || 224.85,
        change: apiStocks['Apple (AAPL)']?.change || -1.23,
        changePercent: apiStocks['Apple (AAPL)']?.changePercent || -0.54
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: apiStocks['Microsoft (MSFT)']?.price || 418.92,
        change: apiStocks['Microsoft (MSFT)']?.change || 3.45,
        changePercent: apiStocks['Microsoft (MSFT)']?.changePercent || 0.83
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: apiStocks['Alphabet (GOOGL)']?.price || 168.75,
        change: apiStocks['Alphabet (GOOGL)']?.change || -0.89,
        changePercent: apiStocks['Alphabet (GOOGL)']?.changePercent || -0.52
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: apiStocks['Tesla (TSLA)']?.price || 245.80,
        change: apiStocks['Tesla (TSLA)']?.change || -4.67,
        changePercent: apiStocks['Tesla (TSLA)']?.changePercent || -1.87
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        price: apiStocks['NVIDIA (NVDA)']?.price || 467.89,
        change: apiStocks['NVIDIA (NVDA)']?.change || 8.92,
        changePercent: apiStocks['NVIDIA (NVDA)']?.changePercent || 1.94
      }
    ]
  }

  // Fetch live market data
  const fetchStocksData = async () => {
    setIsLoading(true)
    try {
      const marketData = await fetchLiveMarketData()
      const stocksData = convertApiDataToStocks(marketData)
      setStocks(stocksData)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch stocks data:', error)
      // Set fallback data if no data exists
      if (stocks.length === 0) {
        setStocks([
          { symbol: 'AAPL', name: 'Apple Inc.', price: 224.85, change: -1.23, changePercent: -0.54 },
          { symbol: 'MSFT', name: 'Microsoft Corp.', price: 418.92, change: 3.45, changePercent: 0.83 },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 168.75, change: -0.89, changePercent: -0.52 },
          { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.80, change: -4.67, changePercent: -1.87 },
          { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 467.89, change: 8.92, changePercent: 1.94 }
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    setMarketOpen(checkMarketOpen())
    fetchStocksData()

    // Set up intervals
    const marketStatusInterval = setInterval(() => {
      setMarketOpen(checkMarketOpen())
    }, 30000) // Check every 30 seconds

    const dataInterval = setInterval(() => {
      fetchStocksData()
    }, 60000) // Fetch every minute

    return () => {
      clearInterval(marketStatusInterval)
      clearInterval(dataInterval)
    }
  }, [])

  const handleRefresh = async () => {
    await fetchStocksData()
  }

  const handleAnalyze = (symbol: string) => {
    router.push(`/strategy-builder?symbol=${symbol}`)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold flex items-center space-x-2 ${
          marketOpen ? 'text-green-400' : 'text-red-400'
        }`}>
          <Activity className={`h-5 w-5 ${marketOpen ? 'text-green-400' : 'text-red-400'}`} />
          <span>Live Markets</span>
        </h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              marketOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className={`text-sm ${marketOpen ? 'text-green-400' : 'text-red-400'}`}>
              {marketOpen ? 'Open' : 'Closed'}
            </span>
            {lastUpdate && (
              <span className="text-xs text-gray-500">
                {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {stocks.map((stock: StockData, index: number) => (
          <motion.div 
            key={stock.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-4 transition-all hover:bg-slate-700/20 ${getChangeBgColor(stock.change)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold text-white text-lg">{stock.symbol}</span>
                  {stock.changePercent > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <div className="text-sm text-gray-400">{stock.name}</div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Price */}
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    ${formatPrice(stock.price)}
                  </div>
                  <div className={`text-sm ${getChangeColor(stock.change)}`}>
                    {formatChange(stock.change)} ({formatChange(stock.changePercent, true)})
                  </div>
                </div>
                
                {/* Action Button */}
                <button
                  onClick={() => handleAnalyze(stock.symbol)}
                  className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Trade</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
