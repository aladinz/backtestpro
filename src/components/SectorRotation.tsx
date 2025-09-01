'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, Activity, RefreshCw, Target } from 'lucide-react'
import { useState, useEffect } from 'react'

// Major market sectors with their ETF symbols and performance data
interface SectorData {
  name: string
  symbol: string
  price: number
  change1D: number
  change1W: number
  change1M: number
  change3M: number
  change1Y: number
  volume: string
  marketCap: string
  trend: 'bullish' | 'bearish' | 'neutral'
  strength: 'strong' | 'weak' | 'moderate'
}

const sectorData: SectorData[] = [
  {
    name: 'Technology',
    symbol: 'XLK',
    price: 218.45,
    change1D: 1.85,
    change1W: 3.2,
    change1M: 8.7,
    change3M: 15.4,
    change1Y: 28.9,
    volume: '125M',
    marketCap: '58B',
    trend: 'bullish',
    strength: 'strong'
  },
  {
    name: 'Healthcare',
    symbol: 'XLV',
    price: 142.67,
    change1D: 0.45,
    change1W: 1.1,
    change1M: 2.8,
    change3M: 5.2,
    change1Y: 12.3,
    volume: '78M',
    marketCap: '32B',
    trend: 'bullish',
    strength: 'moderate'
  },
  {
    name: 'Financials',
    symbol: 'XLF',
    price: 44.23,
    change1D: -0.32,
    change1W: -1.4,
    change1M: 1.2,
    change3M: 8.9,
    change1Y: 18.7,
    volume: '156M',
    marketCap: '28B',
    trend: 'neutral',
    strength: 'moderate'
  },
  {
    name: 'Energy',
    symbol: 'XLE',
    price: 92.18,
    change1D: -1.23,
    change1W: -2.8,
    change1M: -5.4,
    change3M: 2.1,
    change1Y: 15.6,
    volume: '198M',
    marketCap: '24B',
    trend: 'bearish',
    strength: 'weak'
  },
  {
    name: 'Consumer Discretionary',
    symbol: 'XLY',
    price: 196.89,
    change1D: 0.78,
    change1W: 2.3,
    change1M: 6.1,
    change3M: 12.8,
    change1Y: 22.4,
    volume: '89M',
    marketCap: '19B',
    trend: 'bullish',
    strength: 'strong'
  },
  {
    name: 'Industrials',
    symbol: 'XLI',
    price: 133.45,
    change1D: 0.34,
    change1W: 1.7,
    change1M: 4.2,
    change3M: 9.6,
    change1Y: 16.8,
    volume: '67M',
    marketCap: '16B',
    trend: 'bullish',
    strength: 'moderate'
  },
  {
    name: 'Communication Services',
    symbol: 'XLC',
    price: 78.92,
    change1D: 1.12,
    change1W: 2.8,
    change1M: 7.3,
    change3M: 13.1,
    change1Y: 25.7,
    volume: '112M',
    marketCap: '22B',
    trend: 'bullish',
    strength: 'strong'
  },
  {
    name: 'Consumer Staples',
    symbol: 'XLP',
    price: 79.34,
    change1D: -0.15,
    change1W: 0.2,
    change1M: 1.8,
    change3M: 3.4,
    change1Y: 8.9,
    volume: '45M',
    marketCap: '14B',
    trend: 'neutral',
    strength: 'weak'
  },
  {
    name: 'Materials',
    symbol: 'XLB',
    price: 95.67,
    change1D: -0.67,
    change1W: -1.2,
    change1M: 2.1,
    change3M: 6.8,
    change1Y: 11.4,
    volume: '73M',
    marketCap: '12B',
    trend: 'neutral',
    strength: 'moderate'
  },
  {
    name: 'Utilities',
    symbol: 'XLU',
    price: 68.23,
    change1D: -0.23,
    change1W: -0.8,
    change1M: 0.4,
    change3M: 2.1,
    change1Y: 6.7,
    volume: '34M',
    marketCap: '18B',
    trend: 'neutral',
    strength: 'weak'
  },
  {
    name: 'Real Estate',
    symbol: 'XLRE',
    price: 45.89,
    change1D: 0.12,
    change1W: 0.7,
    change1M: 3.2,
    change3M: 7.8,
    change1Y: 14.2,
    volume: '28M',
    marketCap: '8B',
    trend: 'bullish',
    strength: 'moderate'
  }
]

