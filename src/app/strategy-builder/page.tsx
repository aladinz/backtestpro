'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Play, 
  Save, 
  Download,
  Plus,
  X,
  ChevronDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Indicator {
  id: string
  name: string
  type: 'trend' | 'momentum' | 'volatility' | 'volume'
  icon: string
  active: boolean
  parameters?: Record<string, number>
}

const availableIndicators: Indicator[] = [
  { id: 'sma', name: 'Simple Moving Average (20)', type: 'trend', icon: '📈', active: true, parameters: { period: 20 } },
  { id: 'rsi', name: 'RSI (14)', type: 'momentum', icon: '⚡', active: false, parameters: { period: 14 } },
  { id: 'macd', name: 'MACD', type: 'momentum', icon: '📊', active: true },
  { id: 'bb', name: 'Bollinger Bands', type: 'volatility', icon: '🔶', active: false, parameters: { period: 20, stdDev: 2 } },
  { id: 'volume', name: 'Volume Analysis', type: 'volume', icon: '�', active: false },
]

// Common ticker symbols with company names for validation
const knownTickers: Record<string, string> = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corporation',
  'NVDA': 'NVIDIA Corporation',
  'GOOGL': 'Alphabet Inc. Class A',
  'AMZN': 'Amazon.com Inc.',
  'TSLA': 'Tesla Inc.',
  'META': 'Meta Platforms Inc.',
  'BRK.B': 'Berkshire Hathaway Inc.',
  'SPY': 'SPDR S&P 500 ETF Trust',
  'QQQ': 'Invesco QQQ Trust',
  'IWM': 'iShares Russell 2000 ETF',
  'VTI': 'Vanguard Total Stock Market ETF',
  'AMD': 'Advanced Micro Devices Inc.',
  'SHOP': 'Shopify Inc.',
  'ROKU': 'Roku Inc.',
  'PLTR': 'Palantir Technologies Inc.',
  'XLF': 'Financial Select Sector SPDR Fund',
  'XLE': 'Energy Select Sector SPDR Fund',
  'XLK': 'Technology Select Sector SPDR Fund'
}

// Function to validate ticker symbol
const validateTicker = (ticker: string): { isValid: boolean; companyName?: string; suggestion?: string } => {
  if (!ticker || ticker.length < 1) {
    return { isValid: false }
  }
  
  const upperTicker = ticker.toUpperCase()
  
  // Check if it's a known ticker
  if (knownTickers[upperTicker]) {
    return { isValid: true, companyName: knownTickers[upperTicker] }
  }
  
  // Basic validation for ticker format
  if (upperTicker.length >= 1 && upperTicker.length <= 6 && /^[A-Z.]+$/.test(upperTicker)) {
    return { isValid: true, suggestion: 'Unknown ticker - verify before backtesting' }
  }
  
  return { isValid: false, suggestion: 'Invalid ticker format' }
}

