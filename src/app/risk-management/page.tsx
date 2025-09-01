'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import RiskManagement from '@/components/RiskManagement'
import { Shield, AlertTriangle, Calculator, Target, TrendingDown, BarChart3 } from 'lucide-react'

export default function RiskManagementPage() {
  // Position sizing calculator state
  const [accountSize, setAccountSize] = useState<string>('100000')
  const [riskPercent, setRiskPercent] = useState<string>('1.5')
  const [entryPrice, setEntryPrice] = useState<string>('230.16')
  const [stopLoss, setStopLoss] = useState<string>('225.00')
  const [calculatedShares, setCalculatedShares] = useState<number | null>(null)
  const [totalRiskAmount, setTotalRiskAmount] = useState<number | null>(null)
  const [positionValue, setPositionValue] = useState<number | null>(null)

  const calculatePositionSize = () => {
    const account = parseFloat(accountSize)
    const risk = parseFloat(riskPercent)
    const entry = parseFloat(entryPrice)
    const stop = parseFloat(stopLoss)

    if (!account || !risk || !entry || !stop) {
      alert('Please fill in all fields with valid numbers')
      return
    }

    if (entry <= stop) {
      alert('Entry price must be higher than stop loss for long positions')
      return
    }

    // Calculate risk amount in dollars
    const riskAmountDollars = (account * risk) / 100
    
    // Calculate risk per share
    const riskPerShare = entry - stop
    
    // Calculate position size in shares
    const shares = Math.floor(riskAmountDollars / riskPerShare)
    
    // Calculate total position value
    const totalValue = shares * entry

    setCalculatedShares(shares)
    setTotalRiskAmount(riskAmountDollars)
    setPositionValue(totalValue)
  }

  const resetCalculator = () => {
    setAccountSize('100000')
    setRiskPercent('1.5')
    setEntryPrice('')
    setStopLoss('')
    setCalculatedShares(null)
    setTotalRiskAmount(null)
    setPositionValue(null)
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Risk Management Center</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-4xl">
            Professional risk management tools to protect your capital and optimize position sizing. 
            Monitor portfolio risk, set appropriate stop losses, and maintain proper diversification for long-term success.
          </p>
        </motion.div>

        {/* Risk Management Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-medium">Position Sizing</h3>
            </div>
            <p className="text-sm text-gray-400">
              Never risk more than 1-2% of your portfolio on any single trade. Size positions based on volatility and stop loss distance.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <h3 className="text-white font-medium">Stop Loss Discipline</h3>
            </div>
            <p className="text-sm text-gray-400">
              Always set stop losses before entering trades. Use technical levels, not arbitrary percentages. Honor your stops religiously.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              <h3 className="text-white font-medium">Diversification</h3>
            </div>
            <p className="text-sm text-gray-400">
              Avoid over-concentration in any single sector or correlated positions. Spread risk across different market segments.
            </p>
          </div>
        </motion.div>

        {/* Risk Levels Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/20 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-400" />
            Understanding Risk Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-500/20 rounded border border-green-500/30">
              <h4 className="text-green-400 font-medium mb-2">Low Risk</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Volatility &lt; 25%</li>
                <li>• Beta &lt; 1.0</li>
                <li>• Stable companies</li>
                <li>• Blue chip stocks</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-500/20 rounded border border-yellow-500/30">
              <h4 className="text-yellow-400 font-medium mb-2">Medium Risk</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Volatility 25-40%</li>
                <li>• Beta 1.0-1.5</li>
                <li>• Growth companies</li>
                <li>• Standard positions</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-500/20 rounded border border-orange-500/30">
              <h4 className="text-orange-400 font-medium mb-2">High Risk</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Volatility 40-60%</li>
                <li>• Beta 1.5-2.0</li>
                <li>• Smaller positions</li>
                <li>• Tech/Growth stocks</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/20 rounded border border-red-500/30">
              <h4 className="text-red-400 font-medium mb-2">Extreme Risk</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Volatility &gt; 60%</li>
                <li>• Beta &gt; 2.0</li>
                <li>• Minimal positions</li>
                <li>• Speculative plays</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Main Risk Management Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <RiskManagement />
        </motion.div>

        {/* Professional Risk Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-400" />
              The 10 Commandments of Risk Management
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span>Never risk more than 1-2% of your account on any single trade</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Always set your stop loss BEFORE entering the trade</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span>Position size based on stop loss distance, not arbitrary amounts</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Limit sector concentration to avoid correlated losses</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">5.</span>
                <span>Higher volatility = smaller position size</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">6.</span>
                <span>Never move stops against you - only in your favor</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">7.</span>
                <span>Scale out of positions at resistance levels</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">8.</span>
                <span>Keep maximum portfolio risk below 10-12%</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">9.</span>
                <span>Use ATR for dynamic stop loss placement</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">10.</span>
                <span>Review and adjust risk parameters regularly</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-green-400" />
              Position Sizing Calculator
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Account Size ($)</label>
                <input 
                  type="number" 
                  value={accountSize}
                  onChange={(e) => setAccountSize(e.target.value)}
                  placeholder="100000"
                  className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Risk Per Trade (%)</label>
                <input 
                  type="number" 
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                  placeholder="1.5"
                  step="0.1"
                  min="0.1"
                  max="10"
                  className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 transition-colors"
                />
                <div className="text-xs text-gray-500 mt-1">Recommended: 1-2% for swing trading</div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Entry Price ($)</label>
                <input 
                  type="number" 
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="230.16"
                  step="0.01"
                  className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Stop Loss ($)</label>
                <input 
                  type="number" 
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="225.00"
                  step="0.01"
                  className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 transition-colors"
                />
                <div className="text-xs text-gray-500 mt-1">Must be below entry price for long positions</div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={calculatePositionSize}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition-colors"
                >
                  Calculate Position Size
                </button>
                <button 
                  onClick={resetCalculator}
                  className="px-4 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded font-medium transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Results Display */}
              {calculatedShares !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 p-4 rounded-lg">
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-green-400">{calculatedShares.toLocaleString()} Shares</div>
                      <div className="text-sm text-gray-400">Recommended Position Size</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Position Value:</div>
                        <div className="text-white font-semibold">${positionValue?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Risk Amount:</div>
                        <div className="text-red-400 font-semibold">${totalRiskAmount?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Risk per Share:</div>
                        <div className="text-yellow-400 font-semibold">${(parseFloat(entryPrice) - parseFloat(stopLoss)).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Portfolio %:</div>
                        <div className="text-blue-400 font-semibold">{((positionValue! / parseFloat(accountSize)) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 p-3 rounded text-xs text-gray-400">
                    <div className="font-semibold text-white mb-1">💡 Trading Tips:</div>
                    <div>• Always set your stop loss before entering the trade</div>
                    <div>• Consider market volatility when sizing positions</div>
                    <div>• Never risk more than you can afford to lose</div>
                    <div>• Review and adjust position sizes based on market conditions</div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
