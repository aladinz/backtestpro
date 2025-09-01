'use client'

import { motion } from 'framer-motion'
import { Shield, AlertTriangle, TrendingDown, Calculator, Target, BarChart3, DollarSign, Percent, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

// Risk management data structures
interface PositionRisk {
  symbol: string
  name: string
  price: number
  shares: number
  value: number
  stopLoss: number
  riskAmount: number
  riskPercent: number
  portfolioPercent: number
  atr: number
  volatility: number
  beta: number
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
  recommendedSize: number
  currentSize: number
  sizeStatus: 'optimal' | 'oversized' | 'undersized'
}

interface PortfolioRisk {
  totalValue: number
  totalRisk: number
  riskPercent: number
  maxDrawdown: number
  sharpeRatio: number
  beta: number
  correlationRisk: number
  sectorConcentration: { [key: string]: number }
  riskBudget: number
  availableRisk: number
}

const positions: PositionRisk[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 230.16,
    shares: 50,
    value: 11508,
    stopLoss: 225.00,
    riskAmount: 258,
    riskPercent: 2.24,
    portfolioPercent: 11.5,
    atr: 4.25,
    volatility: 0.24,
    beta: 1.15,
    riskLevel: 'medium',
    recommendedSize: 10800,
    currentSize: 11508,
    sizeStatus: 'optimal'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 181.45,
    shares: 30,
    value: 5443.50,
    stopLoss: 175.50,
    riskAmount: 178.50,
    riskPercent: 3.28,
    portfolioPercent: 5.4,
    atr: 6.80,
    volatility: 0.42,
    beta: 1.68,
    riskLevel: 'high',
    recommendedSize: 4500,
    currentSize: 5443.50,
    sizeStatus: 'oversized'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 504.88,
    shares: 15,
    value: 7573.20,
    stopLoss: 495.00,
    riskAmount: 148.20,
    riskPercent: 1.96,
    portfolioPercent: 7.6,
    atr: 8.50,
    volatility: 0.21,
    beta: 0.95,
    riskLevel: 'low',
    recommendedSize: 8000,
    currentSize: 7573.20,
    sizeStatus: 'undersized'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.50,
    shares: 25,
    value: 6212.50,
    stopLoss: 240.00,
    riskAmount: 212.50,
    riskPercent: 3.42,
    portfolioPercent: 6.2,
    atr: 12.30,
    volatility: 0.58,
    beta: 2.15,
    riskLevel: 'extreme',
    recommendedSize: 4000,
    currentSize: 6212.50,
    sizeStatus: 'oversized'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 642.25,
    shares: 10,
    value: 6422.50,
    stopLoss: 620.00,
    riskAmount: 222.50,
    riskPercent: 3.47,
    portfolioPercent: 6.4,
    atr: 15.60,
    volatility: 0.35,
    beta: 1.32,
    riskLevel: 'medium',
    recommendedSize: 6500,
    currentSize: 6422.50,
    sizeStatus: 'optimal'
  }
]

const portfolioRisk: PortfolioRisk = {
  totalValue: 100000,
  totalRisk: 1420,
  riskPercent: 1.42,
  maxDrawdown: -8.5,
  sharpeRatio: 1.85,
  beta: 1.28,
  correlationRisk: 0.65,
  sectorConcentration: {
    'Technology': 68.5,
    'Consumer Discretionary': 12.6,
    'Communication Services': 6.4,
    'Cash': 12.5
  },
  riskBudget: 2000, // 2% of portfolio
  availableRisk: 580
}

interface RiskManagementProps {
  compact?: boolean
}

