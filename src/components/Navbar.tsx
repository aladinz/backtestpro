'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { fetchRealMarketData, getTickerStocks, checkMarketOpen, clearMarketDataCache, MarketData } from '@/services/marketDataService'

export default function Navbar() {
  const [stockData, setStockData] = useState<MarketData[]>([])
  const [marketOpen, setMarketOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [isClient, setIsClient] = useState(false)
  
  // Check if market is open (same logic as other components)
  const isMarketOpen = () => {
    const now = new Date()
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
    const day = easternTime.getDay()
    const hour = easternTime.getHours()
    const minute = easternTime.getMinutes()
    const currentTime = hour * 60 + minute
    
    if (day === 0 || day === 6) return false
    
    const marketOpen = 9 * 60 + 30  // 9:30 AM
    const marketClose = 16 * 60     // 4:00 PM
    
    return currentTime >= marketOpen && currentTime < marketClose
  }
  
  // Handle hydration and start dynamic updates
  useEffect(() => {
    setIsClient(true)
    
    // Set initial time
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }))
    }
    
    updateTime()
    
    // Initial fetch
    setMarketOpen(checkMarketOpen())
    fetchData()
    
    // Update time every second
    const timeInterval = setInterval(updateTime, 1000)
    
    // Update market status every 30 seconds
    const marketStatusInterval = setInterval(() => {
      setMarketOpen(checkMarketOpen())
    }, 30000)
    
    // Update stock data every 2 minutes for ticker
    const dataInterval = setInterval(() => {
      fetchData()
    }, 120000)
    
    return () => {
      clearInterval(timeInterval)
      clearInterval(marketStatusInterval)
      clearInterval(dataInterval)
    }
  }, [])

  const fetchData = async () => {
    try {
      const symbols = getTickerStocks().map(s => s.symbol)
      const data = await fetchRealMarketData(symbols)
      setStockData(data)
    } catch (error) {
      console.error('Failed to fetch ticker data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700"
    >
      {/* Top Navigation Line */}
      <div className="border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">BacktestPro</span>
                <span className="bg-green-500 text-xs px-2 py-1 rounded-full text-black font-medium">
                  Live
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/strategy-builder" className="text-gray-300 hover:text-white transition-colors font-medium">
                Strategy Builder
              </Link>
              <Link href="/portfolio-optimization" className="text-gray-300 hover:text-white transition-colors font-medium">
                Portfolio Optimizer
              </Link>
              <Link href="/sector-rotation" className="text-gray-300 hover:text-white transition-colors font-medium">
                Sector Rotation
              </Link>
              <Link href="/portfolio-library" className="text-gray-300 hover:text-white transition-colors font-medium">
                Portfolio Library
              </Link>
              <Link href="/portfolio-tracker" className="text-gray-300 hover:text-white transition-colors font-medium">
                Portfolio Tracker
              </Link>
              <Link href="/relative-strength" className="text-gray-300 hover:text-white transition-colors font-medium">
                RS Scanner
              </Link>
              <Link href="/swing-screener" className="text-gray-300 hover:text-white transition-colors font-medium">
                Swing Screener
              </Link>
              <Link href="/risk-management" className="text-gray-300 hover:text-white transition-colors font-medium">
                Risk Management
              </Link>
              <Link href="/market-breadth" className="text-gray-300 hover:text-white transition-colors font-medium">
                Market Breadth
              </Link>
              <Link href="/ai-insights" className="text-gray-300 hover:text-white transition-colors font-medium">
                AI Insights
              </Link>
              <Link href="/results" className="text-gray-300 hover:text-white transition-colors font-medium">
                Results
              </Link>
              <Link href="/library" className="text-gray-300 hover:text-white transition-colors font-medium">
                Library
              </Link>
              <Link href="/features" className="text-gray-300 hover:text-white transition-colors font-medium">
                Features
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stock Ticker Line */}
      <div className="bg-slate-900/50 overflow-hidden">
        <div className="relative">
          {/* Market Status Indicator */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-slate-800/90 px-3 py-1 rounded-full">
            <div className="flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${
                isMarketOpen() ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${isMarketOpen() ? 'text-green-400' : 'text-red-400'}`}>
                {isMarketOpen() ? 'LIVE' : 'CLOSED'}
              </span>
              <span className="text-gray-400">
                {isClient ? currentTime : '--:-- --'}
              </span>
            </div>
          </div>
          
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{ 
              duration: 80, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className="flex items-center space-x-8 py-2 whitespace-nowrap pl-32"
          >
            {/* Display more stocks with seamless scrolling */}
            {[...stockData, ...stockData].map((stock, index) => (
              <div key={`${stock.symbol}-${index}`} className="flex items-center space-x-2 text-sm hover:bg-slate-800/50 px-2 py-1 rounded transition-colors">
                <span className="font-semibold text-white">{stock.symbol}</span>
                <span className="text-gray-300">${stock.price}</span>
                <span className={`font-medium ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
                {index < (stockData.length * 2 - 1) && (
                  <span className="text-slate-600 mx-2">•</span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
