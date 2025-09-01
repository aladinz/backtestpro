'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, Target, Maximize2, Play, ChevronDown, Activity, BarChart3, TrendingDown, Waves, Zap, LineChart, Calendar, DollarSign, Sparkles, ArrowRight } from 'lucide-react'

export default function QuickStrategy() {
  const [selectedTicker, setSelectedTicker] = useState('AAPL')
  const [selectedIndicator, setSelectedIndicator] = useState('MACD')
  const [isTickerDropdownOpen, setIsTickerDropdownOpen] = useState(false)
  const [isIndicatorDropdownOpen, setIsIndicatorDropdownOpen] = useState(false)
  const [customTicker, setCustomTicker] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [strategyMetrics, setStrategyMetrics] = useState({
    expectedReturn: '+12.4%',
    sharpeRatio: '1.8',
    maxDrawdown: '-8.2%'
  })

  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185.25, change: 2.45 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: 3.78 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: -1.20 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.89, change: 0.85 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -8.33 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 15.67 },
    { symbol: 'META', name: 'Meta Platforms', price: 338.54, change: 4.21 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 487.22, change: -2.14 }
  ]
  
  const availableIndicators = [
    { 
      value: 'MACD', 
      label: 'MACD Crossover', 
      icon: Activity, 
      description: 'Moving Average Convergence Divergence signal crossover',
      risk: 'Medium' as const,
      timeframe: '2-4 weeks'
    },
    { 
      value: 'SMA', 
      label: 'Moving Average Cross', 
      icon: LineChart, 
      description: 'Simple Moving Average crossover strategy',
      risk: 'Low' as const,
      timeframe: '1-3 months'
    },
    { 
      value: 'RSI', 
      label: 'RSI Mean Reversion', 
      icon: BarChart3, 
      description: 'Relative Strength Index oversold/overbought signals',
      risk: 'High' as const,
      timeframe: '1-2 weeks'
    },
    { 
      value: 'BOLLINGER', 
      label: 'Bollinger Bands', 
      icon: Waves, 
      description: 'Bollinger Bands squeeze and breakout strategy',
      risk: 'Medium' as const,
      timeframe: '2-6 weeks'
    },
    { 
      value: 'EMA', 
      label: 'EMA Momentum', 
      icon: TrendingUp, 
      description: 'Exponential Moving Average momentum strategy',
      risk: 'Medium' as const,
      timeframe: '3-8 weeks'
    },
    { 
      value: 'STOCHASTIC', 
      label: 'Stochastic Oscillator', 
      icon: Zap, 
      description: 'Stochastic momentum reversal signals',
      risk: 'High' as const,
      timeframe: '1-3 weeks'
    }
  ]

  // Auto-close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-dropdown="ticker"]') && !target.closest('[data-dropdown="indicator"]')) {
        setIsTickerDropdownOpen(false)
        setIsIndicatorDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Progress animation for backtest
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [isRunning])

  // Generate realistic metrics based on ticker and indicator
  const generateStrategyMetrics = (ticker: string, indicator: string) => {
    const baseMetrics = {
      AAPL: { return: 15.2, sharpe: 1.8, drawdown: 8.2 },
      GOOGL: { return: 18.7, sharpe: 2.1, drawdown: 12.1 },
      MSFT: { return: 14.3, sharpe: 1.9, drawdown: 7.8 },
      AMZN: { return: 22.1, sharpe: 1.6, drawdown: 15.4 },
      TSLA: { return: 28.9, sharpe: 1.4, drawdown: 22.7 },
      NVDA: { return: 31.2, sharpe: 1.7, drawdown: 25.3 },
      META: { return: 19.8, sharpe: 1.5, drawdown: 18.2 },
      NFLX: { return: 16.4, sharpe: 1.3, drawdown: 19.1 }
    }

    const indicatorMultipliers = {
      MACD: { return: 1.0, sharpe: 1.0, drawdown: 1.0 },
      SMA: { return: 0.85, sharpe: 1.1, drawdown: 0.8 },
      RSI: { return: 0.9, sharpe: 0.95, drawdown: 0.9 },
      BOLLINGER: { return: 1.15, sharpe: 0.9, drawdown: 1.2 },
      EMA: { return: 0.95, sharpe: 1.05, drawdown: 0.85 },
      STOCHASTIC: { return: 0.8, sharpe: 0.85, drawdown: 1.1 }
    }

    const base = baseMetrics[ticker as keyof typeof baseMetrics] || baseMetrics.AAPL
    const multiplier = indicatorMultipliers[indicator as keyof typeof indicatorMultipliers] || indicatorMultipliers.MACD

    const expectedReturn = (base.return * multiplier.return).toFixed(1)
    const sharpeRatio = (base.sharpe * multiplier.sharpe).toFixed(1)
    const maxDrawdown = (base.drawdown * multiplier.drawdown).toFixed(1)

    return {
      expectedReturn: `+${expectedReturn}%`,
      sharpeRatio,
      maxDrawdown: `-${maxDrawdown}%`
    }
  }

  // Update metrics when ticker or indicator changes
  useEffect(() => {
    const newMetrics = generateStrategyMetrics(selectedTicker, selectedIndicator)
    setStrategyMetrics(newMetrics)
  }, [selectedTicker, selectedIndicator])

  const handleTickerSelect = (ticker: string) => {
    setSelectedTicker(ticker)
    setIsTickerDropdownOpen(false)
    setCustomTicker('')
  }

  const handleCustomTickerSubmit = () => {
    if (customTicker.trim()) {
      setSelectedTicker(customTicker.toUpperCase())
      setIsTickerDropdownOpen(false)
      setCustomTicker('')
    }
  }

  const handleIndicatorSelect = (indicator: string) => {
    setSelectedIndicator(indicator)
    setIsIndicatorDropdownOpen(false)
  }

  const handleRunBacktest = () => {
    setIsRunning(true)
    setProgress(0)
    
    setTimeout(() => {
      setIsRunning(false)
      setProgress(0)
    }, 3000)
  }

  const selectedIndicatorData = availableIndicators.find(ind => ind.value === selectedIndicator)
  const selectedTickerData = popularStocks.find(stock => stock.symbol === selectedTicker)
  const IconComponent = selectedIndicatorData?.icon || Activity

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'High': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Ticker Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-300 flex items-center">
          <Target className="h-4 w-4 mr-2 text-green-400" />
          Select Stock/ETF
        </label>
        <div className="relative" data-dropdown="ticker">
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              setIsTickerDropdownOpen(!isTickerDropdownOpen)
              setIsIndicatorDropdownOpen(false)
            }}
            className="w-full bg-gradient-to-r from-slate-700/50 to-slate-600/30 backdrop-blur-sm border border-slate-500/50 rounded-xl p-4 text-left focus:outline-none focus:ring-2 focus:ring-green-500/50 hover:border-green-500/50 transition-all duration-300 group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white group-hover:text-green-200 transition-colors text-lg">
                    {selectedTicker}
                  </span>
                  {selectedTickerData && (
                    <span className={`text-sm font-medium ${selectedTickerData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${selectedTickerData.price.toFixed(2)} ({selectedTickerData.change >= 0 ? '+' : ''}{selectedTickerData.change.toFixed(2)})
                    </span>
                  )}
                </div>
                {selectedTickerData && (
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    {selectedTickerData.name}
                  </p>
                )}
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 ml-3 transition-transform duration-200 ${isTickerDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </motion.button>

          <AnimatePresence>
            {isTickerDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-lg border border-slate-600/50 rounded-xl shadow-2xl overflow-hidden"
              >
                {/* Custom Ticker Input */}
                <div className="p-4 border-b border-slate-700/50">
                  <input
                    type="text"
                    placeholder="Enter custom ticker (e.g., AAPL, TSLA)..."
                    value={customTicker}
                    onChange={(e) => setCustomTicker(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleCustomTickerSubmit()
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  />
                </div>
                
                {/* Popular Stocks */}
                <div className="max-h-60 overflow-y-auto">
                  {popularStocks.map((stock, index) => (
                    <motion.button
                      key={stock.symbol}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTickerSelect(stock.symbol)
                      }}
                      className="w-full p-4 text-left hover:bg-slate-700/50 focus:bg-slate-700/50 focus:outline-none transition-colors border-b border-slate-700/50 last:border-b-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">{stock.symbol}</span>
                        <span className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${stock.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">{stock.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${stock.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Indicator Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-300 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
          Trading Strategy
        </label>
        <div className="relative" data-dropdown="indicator">
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              setIsIndicatorDropdownOpen(!isIndicatorDropdownOpen)
              setIsTickerDropdownOpen(false)
            }}
            className="w-full bg-gradient-to-r from-slate-700/50 to-slate-600/30 backdrop-blur-sm border border-slate-500/50 rounded-xl p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-blue-500/50 transition-all duration-300 group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <IconComponent className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="font-semibold text-white group-hover:text-blue-200 transition-colors">
                      {selectedIndicatorData?.label}
                    </span>
                  </div>
                  {selectedIndicatorData && (
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRiskColor(selectedIndicatorData.risk)}`}>
                      {selectedIndicatorData.risk} Risk
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {selectedIndicatorData?.description}
                </p>
                {selectedIndicatorData && (
                  <div className="flex items-center mt-2 text-xs">
                    <span className="text-slate-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {selectedIndicatorData.timeframe}
                    </span>
                  </div>
                )}
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 ml-3 transition-transform duration-200 ${isIndicatorDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </motion.button>

          <AnimatePresence>
            {isIndicatorDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-lg border border-slate-600/50 rounded-xl shadow-2xl overflow-hidden"
              >
                {availableIndicators.map((indicator, index) => {
                  const IndicatorIcon = indicator.icon
                  return (
                    <motion.button
                      key={indicator.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleIndicatorSelect(indicator.value)
                      }}
                      className="w-full p-4 text-left hover:bg-slate-700/50 focus:bg-slate-700/50 focus:outline-none transition-colors border-b border-slate-700/50 last:border-b-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <IndicatorIcon className="h-4 w-4 text-blue-400 mr-3" />
                          <span className="font-semibold text-white">{indicator.label}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRiskColor(indicator.risk)}`}>
                          {indicator.risk}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2 ml-7">{indicator.description}</p>
                      <div className="flex items-center ml-7 text-xs">
                        <span className="text-slate-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {indicator.timeframe}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Strategy Preview with Enhanced Metrics */}
      <motion.div 
        className="bg-gradient-to-br from-slate-700/30 to-slate-600/20 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-white flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
            Strategy Preview
          </h4>
          <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-400 text-xs font-medium">Live Analysis</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-400 mb-4">
          {selectedIndicatorData?.label || selectedIndicator} strategy on {selectedTicker} with optimized parameters
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xl font-bold text-green-400 mb-1">{strategyMetrics.expectedReturn}</div>
            <div className="text-xs text-slate-400 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Expected Return
            </div>
          </motion.div>
          <motion.div 
            className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xl font-bold text-blue-400 mb-1">{strategyMetrics.sharpeRatio}</div>
            <div className="text-xs text-slate-400 flex items-center justify-center">
              <BarChart3 className="h-3 w-3 mr-1" />
              Sharpe Ratio
            </div>
          </motion.div>
          <motion.div 
            className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xl font-bold text-red-400 mb-1">{strategyMetrics.maxDrawdown}</div>
            <div className="text-xs text-slate-400 flex items-center justify-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              Max Drawdown
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link 
          href={`/results?mode=quick&ticker=${selectedTicker}&indicator=${selectedIndicator}&return=${encodeURIComponent(strategyMetrics.expectedReturn)}&sharpe=${strategyMetrics.sharpeRatio}&drawdown=${encodeURIComponent(strategyMetrics.maxDrawdown)}`} 
          className="flex-1"
        >
          <motion.button
            onClick={handleRunBacktest}
            disabled={isRunning}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-800 disabled:to-blue-900 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed relative overflow-hidden"
            whileHover={{ scale: isRunning ? 1 : 1.02 }}
            whileTap={{ scale: isRunning ? 1 : 0.98 }}
          >
            {isRunning && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent animate-pulse"></div>
            )}
            
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Running Backtest... {Math.round(progress)}%</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Start Backtesting</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </Link>
        
        <Link href="/strategy-builder">
          <motion.button
            className="px-6 py-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Open Advanced Strategy Builder"
          >
            <Maximize2 className="h-5 w-5 text-slate-300" />
          </motion.button>
        </Link>
      </div>
    </div>
  )
}