export default function StrategyBuilder() {
  const router = useRouter()
  const [selectedAsset, setSelectedAsset] = useState('NVDA')
  const [customTicker, setCustomTicker] = useState('')
  const [useCustomTicker, setUseCustomTicker] = useState(false)
  const [strategyName, setStrategyName] = useState('My Strategy')
  const [indicators, setIndicators] = useState<Indicator[]>(availableIndicators)
  const [backtestPeriod, setBacktestPeriod] = useState('5 Years')
  const [initialCapital, setInitialCapital] = useState(10000)
  const [commission, setCommission] = useState(0.01)

  // Get the current ticker (either from dropdown or custom input)
  const getCurrentTicker = () => {
    return useCustomTicker ? customTicker.toUpperCase() : selectedAsset
  }

  // Get ticker validation info
  const getTickerValidation = () => {
    const currentTicker = getCurrentTicker()
    if (!useCustomTicker) {
      return { isValid: true, companyName: knownTickers[currentTicker] || currentTicker }
    }
    return validateTicker(currentTicker)
  }

  // Handle custom ticker input changes
  const handleCustomTickerChange = (value: string) => {
    // Only allow letters, dots, and convert to uppercase
    const cleanValue = value.replace(/[^a-zA-Z.]/g, '').toUpperCase()
    setCustomTicker(cleanValue)
  }

  // Handle running backtest with current strategy
  const handleRunBacktest = () => {
    const currentTicker = getCurrentTicker()
    const validation = getTickerValidation()
    
    if (!validation.isValid || !currentTicker) {
      alert('Please select a valid ticker symbol before running backtest.')
      return
    }

    const activeIndicators = indicators.filter(ind => ind.active)
    if (activeIndicators.length === 0) {
      alert('Please select at least one indicator for your strategy.')
      return
    }

    // Create strategy data to pass to results page
    const strategyData = {
      name: strategyName,
      ticker: currentTicker,
      indicators: activeIndicators.map(ind => ind.name),
      period: backtestPeriod,
      capital: initialCapital,
      commission: commission
    }

    // Navigate to results with strategy data
    const queryParams = new URLSearchParams({
      strategy: 'custom',
      ticker: currentTicker,
      name: strategyName,
      indicators: activeIndicators.map(ind => ind.id).join(','),
      period: backtestPeriod,
      capital: initialCapital.toString(),
      commission: commission.toString()
    }).toString()

    router.push(`/results?${queryParams}`)
  }

  const toggleIndicator = (id: string) => {
    setIndicators(prev => 
      prev.map(indicator => 
        indicator.id === id 
          ? { ...indicator, active: !indicator.active }
          : indicator
      )
    )
  }

  const activeIndicators = indicators.filter(i => i.active)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Build Your Strategy</h1>
          <p className="text-gray-400">
            Combine technical indicators and configure parameters to create your custom trading strategy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategy Configuration */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Strategy Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Strategy Name
                </label>
                <input
                  type="text"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Asset Selection
                </label>
                
                {/* Toggle between dropdown and custom input */}
                <div className="flex items-center space-x-4 mb-3">
                  <label className="flex items-center space-x-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name="assetMode"
                      checked={!useCustomTicker}
                      onChange={() => setUseCustomTicker(false)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span>Popular Assets</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name="assetMode"
                      checked={useCustomTicker}
                      onChange={() => setUseCustomTicker(true)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span>Custom Ticker</span>
                  </label>
                </div>

                {/* Dropdown for popular assets */}
                {!useCustomTicker && (
                  <div className="relative">
                    <select
                      value={selectedAsset}
                      onChange={(e) => setSelectedAsset(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="NVDA">NVDA - NVIDIA Corp.</option>
                      <option value="AAPL">AAPL - Apple Inc.</option>
                      <option value="TSLA">TSLA - Tesla Inc.</option>
                      <option value="MSFT">MSFT - Microsoft Corp.</option>
                      <option value="GOOGL">GOOGL - Alphabet Inc.</option>
                      <option value="AMZN">AMZN - Amazon.com Inc.</option>
                      <option value="SPY">SPY - SPDR S&P 500 ETF</option>
                      <option value="QQQ">QQQ - Invesco QQQ Trust</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                )}

                {/* Custom ticker input */}
                {useCustomTicker && (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={customTicker}
                        onChange={(e) => handleCustomTickerChange(e.target.value)}
                        placeholder="Enter ticker symbol (e.g., AMZN, AMD, DIS)"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={6}
                      />
                      {customTicker && (
                        <div className="absolute right-3 top-3">
                          {getTickerValidation().isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Validation feedback */}
                    {customTicker && (
                      <div className={`text-xs p-2 rounded ${
                        getTickerValidation().isValid 
                          ? 'bg-green-900/30 border border-green-700/50 text-green-300'
                          : 'bg-red-900/30 border border-red-700/50 text-red-300'
                      }`}>
                        {getTickerValidation().companyName && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>{getTickerValidation().companyName}</span>
                          </div>
                        )}
                        {getTickerValidation().suggestion && (
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{getTickerValidation().suggestion}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400">
                      💡 Tip: Enter any US stock symbol (AMZN, AMD, DIS, etc.) or ETF (VTI, IWM, etc.)
                    </p>
                  </div>
                )}

                {/* Current selection display */}
                <div className="mt-3 p-2 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Selected Asset:</span>
                    <span className="text-white font-medium">{getCurrentTicker() || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">
                  Quick Stats {getCurrentTicker() && `- ${getCurrentTicker()}`}
                </h3>
                {getCurrentTicker() ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ticker Symbol</span>
                      <span className="text-white font-medium">{getCurrentTicker()}</span>
                    </div>
                    {getTickerValidation().companyName && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Company</span>
                        <span className="text-white text-xs">{getTickerValidation().companyName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Validation</span>
                      <span className={`${getTickerValidation().isValid ? 'text-green-400' : 'text-red-400'}`}>
                        {getTickerValidation().isValid ? '✓ Valid' : '✗ Invalid'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data Available</span>
                      <span className="text-white">Historical + Real-time</span>
                    </div>
                    {useCustomTicker && getTickerValidation().suggestion && (
                      <div className="mt-3 p-2 bg-blue-900/20 border border-blue-700/30 rounded text-xs text-blue-300">
                        💡 {getTickerValidation().suggestion}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <span className="text-gray-400 text-sm">Select an asset to view stats</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Backtest Period
                  </label>
                  <select
                    value={backtestPeriod}
                    onChange={(e) => setBacktestPeriod(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="10 Years">10 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Initial Capital
                  </label>
                  <input
                    type="number"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Commission (per share)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Technical Indicators</h2>
            
            <div className="space-y-4">
              {indicators.map((indicator) => (
                <motion.div
                  key={indicator.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    indicator.active 
                      ? 'bg-blue-600/20 border-blue-500/50' 
                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => toggleIndicator(indicator.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{indicator.icon}</span>
                      <div>
                        <div className="text-white font-medium">{indicator.name}</div>
                        <div className="text-gray-400 text-sm capitalize">{indicator.type}</div>
                      </div>
                    </div>
                    
                    {indicator.active && (
                      <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Active
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full mt-6 bg-slate-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-slate-600 transition-colors border-2 border-dashed border-slate-600"
            >
              <Plus className="h-4 w-4" />
              <span>Add Custom Indicator</span>
            </motion.button>
          </motion.div>

          {/* Strategy Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Strategy Preview</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-3">Selected Indicators</h3>
                <div className="space-y-2">
                  {activeIndicators.length > 0 ? (
                    activeIndicators.map((indicator) => (
                      <motion.div 
                        key={indicator.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between p-3 rounded bg-slate-700/30 border border-slate-600"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{indicator.icon}</span>
                          <div>
                            <span className="text-white font-medium">{indicator.name}</span>
                            <div className="text-xs text-gray-400 capitalize">{indicator.type}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleIndicator(indicator.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Remove indicator"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-500 text-center py-6 border-2 border-dashed border-slate-600 rounded-lg"
                    >
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p>No indicators selected</p>
                      <p className="text-sm mt-1">Select indicators from the left panel</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Strategy Summary */}
              <div className="bg-slate-700/20 p-4 rounded-lg border border-slate-600">
                <h4 className="text-white font-medium mb-3">Strategy Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Asset:</span>
                      <span className="text-white font-medium">{getCurrentTicker()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Period:</span>
                      <span className="text-white">{backtestPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Indicators:</span>
                      <span className="text-blue-400 font-medium">{activeIndicators.length}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Capital:</span>
                      <span className="text-green-400 font-medium">${initialCapital.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Commission:</span>
                      <span className="text-white">${commission}/share</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-medium ${
                        getCurrentTicker() && getTickerValidation().isValid && activeIndicators.length > 0
                          ? 'text-green-400' 
                          : 'text-orange-400'
                      }`}>
                        {getCurrentTicker() && getTickerValidation().isValid && activeIndicators.length > 0
                          ? 'Ready' 
                          : 'Incomplete'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticker Validation Display */}
              {useCustomTicker && (
                <div className="bg-slate-700/20 p-3 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Ticker Validation:</span>
                    <div className="flex items-center space-x-2">
                      {getTickerValidation().isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        getTickerValidation().isValid ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {getTickerValidation().isValid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                  </div>
                  {getTickerValidation().companyName && (
                    <div className="text-xs text-blue-400 mt-1">
                      {getTickerValidation().companyName}
                    </div>
                  )}
                  {getTickerValidation().suggestion && (
                    <div className="text-xs text-yellow-400 mt-1">
                      {getTickerValidation().suggestion}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <motion.button
                  onClick={handleRunBacktest}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${
                    getCurrentTicker() && getTickerValidation().isValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!getCurrentTicker() || !getTickerValidation().isValid}
                >
                  <Play className="h-4 w-4" />
                  <span>Run Backtest</span>
                </motion.button>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
