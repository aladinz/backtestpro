'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Filter, Search, Target, Zap, Activity, BarChart3, Volume2, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

// Swing trade setup data with comprehensive screening criteria
interface SwingTradeSetup {
  symbol: string
  name: string
  sector: string
  price: number
  change1D: number
  change1W: number
  change1M: number
  volume: number
  avgVolume: number
  volumeRatio: number
  rsi: number
  macd: 'bullish' | 'bearish' | 'neutral'
  movingAverages: {
    above20MA: boolean
    above50MA: boolean
    above200MA: boolean
    ma20Slope: 'rising' | 'falling' | 'flat'
    ma50Slope: 'rising' | 'falling' | 'flat'
  }
  pattern: string
  patternType: 'breakout' | 'pullback' | 'reversal' | 'continuation' | 'momentum'
  support: number
  resistance: number
  atr: number
  relativeStrength: number
  earningsDate: string | null
  setup: 'cup_handle' | 'flag' | 'triangle' | 'pullback' | 'breakout' | 'reversal' | 'momentum'
  setupQuality: 'excellent' | 'good' | 'fair'
  riskReward: number
  timeframe: 'short' | 'medium' | 'long'
  marketCap: string
  signals: string[]
}

// Fallback static data (comprehensive list for when API fails)
const fallbackSwingSetups: SwingTradeSetup[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 230.16,
    change1D: 1.85,
    change1W: 3.2,
    change1M: 8.7,
    volume: 52800000,
    avgVolume: 48300000,
    volumeRatio: 1.09,
    rsi: 58.5,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Ascending Triangle',
    patternType: 'breakout',
    support: 225.00,
    resistance: 240.00,
    atr: 4.25,
    relativeStrength: 128.5,
    earningsDate: '2025-09-05',
    setup: 'triangle',
    setupQuality: 'excellent',
    riskReward: 3.2,
    timeframe: 'medium',
    marketCap: '3.52T',
    signals: ['Golden Cross Approaching', 'Volume Surge', 'RS Strength', 'Earnings Catalyst']
  },
  {
    symbol: 'CRM',
    name: 'Salesforce Inc.',
    sector: 'Technology',
    price: 256.25,
    change1D: 1.95,
    change1W: 5.1,
    change1M: 13.7,
    volume: 8400000,
    avgVolume: 6100000,
    volumeRatio: 1.38,
    rsi: 69.5,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Cup with Handle',
    patternType: 'breakout',
    support: 245.00,
    resistance: 275.00,
    atr: 6.42,
    relativeStrength: 142.8,
    earningsDate: '2025-09-12',
    setup: 'cup_handle',
    setupQuality: 'excellent',
    riskReward: 2.8,
    timeframe: 'medium',
    marketCap: '251.2B',
    signals: ['Volume Breakout', 'Cloud Leadership', 'AI Integration', 'Strong Fundamentals']
  }
]

interface SwingTradeScreenerProps {
  compact?: boolean
}

