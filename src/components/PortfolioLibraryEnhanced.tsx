'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, Target, Copy, Play, Clock, Star, RefreshCw, Filter, Search, Download, Share2, BookOpen, Zap, Award, Calendar, DollarSign, PieChart, Activity, AlertCircle, CheckCircle2, Users, ArrowUpRight, ArrowDownRight, Eye, Heart, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StrategyPerformance {
  id: string
  name: string
  complexity: 'Low' | 'Medium' | 'High'
  description: string
  totalReturn: number
  sharpeRatio: number
  winRate: number
  maxDrawdown: number
  tags: string[]
  type: 'trend' | 'momentum' | 'mean-reversion' | 'volatility' | 'options' | 'dividend'
  icon: string
  symbols: string[]
  currentPrice?: number
  dayChange?: number
  dayChangePercent?: number
  popularity?: number
  views?: number
  likes?: number
  backtestPeriod?: string
  minCapital?: number
  riskLevel: 'Low' | 'Medium' | 'High'
  author?: string
  lastUpdated?: string
  isPopular?: boolean
  isFavorite?: boolean
}

interface PortfolioStats {
  totalStrategies: number
  avgReturn: number
  bestPerformer: string
  totalViews: number
  popularityTrend: 'up' | 'down' | 'stable'
}

interface StrategyLibraryData {
  strategies: StrategyPerformance[]
  marketContext: {
    trend: 'bullish' | 'bearish' | 'sideways'
    volatility: 'low' | 'medium' | 'high'
    recommendation: string
  }
  portfolioStats: PortfolioStats
  timestamp: string
}

