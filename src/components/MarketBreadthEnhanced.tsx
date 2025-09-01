'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, Activity, AlertTriangle, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'

interface MarketBreadthData {
  spyAdvanceDecline: number
  vixLevel: number
  marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
}

interface SectorRotationData {
  sector: string
  symbol: string
  price: number
  change1D: number
  relativeStrength: number
  momentum: 'bullish' | 'bearish'
}

interface MarketIndex {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface MarketBreadthResponse {
  marketBreadth: MarketBreadthData
  sectorRotation: SectorRotationData[]
  marketIndices: MarketIndex[]
  timestamp: string
}

export default function MarketBreadthEnhanced() {
  const [data, setData] = useState<MarketBreadthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    fetchMarketBreadth()
    // Refresh every 2 minutes
    const interval = setInterval(fetchMarketBreadth, 120000)
    return () => clearInterval(interval)
  }, [])

  const fetchMarketBreadth = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/market-breadth')
      if (!response.ok) throw new Error('Failed to fetch market breadth data')
      
      const result = await response.json()
      if (result.success) {
        setData(result.data)
        setLastUpdate(new Date())
        setError(null)
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Market breadth fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'BEARISH': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH': return <TrendingUp className="h-4 w-4" />
      case 'BEARISH': return <TrendingDown className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getVixColor = (vix: number) => {
    if (vix > 30) return 'text-red-400'
    if (vix > 20) return 'text-yellow-400'
    return 'text-green-400'
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
            <p className="text-gray-400">Loading market breadth from Yahoo Finance...</p>
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
            <span className="text-red-400">Market breadth data unavailable</span>
          </div>
          <button
            onClick={fetchMarketBreadth}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
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
          <h2 className="text-xl font-bold text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
            Market Breadth & Sector Rotation
          </h2>
          <p className="text-sm text-blue-400 mt-1">Live market sentiment and sector analysis</p>
        </div>
        {lastUpdate && (
          <div className="text-xs text-gray-400">
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      {data && (
        <>
          {/* Market Sentiment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Market Sentiment</h3>
                  <div className={`flex items-center space-x-2 mt-2 px-3 py-1 rounded-full border ${getSentimentColor(data.marketBreadth.marketSentiment)}`}>
                    {getSentimentIcon(data.marketBreadth.marketSentiment)}
                    <span className="text-sm font-semibold">{data.marketBreadth.marketSentiment}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">VIX Fear Index</h3>
                  <div className={`text-2xl font-bold ${getVixColor(data.marketBreadth.vixLevel)}`}>
                    {data.marketBreadth.vixLevel.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {data.marketBreadth.vixLevel > 30 ? 'High Fear' : 
                     data.marketBreadth.vixLevel > 20 ? 'Moderate' : 'Low Fear'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">SPY A/D Line</h3>
                  <div className={`text-2xl font-bold ${data.marketBreadth.spyAdvanceDecline >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.marketBreadth.spyAdvanceDecline >= 0 ? '+' : ''}{data.marketBreadth.spyAdvanceDecline.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">1-Day Change</div>
                </div>
              </div>
            </div>
          </div>

          {/* Major Indices */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Major Indices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.marketIndices.map((index) => (
                <div key={index.symbol} className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{index.name}</div>
                      <div className="text-xs text-gray-400">{index.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">${index.price.toFixed(2)}</div>
                      <div className={`text-xs ${index.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Rotation - Enhanced with Magic */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Sector Rotation Dashboard
                </h3>
                <p className="text-slate-400 mt-1">Real-time 1-day performance with momentum indicators</p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-sm font-medium">Live Updates</span>
              </div>
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div 
                className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm p-4 rounded-xl border border-green-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {data.sectorRotation.filter(s => s.change1D > 0).length}
                  </div>
                  <div className="text-xs text-slate-400">Sectors Up</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm p-4 rounded-xl border border-red-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {data.sectorRotation.filter(s => s.change1D < 0).length}
                  </div>
                  <div className="text-xs text-slate-400">Sectors Down</div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm p-4 rounded-xl border border-yellow-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {Math.max(...data.sectorRotation.map(s => s.change1D)).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400">Best Performer</div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {(data.sectorRotation.reduce((sum, s) => sum + s.relativeStrength, 0) / data.sectorRotation.length).toFixed(0)}
                  </div>
                  <div className="text-xs text-slate-400">Avg Strength</div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Sector Cards */}
            <div className="space-y-3">
              {data.sectorRotation
                .sort((a, b) => b.change1D - a.change1D) // Sort by performance
                .map((sector, index) => {
                  const isTopPerformer = index === 0
                  const isWorstPerformer = index === data.sectorRotation.length - 1
                  const isStrongBuy = sector.change1D > 2 && sector.relativeStrength > 70
                  const isStrongSell = sector.change1D < -2 && sector.relativeStrength < 30
                  
                  return (
                    <motion.div
                      key={sector.symbol}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.5 }}
                      whileHover={{ 
                        scale: 1.02, 
                        boxShadow: sector.change1D >= 0 ? 
                          '0 8px 32px rgba(34, 197, 94, 0.15)' : 
                          '0 8px 32px rgba(239, 68, 68, 0.15)'
                      }}
                      className={`relative overflow-hidden p-5 rounded-xl border transition-all duration-300 group cursor-pointer ${
                        isStrongBuy ? 'border-green-400/60 bg-gradient-to-r from-green-900/30 to-green-800/20' :
                        isStrongSell ? 'border-red-400/60 bg-gradient-to-r from-red-900/30 to-red-800/20' :
                        sector.change1D >= 1 ? 'border-green-500/40 bg-gradient-to-r from-green-900/20 to-slate-800/40' :
                        sector.change1D <= -1 ? 'border-red-500/40 bg-gradient-to-r from-red-900/20 to-slate-800/40' :
                        'border-slate-600/50 bg-gradient-to-r from-slate-800/40 to-slate-700/30'
                      }`}
                    >
                      {/* Background glow effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                        sector.change1D >= 0 ? 'bg-green-400' : 'bg-red-400'
                      } blur-xl`}></div>
                      
                      {/* Performance badges */}
                      <div className="absolute top-3 right-3 flex space-x-2">
                        {isTopPerformer && (
                          <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30 flex items-center">
                            🏆 Top
                          </div>
                        )}
                        {isStrongBuy && (
                          <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                            🚀 Strong Buy
                          </div>
                        )}
                        {isStrongSell && (
                          <div className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full border border-red-500/30">
                            ⚠️ Weak
                          </div>
                        )}
                      </div>

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Enhanced momentum indicator */}
                          <div className="relative">
                            <div className={`w-4 h-4 rounded-full ${sector.momentum === 'bullish' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                            <div className={`absolute inset-0 w-4 h-4 rounded-full ${sector.momentum === 'bullish' ? 'bg-green-400' : 'bg-red-400'} animate-ping opacity-30`}></div>
                          </div>
                          
                          <div>
                            <div className="font-bold text-white text-lg group-hover:text-blue-200 transition-colors">
                              {sector.sector}
                            </div>
                            <div className="text-sm text-slate-400 flex items-center space-x-2">
                              <span>{sector.symbol}</span>
                              <span>•</span>
                              <span className="text-xs">RS: {sector.relativeStrength.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          {/* Price info */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">${sector.price.toFixed(2)}</div>
                            <div className={`text-sm font-semibold flex items-center ${sector.change1D >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {sector.change1D >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {sector.change1D >= 0 ? '+' : ''}{sector.change1D.toFixed(2)}%
                            </div>
                          </div>
                          
                          {/* Relative strength meter */}
                          <div className="text-right min-w-[80px]">
                            <div className="text-xs text-slate-400 mb-1">Strength</div>
                            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ease-out ${
                                  sector.relativeStrength >= 70 ? 'bg-green-400' :
                                  sector.relativeStrength >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${sector.relativeStrength}%` }}
                              ></div>
                            </div>
                            <div className={`text-xs font-medium mt-1 ${
                              sector.relativeStrength >= 70 ? 'text-green-400' :
                              sector.relativeStrength >= 50 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {sector.relativeStrength.toFixed(0)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance bar at bottom */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-700">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out ${
                            sector.change1D >= 0 ? 'bg-green-400' : 'bg-red-400'
                          }`}
                          style={{ 
                            width: `${Math.min(Math.abs(sector.change1D) * 20, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={fetchMarketBreadth}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>{loading ? 'Updating...' : 'Refresh Data'}</span>
            </button>
          </div>
        </>
      )}
    </motion.div>
  )
}