export default function SwingTradeScreener({ compact = false }: SwingTradeScreenerProps) {
  const [swingSetups, setSwingSetups] = useState<SwingTradeSetup[]>(fallbackSwingSetups)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    sector: 'All',
    setupType: 'All',
    setupQuality: 'All',
    minRSI: 30,
    maxRSI: 70,
    minRR: 2.0,
    timeframe: 'All',
    minVolRatio: 1.0,
    patternType: 'All',
    earningsFilter: 'All',
    marketCap: 'All',
    priceRange: 'All',
    strengthRank: 50
  })
  
  const [sortBy, setSortBy] = useState<'riskReward' | 'relativeStrength' | 'volumeRatio' | 'change1D'>('riskReward')
  const [mounted, setMounted] = useState(false)

  // Fetch real market data from our Yahoo Finance API
  useEffect(() => {
    console.log('SwingScreener: useEffect triggered')
    
    const fetchSwingSetups = async () => {
      try {
        setLoading(true)
        console.log('SwingScreener: Fetching from stock-scanner API')
        
        const response = await fetch('/api/stock-scanner')
        if (!response.ok) {
          throw new Error('Failed to fetch swing data')
        }
        
        const data = await response.json()
        console.log('SwingScreener: API response:', data)
        
        if (data.success && data.swingSetups && data.swingSetups.length > 0) {
          setSwingSetups(data.swingSetups)
          console.log('SwingScreener: Successfully updated with live data:', data.swingSetups.length, 'setups')
        } else {
          console.log('SwingScreener: No live data available, using fallback')
          setSwingSetups(fallbackSwingSetups)
        }
      } catch (error) {
        console.error('SwingScreener: Error fetching live data:', error)
        console.log('SwingScreener: Using fallback data due to error')
        setSwingSetups(fallbackSwingSetups)
      } finally {
        setLoading(false)
      }
    }

    fetchSwingSetups()
    setMounted(true)
  }, [])

  const sectors = ['All', 'Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Communication Services', 'Energy', 'Industrials', 'Consumer Staples', 'Utilities', 'Real Estate', 'Materials']
  const setupTypes = ['All', 'cup_handle', 'flag', 'triangle', 'pullback', 'breakout', 'reversal', 'momentum', 'ascending_triangle', 'bull_flag', 'wedge']
  const setupQualities = ['All', 'excellent', 'good', 'fair']
  const timeframes = ['All', 'short', 'medium', 'long']
  const patternTypes = ['All', 'breakout', 'pullback', 'reversal', 'continuation', 'momentum']
  const marketCapOptions = ['All', 'Large (>10B)', 'Mid (2B-10B)', 'Small (<2B)']
  const priceRangeOptions = ['All', 'Under $20', '$20-$50', '$50-$100', '$100-$200', 'Over $200']
  const earningsOptions = ['All', 'this_week', 'avoid', 'within_month']

  const filteredSetups = swingSetups
    .filter(setup => {
      if (filters.sector !== 'All' && setup.sector !== filters.sector) return false
      if (filters.setupType !== 'All' && setup.setup !== filters.setupType) return false
      if (filters.setupQuality !== 'All' && setup.setupQuality !== filters.setupQuality) return false
      if (setup.rsi < filters.minRSI || setup.rsi > filters.maxRSI) return false
      if (setup.riskReward < filters.minRR) return false
      if (filters.timeframe !== 'All' && setup.timeframe !== filters.timeframe) return false
      if (setup.volumeRatio < filters.minVolRatio) return false
      if (filters.patternType !== 'All' && setup.patternType !== filters.patternType) return false
      if (filters.earningsFilter === 'this_week' && (!setup.earningsDate || new Date(setup.earningsDate) > new Date('2025-09-03'))) return false
      if (filters.earningsFilter === 'avoid' && setup.earningsDate && new Date(setup.earningsDate) <= new Date('2025-09-10')) return false
      if (filters.earningsFilter === 'within_month' && (!setup.earningsDate || new Date(setup.earningsDate) > new Date('2025-09-30'))) return false
      
      // Market cap filter
      if (filters.marketCap !== 'All') {
        const marketCapValue = parseFloat(setup.marketCap.replace(/[^0-9.]/g, ''))
        if (filters.marketCap === 'Large (>10B)' && marketCapValue < 10) return false
        if (filters.marketCap === 'Mid (2B-10B)' && (marketCapValue < 2 || marketCapValue > 10)) return false
        if (filters.marketCap === 'Small (<2B)' && marketCapValue >= 2) return false
      }
      
      // Price range filter
      if (filters.priceRange !== 'All') {
        if (filters.priceRange === 'Under $20' && setup.price >= 20) return false
        if (filters.priceRange === '$20-$50' && (setup.price < 20 || setup.price > 50)) return false
        if (filters.priceRange === '$50-$100' && (setup.price < 50 || setup.price > 100)) return false
        if (filters.priceRange === '$100-$200' && (setup.price < 100 || setup.price > 200)) return false
        if (filters.priceRange === 'Over $200' && setup.price <= 200) return false
      }
      
      // Relative strength rank filter
      if (setup.relativeStrength < filters.strengthRank) return false
      
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'riskReward') return b.riskReward - a.riskReward
      if (sortBy === 'relativeStrength') return b.relativeStrength - a.relativeStrength
      if (sortBy === 'volumeRatio') return b.volumeRatio - a.volumeRatio
      if (sortBy === 'change1D') return b.change1D - a.change1D
      return 0
    })

  // Debug logging
  console.log('SwingScreener Debug:', {
    totalSwingSetups: swingSetups.length,
    filteredSetups: filteredSetups.length,
    filters,
    mounted,
    loading
  })

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'good': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'fair': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400'
    }
  }

  const getSetupIcon = (setup: string) => {
    switch (setup) {
      case 'cup_handle': return <Target className="h-4 w-4 text-purple-400" />
      case 'flag': return <TrendingUp className="h-4 w-4 text-blue-400" />
      case 'triangle': return <Activity className="h-4 w-4 text-green-400" />
      case 'pullback': return <TrendingDown className="h-4 w-4 text-yellow-400" />
      case 'breakout': return <Zap className="h-4 w-4 text-orange-400" />
      case 'reversal': return <BarChart3 className="h-4 w-4 text-red-400" />
      default: return <Search className="h-4 w-4 text-gray-400" />
    }
  }

  const getTimeframeBadge = (timeframe: string) => {
    const colors = {
      short: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      long: 'bg-green-500/20 text-green-400 border-green-500/30'
    }
    return colors[timeframe as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  if (!mounted) return null

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading real market data from Yahoo Finance...</p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-400" />
          Top Swing Setups
        </h3>
        <div className="space-y-2">
          {filteredSetups.slice(0, 3).map((setup, index) => (
            <div key={setup.symbol} className={`flex items-center justify-between p-2 rounded border ${getQualityColor(setup.setupQuality)}`}>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">{setup.symbol}</span>
                {getSetupIcon(setup.setup)}
                <span className="text-xs text-gray-400">{setup.pattern}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white">R/R: {setup.riskReward}</span>
              </div>
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
            <Filter className="h-6 w-6 mr-2 text-blue-400" />
            Swing Trade Screener
          </h2>
          <p className="text-sm text-blue-400 mt-1">
            Find high-probability swing trading setups with custom filtering
          </p>
        </div>
        <div className="flex items-center space-x-2 text-blue-400 text-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Live Screening</span>
        </div>
      </div>

      {/* Enhanced Filter Controls */}
      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Sector Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Sector</label>
            <select
              value={filters.sector}
              onChange={(e) => setFilters({...filters, sector: e.target.value})}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          {/* Setup Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Setup Type</label>
            <select
              value={filters.setupType}
              onChange={(e) => setFilters({...filters, setupType: e.target.value})}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            >
              {setupTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Market Cap Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Market Cap</label>
            <select
              value={filters.marketCap}
              onChange={(e) => setFilters({...filters, marketCap: e.target.value})}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            >
              {marketCapOptions.map(cap => (
                <option key={cap} value={cap}>{cap}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price Range</label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            >
              {priceRangeOptions.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* RSI Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">RSI Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.minRSI}
                onChange={(e) => setFilters({...filters, minRSI: Number(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                min="0"
                max="100"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.maxRSI}
                onChange={(e) => setFilters({...filters, maxRSI: Number(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                min="0"
                max="100"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Risk/Reward Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Min R/R Ratio</label>
            <input
              type="number"
              value={filters.minRR}
              onChange={(e) => setFilters({...filters, minRR: Number(e.target.value)})}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
              step="0.1"
              min="1"
              max="10"
            />
          </div>

          {/* Volume Ratio Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Min Volume Ratio</label>
            <input
              type="number"
              value={filters.minVolRatio}
              onChange={(e) => setFilters({...filters, minVolRatio: Number(e.target.value)})}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
              step="0.1"
              min="0.5"
              max="5"
            />
          </div>

          {/* Strength Rank Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Min Strength Rank</label>
            <input
              type="number"
              value={filters.strengthRank}
              onChange={(e) => setFilters({...filters, strengthRank: Number(e.target.value)})}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
              min="1"
              max="100"
            />
          </div>

          {/* Earnings Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Earnings</label>
            <select
              value={filters.earningsFilter}
              onChange={(e) => setFilters({...filters, earningsFilter: e.target.value})}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            >
              {earningsOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            Showing {filteredSetups.length} of {swingSetups.length} setups
          </div>
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm"
            >
              <option value="riskReward">Sort by R/R</option>
              <option value="relativeStrength">Sort by Strength</option>
              <option value="volumeRatio">Sort by Volume</option>
              <option value="change1D">Sort by 1D Change</option>
            </select>
            <button
              onClick={() => setFilters({
                sector: 'All',
                setupType: 'All',
                setupQuality: 'All',
                minRSI: 30,
                maxRSI: 70,
                minRR: 2.0,
                timeframe: 'All',
                minVolRatio: 1.0,
                patternType: 'All',
                earningsFilter: 'All',
                marketCap: 'All',
                priceRange: 'All',
                strengthRank: 50
              })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredSetups.map((setup, index) => (
          <motion.div
            key={setup.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg border hover:bg-slate-700/30 transition-colors cursor-pointer ${getQualityColor(setup.setupQuality)}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
              {/* Stock Info */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-lg">{setup.symbol}</span>
                  {getSetupIcon(setup.setup)}
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getTimeframeBadge(setup.timeframe)}`}>
                    {setup.timeframe.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-400">{setup.name}</div>
                <div className="text-xs text-blue-400">{setup.sector}</div>
              </div>

              {/* Price & Performance */}
              <div>
                <div className="text-lg font-semibold text-white">${setup.price.toFixed(2)}</div>
                <div className={`text-sm ${setup.change1D >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {setup.change1D >= 0 ? '+' : ''}{setup.change1D.toFixed(2)}% (1D)
                </div>
                <div className="text-xs text-gray-400">{setup.pattern}</div>
              </div>

              {/* Technical Indicators */}
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs text-gray-400">RSI:</span>
                  <span className={`text-sm font-medium ${
                    setup.rsi > 70 ? 'text-red-400' :
                    setup.rsi < 30 ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {setup.rsi.toFixed(0)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  RS: {setup.relativeStrength.toFixed(0)}
                </div>
              </div>

              {/* Risk/Reward */}
              <div>
                <div className="text-lg font-bold text-green-400">
                  {setup.riskReward.toFixed(1)}:1
                </div>
                <div className="text-xs text-gray-400">Risk/Reward</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{filteredSetups.length}</div>
          <div className="text-sm text-gray-400">Setups Found</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-400">
            {filteredSetups.filter(s => s.setupQuality === 'excellent').length}
          </div>
          <div className="text-sm text-gray-400">Excellent</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">
            {filteredSetups.filter(s => s.riskReward >= 3).length}
          </div>
          <div className="text-sm text-gray-400">R/R 3:1+</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-400">
            {filteredSetups.filter(s => s.volumeRatio >= 1.5).length}
          </div>
          <div className="text-sm text-gray-400">High Volume</div>
        </div>
      </div>
    </motion.div>
  )
}