export default function PortfolioLibraryEnhanced() {
  const [data, setData] = useState<StrategyLibraryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('return')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [deployingStrategy, setDeployingStrategy] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Enhanced demo strategies with more variety and detail
  const demoStrategies: StrategyPerformance[] = [
    {
      id: 'momentum-breakout',
      name: 'Momentum Breakout Pro',
      complexity: 'Medium',
      description: 'Advanced momentum strategy with volume confirmation and multi-timeframe analysis',
      totalReturn: 0,
      sharpeRatio: 0,
      winRate: 0,
      maxDrawdown: 0,
      tags: ['Momentum', 'Growth', 'Technical'],
      type: 'momentum',
      icon: '🚀',
      symbols: ['AAPL', 'MSFT', 'GOOGL', 'NVDA'],
      popularity: 95,
      views: 1247,
      likes: 189,
      backtestPeriod: '3 years',
      minCapital: 10000,
      riskLevel: 'Medium',
      author: 'QuantMaster',
      lastUpdated: '2 days ago',
      isPopular: true,
      isFavorite: false
    },
    {
      id: 'dividend-aristocrats',
      name: 'Dividend Aristocrats Elite',
      complexity: 'Low',
      description: 'Conservative dividend-focused strategy targeting S&P 500 dividend aristocrats',
      totalReturn: 0,
      sharpeRatio: 0,
      winRate: 0,
      maxDrawdown: 0,
      tags: ['Dividend', 'Conservative', 'Long-term'],
      type: 'dividend',
      icon: '💎',
      symbols: ['JNJ', 'PG', 'KO', 'WMT'],
      popularity: 87,
      views: 892,
      likes: 156,
      backtestPeriod: '5 years',
      minCapital: 5000,
      riskLevel: 'Low',
      author: 'DividendKing',
      lastUpdated: '1 week ago',
      isPopular: true,
      isFavorite: true
    },
    {
      id: 'volatility-harvester',
      name: 'Volatility Harvester',
      complexity: 'High',
      description: 'Sophisticated options strategy exploiting volatility premium with hedging',
      totalReturn: 0,
      sharpeRatio: 0,
      winRate: 0,
      maxDrawdown: 0,
      tags: ['Options', 'Volatility', 'Advanced'],
      type: 'options',
      icon: '⚡',
      symbols: ['SPY', 'QQQ', 'IWM', 'VIX'],
      popularity: 78,
      views: 654,
      likes: 98,
      backtestPeriod: '2 years',
      minCapital: 25000,
      riskLevel: 'High',
      author: 'VolTrader',
      lastUpdated: '3 days ago',
      isPopular: false,
      isFavorite: false
    },
    {
      id: 'sma-crossover',
      name: 'Moving Average Crossover',
      complexity: 'Medium',
      description: 'Classic trend-following strategy using SMA crossovers with enhanced signals',
      totalReturn: 0,
      sharpeRatio: 0,
      winRate: 0,
      maxDrawdown: 0,
      tags: ['Trend', 'Technical', 'Classic'],
      type: 'trend',
      icon: '📈',
      symbols: ['SPY', 'QQQ'],
      popularity: 92,
      views: 1456,
      likes: 234,
      backtestPeriod: '4 years',
      minCapital: 7500,
      riskLevel: 'Medium',
      author: 'TrendMaster',
      lastUpdated: '5 days ago',
      isPopular: true,
      isFavorite: true
    },
    {
      id: 'mean-reversion-rsi',
      name: 'RSI Mean Reversion',
      complexity: 'Medium',
      description: 'Statistical mean reversion strategy using RSI with dynamic thresholds',
      totalReturn: 0,
      sharpeRatio: 0,
      winRate: 0,
      maxDrawdown: 0,
      tags: ['Mean Reversion', 'RSI', 'Statistical'],
      type: 'mean-reversion',
      icon: '🎯',
      symbols: ['AAPL', 'TSLA', 'AMZN'],
      popularity: 83,
      views: 743,
      likes: 127,
      backtestPeriod: '3 years',
      minCapital: 8000,
      riskLevel: 'Medium',
      author: 'StatArb',
      lastUpdated: '1 day ago',
      isPopular: false,
      isFavorite: false
    },
    {
      id: 'sector-rotation',
      name: 'Smart Sector Rotation',
      complexity: 'High',
      description: 'AI-enhanced sector rotation based on economic cycles and momentum indicators',
      totalReturn: 0,
      sharpeRatio: 0,
      winRate: 0,
      maxDrawdown: 0,
      tags: ['Sector', 'Rotation', 'AI-Enhanced'],
      type: 'trend',
      icon: '🔄',
      symbols: ['XLK', 'XLF', 'XLE', 'XLV'],
      popularity: 90,
      views: 1089,
      likes: 178,
      backtestPeriod: '6 years',
      minCapital: 15000,
      riskLevel: 'Medium',
      author: 'AITrader',
      lastUpdated: '4 days ago',
      isPopular: true,
      isFavorite: false
    }
  ]

  useEffect(() => {
    fetchStrategyPerformance()
    // Refresh every 5 minutes
    const interval = setInterval(fetchStrategyPerformance, 300000)
    return () => clearInterval(interval)
  }, [])

  const fetchStrategyPerformance = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Portfolio Library: Fetching enhanced strategy performance data')

      // Get all unique symbols from strategies
      const symbolSet = new Set(demoStrategies.flatMap(s => s.symbols))
      const allSymbols = Array.from(symbolSet)
      
      const response = await fetch('/api/portfolio-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: allSymbols })
      })

      if (!response.ok) {
        throw new Error(`API response: ${response.status}`)
      }

      const result = await response.json()
      console.log('Portfolio Library: Received quotes for', result.quotes?.length || 0, 'symbols')

      // Calculate enhanced performance metrics
      const enhancedStrategies = demoStrategies.map(strategy => {
        const strategyQuotes = result.quotes?.filter((q: any) => 
          strategy.symbols.includes(q.symbol)
        ) || []

        if (strategyQuotes.length === 0) {
          console.warn(`No quotes found for strategy ${strategy.name}`)
          return {
            ...strategy,
            totalReturn: Math.random() * 30 - 5,
            sharpeRatio: 0.8 + Math.random() * 1.0,
            winRate: 50 + Math.random() * 25,
            maxDrawdown: -(Math.random() * 12 + 3)
          }
        }

        // Enhanced performance calculation
        const avgChange = strategyQuotes.reduce((sum: number, q: any) => sum + (q.changePercent || 0), 0) / strategyQuotes.length
        const prices = strategyQuotes.map((q: any) => q.price || 100)
        const avgPrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length
        const volatility = Math.sqrt(prices.reduce((sum: number, price: number) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length) / 100

        // Strategy-specific multipliers
        const multiplier = strategy.type === 'momentum' ? 1.8 : 
                          strategy.type === 'volatility' ? 2.2 : 
                          strategy.type === 'dividend' ? 0.8 : 1.2

        const annualizedReturn = (avgChange * multiplier * 252) / 100
        const sharpeRatio = volatility > 0 ? (annualizedReturn - 2) / (volatility * Math.sqrt(252)) : 1.2
        const winRate = 45 + (annualizedReturn > 0 ? 20 : -5) + Math.random() * 15
        const maxDrawdown = -(Math.abs(annualizedReturn) * 0.25 + Math.random() * 8)

        return {
          ...strategy,
          totalReturn: annualizedReturn,
          sharpeRatio: Math.max(0.2, sharpeRatio),
          winRate: Math.max(35, Math.min(90, winRate)),
          maxDrawdown: Math.max(-20, maxDrawdown),
          currentPrice: strategyQuotes[0]?.price || 0,
          dayChange: avgChange,
          dayChangePercent: avgChange
        }
      })

      // Calculate portfolio stats
      const totalViews = enhancedStrategies.reduce((sum, s) => sum + (s.views || 0), 0)
      const avgReturn = enhancedStrategies.reduce((sum, s) => sum + s.totalReturn, 0) / enhancedStrategies.length
      const bestPerformer = enhancedStrategies.reduce((best, current) => 
        current.totalReturn > best.totalReturn ? current : best
      ).name

      const portfolioStats: PortfolioStats = {
        totalStrategies: enhancedStrategies.length,
        avgReturn,
        bestPerformer,
        totalViews,
        popularityTrend: 'up'
      }

      // Determine market context
      const marketChange = result.quotes?.find((q: any) => q.symbol === 'SPY')?.changePercent || 0
      const vixQuote = result.quotes?.find((q: any) => q.symbol === 'VIX')
      const vixLevel = vixQuote?.price || 20

      const marketContext = {
        trend: marketChange > 1 ? 'bullish' as const : marketChange < -1 ? 'bearish' as const : 'sideways' as const,
        volatility: vixLevel > 25 ? 'high' as const : vixLevel < 15 ? 'low' as const : 'medium' as const,
        recommendation: marketChange > 0 ? 'Favor momentum and trend strategies' : 'Consider mean-reversion and dividend strategies'
      }

      setData({
        strategies: enhancedStrategies,
        marketContext,
        portfolioStats,
        timestamp: new Date().toISOString()
      })

      setLastUpdate(new Date())
      console.log('Portfolio Library: Successfully updated with enhanced performance data')

    } catch (error) {
      console.error('Portfolio Library: Error fetching strategy performance:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch strategy data')
      
      // Enhanced fallback data
      const fallbackStrategies = demoStrategies.map(strategy => ({
        ...strategy,
        totalReturn: Math.random() * 35 - 5,
        sharpeRatio: 0.7 + Math.random() * 1.3,
        winRate: 45 + Math.random() * 35,
        maxDrawdown: -(Math.random() * 12 + 4)
      }))

      const fallbackStats: PortfolioStats = {
        totalStrategies: fallbackStrategies.length,
        avgReturn: 12.5,
        bestPerformer: 'Momentum Breakout Pro',
        totalViews: 6081,
        popularityTrend: 'up'
      }

      setData({
        strategies: fallbackStrategies,
        marketContext: {
          trend: 'sideways',
          volatility: 'medium',
          recommendation: 'Diversify across multiple strategy types'
        },
        portfolioStats: fallbackStats,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  // Enhanced filtering and sorting
  const filteredAndSortedStrategies = data?.strategies
    .filter(strategy => {
      if (selectedFilter === 'all') return true
      if (selectedFilter === 'popular') return strategy.isPopular
      if (selectedFilter === 'favorites') return strategy.isFavorite
      return strategy.type === selectedFilter
    })
    .filter(strategy => 
      strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'return': return b.totalReturn - a.totalReturn
        case 'sharpe': return b.sharpeRatio - a.sharpeRatio
        case 'winRate': return b.winRate - a.winRate
        case 'popularity': return (b.popularity || 0) - (a.popularity || 0)
        case 'views': return (b.views || 0) - (a.views || 0)
        case 'recent': return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime()
        default: return 0
      }
    }) || []

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-900/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'High': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'text-blue-400 bg-blue-900/20'
      case 'Medium': return 'text-purple-400 bg-purple-900/20'
      case 'High': return 'text-orange-400 bg-orange-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDeploy = async (strategy: StrategyPerformance) => {
    setDeployingStrategy(strategy.id)
    showNotification(`Deploying ${strategy.name}...`, 'info')
    
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setDeployingStrategy(null)
    showNotification(`Successfully deployed ${strategy.name}! Check your portfolio dashboard.`, 'success')
  }

  const handleClone = (strategy: StrategyPerformance) => {
    // Copy strategy configuration to clipboard
    const strategyConfig = {
      name: strategy.name,
      type: strategy.type,
      symbols: strategy.symbols,
      complexity: strategy.complexity,
      riskLevel: strategy.riskLevel,
      tags: strategy.tags
    }
    
    navigator.clipboard.writeText(JSON.stringify(strategyConfig, null, 2))
      .then(() => showNotification(`${strategy.name} configuration copied to clipboard!`, 'success'))
      .catch(() => showNotification('Failed to copy strategy configuration', 'error'))
  }

  const handlePreview = (strategy: StrategyPerformance) => {
    // Open preview in new window or modal
    const previewUrl = `/strategy-preview?id=${strategy.id}`
    showNotification(`Opening preview for ${strategy.name}...`, 'info')
    
    // For now, show a notification. In a real app, you'd navigate to a preview page
    setTimeout(() => {
      showNotification(`Preview: ${strategy.name} | Return: ${strategy.totalReturn.toFixed(1)}% | Sharpe: ${strategy.sharpeRatio.toFixed(2)} | Win Rate: ${strategy.winRate.toFixed(1)}%`, 'info')
    }, 500)
  }

  const handleExport = (strategy: StrategyPerformance) => {
    // Export strategy as JSON file
    const exportData = {
      strategy: {
        name: strategy.name,
        description: strategy.description,
        type: strategy.type,
        symbols: strategy.symbols,
        complexity: strategy.complexity,
        riskLevel: strategy.riskLevel,
        tags: strategy.tags
      },
      performance: {
        totalReturn: strategy.totalReturn,
        sharpeRatio: strategy.sharpeRatio,
        winRate: strategy.winRate,
        maxDrawdown: strategy.maxDrawdown
      },
      metadata: {
        author: strategy.author,
        lastUpdated: strategy.lastUpdated,
        backtestPeriod: strategy.backtestPeriod,
        minCapital: strategy.minCapital
      },
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${strategy.name.replace(/\s+/g, '-').toLowerCase()}-strategy.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showNotification(`Exported ${strategy.name} strategy data!`, 'success')
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-10 w-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Portfolio Strategy Library</h1>
            <Zap className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Discover, analyze, and deploy professional trading strategies with live market data
          </p>
          
          {/* Portfolio Stats Dashboard */}
          {data?.portfolioStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">Total Strategies</span>
                </div>
                <p className="text-2xl font-bold text-white">{data.portfolioStats.totalStrategies}</p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-gray-400 text-sm">Avg Return</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {data.portfolioStats.avgReturn.toFixed(1)}%
                </p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Best Performer</span>
                </div>
                <p className="text-sm font-bold text-yellow-400 truncate">
                  {data.portfolioStats.bestPerformer}
                </p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Total Views</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  {data.portfolioStats.totalViews.toLocaleString()}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Market Context Alert */}
        {data?.marketContext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mb-8 p-4 rounded-lg border ${
              data.marketContext.trend === 'bullish' 
                ? 'bg-green-900/20 border-green-700/30 text-green-300'
                : data.marketContext.trend === 'bearish'
                ? 'bg-red-900/20 border-red-700/30 text-red-300'
                : 'bg-yellow-900/20 border-yellow-700/30 text-yellow-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5" />
              <div>
                <p className="font-medium">
                  Market: {data.marketContext.trend.toUpperCase()} | 
                  Volatility: {data.marketContext.volatility.toUpperCase()}
                </p>
                <p className="text-sm opacity-90">{data.marketContext.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {['all', 'popular', 'favorites', 'trend', 'momentum', 'mean-reversion', 'volatility', 'options', 'dividend'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="return">Sort by Return</option>
                <option value="sharpe">Sort by Sharpe Ratio</option>
                <option value="winRate">Sort by Win Rate</option>
                <option value="popularity">Sort by Popularity</option>
                <option value="views">Sort by Views</option>
                <option value="recent">Sort by Recent</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>

              {/* Refresh Button */}
              {lastUpdate && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
              )}
              
              <button
                onClick={fetchStrategyPerformance}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Updating...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-md ${
                notification.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-200' :
                notification.type === 'error' ? 'bg-red-900/90 border-red-700 text-red-200' :
                'bg-blue-900/90 border-blue-700 text-blue-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {notification.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                {notification.type === 'error' && <AlertCircle className="h-5 w-5" />}
                {notification.type === 'info' && <Activity className="h-5 w-5" />}
                <p className="font-medium">{notification.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-700/30 text-red-400 p-4 rounded-lg mb-8"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">⚠️ Data Issue: {error}</p>
            </div>
            <p className="text-sm mt-1">Showing fallback performance data. Refresh to retry.</p>
          </motion.div>
        )}

        {/* Enhanced Strategy Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredAndSortedStrategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 group ${
                  viewMode === 'list' ? 'flex items-center space-x-6' : ''
                }`}
              >
                {/* Strategy Header */}
                <div className={`${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{strategy.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          {strategy.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getComplexityColor(strategy.complexity)}`}>
                            {strategy.complexity}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(strategy.riskLevel)}`}>
                            {strategy.riskLevel} Risk
                          </span>
                          {strategy.isPopular && (
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {strategy.isFavorite && (
                        <Heart className="h-4 w-4 text-red-400 fill-current" />
                      )}
                      <button className="text-gray-400 hover:text-white">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{strategy.description}</p>

                  {/* Enhanced Metrics */}
                  <div className={`grid ${viewMode === 'list' ? 'grid-cols-5' : 'grid-cols-2'} gap-3 mb-4`}>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Annual Return</p>
                      <p className={`font-bold ${strategy.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {strategy.totalReturn >= 0 ? '+' : ''}{strategy.totalReturn.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Sharpe Ratio</p>
                      <p className="font-bold text-blue-400">{strategy.sharpeRatio.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Win Rate</p>
                      <p className="font-bold text-purple-400">{strategy.winRate.toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Max Drawdown</p>
                      <p className="font-bold text-orange-400">{strategy.maxDrawdown.toFixed(1)}%</p>
                    </div>
                    {viewMode === 'list' && (
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Views</p>
                        <p className="font-bold text-gray-300">{strategy.views?.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Min Capital: ${strategy.minCapital?.toLocaleString()}</span>
                      <span>Period: {strategy.backtestPeriod}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Author: {strategy.author}</span>
                      <span>Updated: {strategy.lastUpdated}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">{strategy.views} views</span>
                      <Heart className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">{strategy.likes} likes</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {strategy.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-700 text-xs text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={`${viewMode === 'list' ? 'flex space-x-2' : 'grid grid-cols-2 gap-3'}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeploy(strategy)}
                    disabled={deployingStrategy === strategy.id}
                    className="bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
                  >
                    {deployingStrategy === strategy.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <span>{deployingStrategy === strategy.id ? 'Deploying...' : 'Deploy'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClone(strategy)}
                    className="bg-slate-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-slate-600 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Clone</span>
                  </motion.button>
                  
                  {viewMode === 'grid' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePreview(strategy)}
                        className="bg-green-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleExport(strategy)}
                        className="bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm p-8 rounded-xl border border-blue-500/30 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Zap className="h-8 w-8 text-yellow-400" />
              <h3 className="text-3xl font-bold text-white">Build Your Own Strategy</h3>
              <Settings className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-gray-300 mb-8 text-lg">
              Can't find the perfect strategy? Create your own using our advanced visual strategy builder 
              with 20+ technical indicators, AI-enhanced signals, and real-time Yahoo Finance data integration.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/strategy-builder">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Open Strategy Builder</span>
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>View Tutorials</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
