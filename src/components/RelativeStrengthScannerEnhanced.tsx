'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Search, Filter, Star, Target, Zap, Activity, AlertTriangle, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

interface RelativeStrengthStock {
  symbol: string
  name: string
  price: number
  change1D: number
  changePercent1D: number
  relativeStrength: number
  relativeStrengthRank: number
  sector: string
  volume: number
  marketCap: number
  momentum: 'strong' | 'moderate' | 'weak'
  signals: string[]
}

interface RelativeStrengthData {
  benchmark: {
    symbol: string
    price: number
    changePercent: number
  }
  allStocks: RelativeStrengthStock[]
  strongPerformers: RelativeStrengthStock[]
  moderatePerformers: RelativeStrengthStock[]
  underperformers: RelativeStrengthStock[]
  summary: {
    totalStocks: number
    strongCount: number
    moderateCount: number
    weakCount: number
  }
  timestamp: string
}

export default function RelativeStrengthScannerEnhanced() {
  const [data, setData] = useState<RelativeStrengthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'strong' | 'moderate' | 'weak'>('strong')
  const [sortBy, setSortBy] = useState<'relativeStrength' | 'changePercent1D' | 'relativeStrengthRank'>('relativeStrength')
  const [sectorFilter, setSectorFilter] = useState<string>('All')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    fetchRelativeStrengthData()
    // Refresh every 2 minutes
    const interval = setInterval(fetchRelativeStrengthData, 120000)
    return () => clearInterval(interval)
  }, [])

  const fetchRelativeStrengthData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/relative-strength')
      if (!response.ok) {
        throw new Error('Failed to fetch relative strength data')
      }
      
      const result = await response.json()
      if (result.success) {
        setData(result.data)
        setLastUpdate(new Date())
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Relative strength fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getDisplayStocks = () => {
    if (!data) return []
    
    let stocks: RelativeStrengthStock[] = []
    switch (selectedCategory) {
      case 'strong':
        stocks = data.strongPerformers
        break
      case 'moderate':
        stocks = data.moderatePerformers
        break
      case 'weak':
        stocks = data.underperformers
        break
      default:
        stocks = data.allStocks
    }

    // Filter by sector
    if (sectorFilter !== 'All') {
      stocks = stocks.filter(stock => stock.sector === sectorFilter)
    }

    // Sort stocks
    return stocks.sort((a, b) => {
      switch (sortBy) {
        case 'relativeStrength':
          return b.relativeStrength - a.relativeStrength
        case 'changePercent1D':
          return b.changePercent1D - a.changePercent1D
        case 'relativeStrengthRank':
          return b.relativeStrengthRank - a.relativeStrengthRank
        default:
          return 0
      }
    })
  }

  const getAvailableSectors = () => {
    if (!data) return ['All']
    const sectors = new Set(data.allStocks.map(stock => stock.sector))
    return ['All', ...Array.from(sectors).sort()]
  }

  const getMomentumColor = (momentum: string) => {
    switch (momentum) {
      case 'strong': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'moderate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'weak': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'strong': return <Zap className="h-4 w-4" />
      case 'moderate': return <Activity className="h-4 w-4" />
      case 'weak': return <TrendingDown className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getRankColor = (rank: number) => {
    if (rank >= 80) return 'text-green-400'
    if (rank >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (loading && !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Calculating relative strength from Yahoo Finance...</p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error && !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-900/30 backdrop-blur-sm p-6 rounded-xl border border-red-700/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">Relative strength data unavailable: {error}</span>
          </div>
          <button
            onClick={fetchRelativeStrengthData}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    )
  }

  const displayStocks = getDisplayStocks()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-400" />
            Relative Strength Scanner
          </h2>
          <p className="text-sm text-blue-400 mt-1">Live relative strength analysis vs SPY benchmark</p>
        </div>
        <div className="flex items-center space-x-3">
          {lastUpdate && (
            <div className="text-xs text-gray-400">
              Updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={fetchRelativeStrengthData}
            disabled={loading}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {data && (
        <>
          {/* Benchmark & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="text-sm text-gray-300">Benchmark (SPY)</div>
              <div className="text-xl font-bold text-white">${data.benchmark.price.toFixed(2)}</div>
              <div className={`text-sm ${data.benchmark.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.benchmark.changePercent >= 0 ? '+' : ''}{data.benchmark.changePercent.toFixed(2)}%
              </div>
            </div>

            <div className="bg-green-900/20 p-4 rounded-lg border border-green-600/30">
              <div className="text-sm text-green-300">Strong Performers</div>
              <div className="text-xl font-bold text-green-400">{data.summary.strongCount}</div>
              <div className="text-xs text-green-300">Outperforming +1%</div>
            </div>

            <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-600/30">
              <div className="text-sm text-yellow-300">Moderate Performers</div>
              <div className="text-xl font-bold text-yellow-400">{data.summary.moderateCount}</div>
              <div className="text-xs text-yellow-300">0% to +1%</div>
            </div>

            <div className="bg-red-900/20 p-4 rounded-lg border border-red-600/30">
              <div className="text-sm text-red-300">Underperformers</div>
              <div className="text-xl font-bold text-red-400">{data.summary.weakCount}</div>
              <div className="text-xs text-red-300">Below benchmark</div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="all">All Stocks</option>
                  <option value="strong">Strong Performers</option>
                  <option value="moderate">Moderate Performers</option>
                  <option value="weak">Underperformers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sector</label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                >
                  {getAvailableSectors().map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="relativeStrength">Relative Strength</option>
                  <option value="changePercent1D">1-Day Change</option>
                  <option value="relativeStrengthRank">RS Rank</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-400">
                  Showing {displayStocks.length} stocks
                </div>
              </div>
            </div>
          </div>

          {/* Stock List */}
          <div className="space-y-3">
            {displayStocks.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                  {/* Stock Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-lg">{stock.symbol}</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs ${getMomentumColor(stock.momentum)}`}>
                        {getMomentumIcon(stock.momentum)}
                        <span>{stock.momentum.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{stock.name}</div>
                    <div className="text-xs text-blue-400">{stock.sector}</div>
                  </div>

                  {/* Price & 1D Change */}
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">${stock.price.toFixed(2)}</div>
                    <div className={`text-sm ${stock.changePercent1D >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.changePercent1D >= 0 ? '+' : ''}{stock.changePercent1D.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400">${stock.change1D.toFixed(2)}</div>
                  </div>

                  {/* Relative Strength */}
                  <div className="text-center">
                    <div className="text-sm text-gray-300">Rel. Strength</div>
                    <div className={`text-lg font-semibold ${
                      stock.relativeStrength > 1 ? 'text-green-400' :
                      stock.relativeStrength > 0 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {stock.relativeStrength >= 0 ? '+' : ''}{stock.relativeStrength.toFixed(2)}%
                    </div>
                  </div>

                  {/* RS Rank */}
                  <div className="text-center">
                    <div className="text-sm text-gray-300">RS Rank</div>
                    <div className={`text-lg font-semibold ${getRankColor(stock.relativeStrengthRank)}`}>
                      {stock.relativeStrengthRank}
                    </div>
                    <div className="text-xs text-gray-400">/ 100</div>
                  </div>

                  {/* Volume & Market Cap */}
                  <div className="text-center">
                    <div className="text-sm text-gray-300">Volume</div>
                    <div className="text-sm font-medium text-white">
                      {(stock.volume / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-gray-400">
                      Cap: {(stock.marketCap / 1000000000).toFixed(0)}B
                    </div>
                  </div>

                  {/* Signals */}
                  <div>
                    <div className="text-sm text-gray-300 mb-1">Signals</div>
                    <div className="flex flex-wrap gap-1">
                      {stock.signals.slice(0, 2).map((signal, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded border border-blue-600/30"
                        >
                          {signal}
                        </span>
                      ))}
                      {stock.signals.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{stock.signals.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {displayStocks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No stocks found matching the current filters.
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
