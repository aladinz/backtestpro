'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, Target, Maximize2, Play, ChevronDown, Activity, BarChart3, TrendingDown, Waves, Zap, LineChart } from 'lucide-react'

export default function QuickStrategy() {
  const [selectedTicker, setSelectedTicker] = useState('AAPL')
  const [selectedIndicator, setSelectedIndicator] = useState('MACD')
  const [isTickerDropdownOpen, setIsTickerDropdownOpen] = useState(false)
  const [isIndicatorDropdownOpen, setIsIndicatorDropdownOpen] = useState(false)
  const [customTicker, setCustomTicker] = useState('')
  const [strategyMetrics, setStrategyMetrics] = useState({
    expectedReturn: '+12.4%',
    sharpeRatio: '1.8',
    maxDrawdown: '-8.2%'
  })

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX']
  
  const availableIndicators = [
    { value: 'MACD', label: 'MACD', icon: Activity, description: 'Moving Average Convergence Divergence' },
    { value: 'SMA', label: 'Simple Moving Average', icon: LineChart, description: 'Simple Moving Average crossover' },
    { value: 'RSI', label: 'RSI', icon: BarChart3, description: 'Relative Strength Index' },
    { value: 'BOLLINGER', label: 'Bollinger Bands', icon: Waves, description: 'Bollinger Bands squeeze' },
    { value: 'EMA', label: 'Exponential MA', icon: TrendingUp, description: 'Exponential Moving Average' },
    { value: 'STOCHASTIC', label: 'Stochastic', icon: Zap, description: 'Stochastic Oscillator' }
  ]

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

  const selectedIndicatorData = availableIndicators.find(ind => ind.value === selectedIndicator)
  const IconComponent = selectedIndicatorData?.icon || Activity

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Quick Strategy</h3>
      </div>

      <div className="space-y-6">
        {/* Ticker Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Ticker
          </label>
          <div className="relative">
            <button
              onClick={() => setIsTickerDropdownOpen(!isTickerDropdownOpen)}
              className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors flex items-center justify-between"
            >
              <span className="font-medium">{selectedTicker}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isTickerDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTickerDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-3 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Enter custom ticker..."
                    value={customTicker}
                    onChange={(e) => setCustomTicker(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomTickerSubmit()}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {popularStocks.map((ticker) => (
                    <button
                      key={ticker}
                      onClick={() => handleTickerSelect(ticker)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                    >
                      {ticker}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Indicator Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Indicator
          </label>
          <div className="relative">
            <button
              onClick={() => setIsIndicatorDropdownOpen(!isIndicatorDropdownOpen)}
              className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{selectedIndicatorData?.label}</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isIndicatorDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isIndicatorDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="max-h-60 overflow-y-auto">
                  {availableIndicators.map((indicator) => {
                    const IndicatorIcon = indicator.icon
                    return (
                      <button
                        key={indicator.value}
                        onClick={() => handleIndicatorSelect(indicator.value)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <IndicatorIcon className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-sm">{indicator.label}</div>
                            <div className="text-xs text-gray-500">{indicator.description}</div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Strategy Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Strategy Preview</h4>
          <p className="text-sm text-gray-600 mb-3">
            {selectedIndicatorData?.label || selectedIndicator} strategy on {selectedTicker} with default parameters
          </p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">{strategyMetrics.expectedReturn}</div>
              <div className="text-xs text-gray-500">Expected Return</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600">{strategyMetrics.sharpeRatio}</div>
              <div className="text-xs text-gray-500">Sharpe Ratio</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">{strategyMetrics.maxDrawdown}</div>
              <div className="text-xs text-gray-500">Max Drawdown</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link 
            href={`/results?mode=quick&ticker=${selectedTicker}&indicator=${selectedIndicator}&return=${encodeURIComponent(strategyMetrics.expectedReturn)}&sharpe=${strategyMetrics.sharpeRatio}&drawdown=${encodeURIComponent(strategyMetrics.maxDrawdown)}`} 
            className="flex-1"
          >
            <motion.button
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="h-4 w-4" />
              Start Backtesting
            </motion.button>
          </Link>
          
          <Link href="/strategy-builder">
            <motion.button
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Open Strategy Builder"
            >
              <Maximize2 className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