export default function RiskManagement({ compact = false }: RiskManagementProps) {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [riskBudget, setRiskBudget] = useState(2.0) // 2% default
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'extreme': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400'
    }
  }

  const getSizeStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400'
      case 'oversized': return 'text-red-400'
      case 'undersized': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const calculateOptimalSize = (price: number, stopLoss: number, riskAmount: number) => {
    const riskPerShare = price - stopLoss
    if (riskPerShare <= 0) return 0
    return Math.floor(riskAmount / riskPerShare)
  }

  if (!mounted) return null

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-400" />
          Portfolio Risk
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Total Risk</span>
            <span className="text-white font-medium">{portfolioRisk.riskPercent.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Max Drawdown</span>
            <span className="text-red-400 font-medium">{portfolioRisk.maxDrawdown}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Sharpe Ratio</span>
            <span className="text-green-400 font-medium">{portfolioRisk.sharpeRatio}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${(portfolioRisk.totalRisk / portfolioRisk.riskBudget) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Risk Budget: {((portfolioRisk.totalRisk / portfolioRisk.riskBudget) * 100).toFixed(0)}% Used
          </p>
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
            <Shield className="h-6 w-6 mr-2 text-blue-400" />
            Risk Management Center
          </h2>
          <p className="text-sm text-blue-400 mt-1">
            Protect your capital with professional risk controls and position sizing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Risk Budget:</span>
          <input 
            type="number"
            step="0.1"
            value={riskBudget}
            onChange={(e) => setRiskBudget(Number(e.target.value))}
            className="w-16 bg-slate-800 text-white px-2 py-1 rounded border border-slate-600 focus:border-blue-500 text-sm"
          />
          <span className="text-gray-400 text-sm">%</span>
        </div>
      </div>

      {/* Portfolio Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Total Risk</h4>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {portfolioRisk.riskPercent.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-400">
            ${portfolioRisk.totalRisk.toLocaleString()} at risk
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                portfolioRisk.riskPercent > 2.5 ? 'bg-red-500' :
                portfolioRisk.riskPercent > 2.0 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((portfolioRisk.riskPercent / 3) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Max Drawdown</h4>
            <TrendingDown className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mb-1">
            {portfolioRisk.maxDrawdown}%
          </div>
          <div className="text-sm text-gray-400">
            Worst case scenario
          </div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Sharpe Ratio</h4>
            <BarChart3 className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">
            {portfolioRisk.sharpeRatio}
          </div>
          <div className="text-sm text-gray-400">
            Risk-adjusted returns
          </div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Portfolio Beta</h4>
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {portfolioRisk.beta}
          </div>
          <div className="text-sm text-gray-400">
            Market sensitivity
          </div>
        </div>
      </div>

      {/* Position Risk Analysis */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-400" />
          Position Risk Analysis
        </h3>
        <div className="space-y-3">
          {positions.map((position, index) => (
            <motion.div
              key={position.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border hover:bg-slate-700/30 transition-colors cursor-pointer ${
                selectedPosition === position.symbol ? 'bg-slate-700/50 border-blue-500/50' : 'bg-slate-700/20 border-slate-600'
              }`}
              onClick={() => setSelectedPosition(selectedPosition === position.symbol ? null : position.symbol)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                {/* Stock Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-lg">{position.symbol}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(position.riskLevel)}`}>
                          {position.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">{position.name}</div>
                    </div>
                  </div>
                </div>

                {/* Position Details */}
                <div>
                  <div className="text-lg font-semibold text-white">${position.price.toFixed(2)}</div>
                  <div className="text-sm text-gray-400">{position.shares} shares</div>
                  <div className="text-xs text-blue-400">${position.value.toLocaleString()}</div>
                </div>

                {/* Risk Amount */}
                <div>
                  <div className="text-lg font-bold text-red-400">${position.riskAmount.toFixed(0)}</div>
                  <div className="text-sm text-gray-400">Risk Amount</div>
                  <div className="text-xs text-red-400">{position.riskPercent.toFixed(2)}% of portfolio</div>
                </div>

                {/* Stop Loss */}
                <div>
                  <div className="text-sm font-medium text-white">${position.stopLoss.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Stop Loss</div>
                  <div className="text-xs text-red-400">
                    -{((position.price - position.stopLoss) / position.price * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Volatility */}
                <div>
                  <div className="text-sm font-medium text-white">{(position.volatility * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Volatility</div>
                  <div className="text-xs text-gray-400">ATR: ${position.atr.toFixed(2)}</div>
                </div>

                {/* Position Size Status */}
                <div>
                  <div className={`text-sm font-medium ${getSizeStatusColor(position.sizeStatus)}`}>
                    {position.sizeStatus.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">Size Status</div>
                  <div className="text-xs text-gray-400">
                    Rec: ${position.recommendedSize.toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors mb-2">
                    Optimize
                  </button>
                  <div className="text-xs text-gray-400">
                    Portfolio: {position.portfolioPercent.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedPosition === position.symbol && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-slate-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/30 p-3 rounded">
                      <h5 className="text-white font-medium mb-2">Position Sizing</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Size:</span>
                          <span className="text-white">${position.currentSize.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Recommended:</span>
                          <span className="text-blue-400">${position.recommendedSize.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Optimal Shares:</span>
                          <span className="text-green-400">
                            {calculateOptimalSize(position.price, position.stopLoss, (portfolioRisk.totalValue * riskBudget / 100) / positions.length)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/30 p-3 rounded">
                      <h5 className="text-white font-medium mb-2">Risk Metrics</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Beta:</span>
                          <span className="text-white">{position.beta}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ATR:</span>
                          <span className="text-white">${position.atr.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Risk per Share:</span>
                          <span className="text-red-400">${(position.price - position.stopLoss).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/30 p-3 rounded">
                      <h5 className="text-white font-medium mb-2">Recommendations</h5>
                      <div className="space-y-1 text-xs text-gray-400">
                        {position.sizeStatus === 'oversized' && (
                          <div className="text-red-400">• Consider reducing position size</div>
                        )}
                        {position.sizeStatus === 'undersized' && (
                          <div className="text-blue-400">• Consider increasing position size</div>
                        )}
                        {position.riskLevel === 'extreme' && (
                          <div className="text-red-400">• High volatility - use smaller size</div>
                        )}
                        <div className="text-gray-400">• Set stop loss at ${position.stopLoss.toFixed(2)}</div>
                        <div className="text-gray-400">• Monitor correlation with other tech positions</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risk Budget and Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-green-400" />
            Risk Budget Analysis
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Risk Budget:</span>
              <span className="text-white font-medium">${(portfolioRisk.totalValue * riskBudget / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Used:</span>
              <span className="text-red-400 font-medium">${portfolioRisk.totalRisk.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Available:</span>
              <span className="text-green-400 font-medium">${((portfolioRisk.totalValue * riskBudget / 100) - portfolioRisk.totalRisk).toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  (portfolioRisk.totalRisk / (portfolioRisk.totalValue * riskBudget / 100)) > 0.9 ? 'bg-red-500' :
                  (portfolioRisk.totalRisk / (portfolioRisk.totalValue * riskBudget / 100)) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((portfolioRisk.totalRisk / (portfolioRisk.totalValue * riskBudget / 100)) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-400">
              {((portfolioRisk.totalRisk / (portfolioRisk.totalValue * riskBudget / 100)) * 100).toFixed(0)}% of risk budget used
            </p>
          </div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-400" />
            Sector Concentration
          </h4>
          <div className="space-y-3">
            {Object.entries(portfolioRisk.sectorConcentration).map(([sector, percent]) => (
              <div key={sector} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{sector}</span>
                  <span className="text-white font-medium">{percent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      percent > 50 ? 'bg-red-500' :
                      percent > 30 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          {portfolioRisk.sectorConcentration['Technology'] > 50 && (
            <div className="mt-3 p-2 bg-red-500/20 rounded border border-red-500/30">
              <p className="text-red-400 text-xs">⚠️ High tech concentration risk</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