interface SectorRotationProps {
  timeframe?: '1D' | '1W' | '1M' | '3M' | '1Y'
  compact?: boolean
}

export default function SectorRotation({ timeframe = '1M', compact = false }: SectorRotationProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const getPerformanceByTimeframe = (sector: SectorData) => {
    switch (selectedTimeframe) {
      case '1D': return sector.change1D
      case '1W': return sector.change1W
      case '1M': return sector.change1M
      case '3M': return sector.change3M
      case '1Y': return sector.change1Y
      default: return sector.change1M
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance > 5) return 'bg-green-500'
    if (performance > 2) return 'bg-green-400'
    if (performance > 0) return 'bg-green-300'
    if (performance > -2) return 'bg-red-300'
    if (performance > -5) return 'bg-red-400'
    return 'bg-red-500'
  }

  const getTextColor = (performance: number) => {
    if (performance > 0) return 'text-green-400'
    return 'text-red-400'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-400" />
      default: return <Activity className="h-4 w-4 text-yellow-400" />
    }
  }

  const sortedSectors = [...sectorData].sort((a, b) => 
    getPerformanceByTimeframe(b) - getPerformanceByTimeframe(a)
  )

  if (!mounted) return null

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-400" />
          Sector Leaders ({selectedTimeframe})
        </h3>
        <div className="space-y-2">
          {sortedSectors.slice(0, 5).map((sector, index) => (
            <div key={sector.symbol} className="flex items-center justify-between p-2 rounded bg-slate-700/30">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white">#{index + 1}</span>
                <span className="text-sm text-gray-300">{sector.name}</span>
              </div>
              <span className={`text-sm font-medium ${getTextColor(getPerformanceByTimeframe(sector))}`}>
                {getPerformanceByTimeframe(sector) > 0 ? '+' : ''}{getPerformanceByTimeframe(sector).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Target className="h-6 w-6 mr-2 text-blue-400" />
            Sector Rotation Dashboard
          </h2>
          <p className="text-sm text-blue-400 mt-1">
            Track sector performance for swing trading opportunities
          </p>
        </div>
        <motion.button
          onClick={handleRefresh}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-gray-400 text-sm">Timeframe:</span>
        {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setSelectedTimeframe(tf)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              selectedTimeframe === tf
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Sector Performance Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {sortedSectors.map((sector, index) => {
          const performance = getPerformanceByTimeframe(sector)
          return (
            <motion.div
              key={sector.symbol}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{sector.symbol}</span>
                  {getTrendIcon(sector.trend)}
                </div>
                <div className={`w-3 h-3 rounded-full ${getPerformanceColor(performance)}`}></div>
              </div>
              
              <div className="text-xs text-gray-400 mb-1">{sector.name}</div>
              <div className="text-lg font-semibold text-white mb-1">${sector.price.toFixed(2)}</div>
              
              <div className={`text-sm font-medium ${getTextColor(performance)}`}>
                {performance > 0 ? '+' : ''}{performance.toFixed(1)}% ({selectedTimeframe})
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Vol: {sector.volume}</span>
                <span className={`capitalize ${
                  sector.strength === 'strong' ? 'text-green-400' :
                  sector.strength === 'weak' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {sector.strength}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/20 p-4 rounded-lg border border-slate-600">
          <h4 className="text-white font-medium mb-2">Top Performer</h4>
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-bold">{sortedSectors[0].name}</span>
            <span className="text-green-400 text-sm">
              +{getPerformanceByTimeframe(sortedSectors[0]).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700/20 p-4 rounded-lg border border-slate-600">
          <h4 className="text-white font-medium mb-2">Worst Performer</h4>
          <div className="flex items-center justify-between">
            <span className="text-red-400 font-bold">{sortedSectors[sortedSectors.length - 1].name}</span>
            <span className="text-red-400 text-sm">
              {getPerformanceByTimeframe(sortedSectors[sortedSectors.length - 1]).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700/20 p-4 rounded-lg border border-slate-600">
          <h4 className="text-white font-medium mb-2">Rotation Signal</h4>
          <div className="text-blue-400 font-medium">
            {sortedSectors[0].trend === 'bullish' ? 'Risk On' : 'Risk Off'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Based on sector leadership
          </div>
        </div>
      </div>
    </motion.div>
  )
}
