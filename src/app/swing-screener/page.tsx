'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import SwingTradeScreener from '@/components/SwingTradeScreener'
import { Filter, Target, TrendingUp, Zap, BarChart3, Activity } from 'lucide-react'

export default function SwingTradeScreenerPage() {
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
            <Filter className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Swing Trade Screener</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-4xl">
            Advanced screening for high-probability swing trading setups. Filter by technical patterns, 
            risk/reward ratios, volume characteristics, and fundamental catalysts to find your next winning trade.
          </p>
        </motion.div>

        {/* Setup Types Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 text-center">
            <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-white font-medium text-sm">Cup & Handle</h3>
            <p className="text-xs text-gray-400 mt-1">Classic breakout pattern</p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 text-center">
            <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-white font-medium text-sm">Bull Flag</h3>
            <p className="text-xs text-gray-400 mt-1">Continuation pattern</p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 text-center">
            <BarChart3 className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-medium text-sm">Triangle</h3>
            <p className="text-xs text-gray-400 mt-1">Ascending breakout</p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 text-center">
            <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-white font-medium text-sm">Breakout</h3>
            <p className="text-xs text-gray-400 mt-1">Momentum explosion</p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 text-center">
            <Activity className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <h3 className="text-white font-medium text-sm">Momentum</h3>
            <p className="text-xs text-gray-400 mt-1">Strong trending stocks</p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 text-center">
            <Filter className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <h3 className="text-white font-medium text-sm">Pullback</h3>
            <p className="text-xs text-gray-400 mt-1">Buy the dip opportunity</p>
          </div>
        </motion.div>

        {/* Screening Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/20 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-400" />
            Professional Swing Trading Screening Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">🎯 1. Pattern Recognition</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Cup & Handle formations</li>
                <li>• Bull flag continuations</li>
                <li>• Triangle breakouts</li>
                <li>• Pullback to support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">📊 2. Technical Filters</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• RSI 30-70 range (not overbought)</li>
                <li>• Above key moving averages</li>
                <li>• MACD bullish signals</li>
                <li>• Volume surge confirmation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">⚖️ 3. Risk Management</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Minimum 2:1 risk/reward</li>
                <li>• Clear support levels</li>
                <li>• Defined resistance targets</li>
                <li>• ATR-based position sizing</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">📅 4. Catalyst Timing</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Earnings announcement dates</li>
                <li>• Sector rotation momentum</li>
                <li>• Relative strength leaders</li>
                <li>• Market environment</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Main Screener Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <SwingTradeScreener />
        </motion.div>

        {/* Trading Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">💡 Setup Quality Guidelines</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-500/20 rounded border border-green-500/30">
                <h4 className="text-green-400 font-medium">Excellent Setups</h4>
                <p className="text-sm text-gray-300 mt-1">
                  Perfect technical pattern + strong volume + favorable R/R + bullish sector
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded border border-blue-500/30">
                <h4 className="text-blue-400 font-medium">Good Setups</h4>
                <p className="text-sm text-gray-300 mt-1">
                  Solid pattern + decent volume + good R/R + neutral to positive sector
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded border border-yellow-500/30">
                <h4 className="text-yellow-400 font-medium">Fair Setups</h4>
                <p className="text-sm text-gray-300 mt-1">
                  Basic pattern + average volume + acceptable R/R + mixed signals
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">⚠️ Risk Management Rules</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-medium">1.</span>
                <span>Never risk more than 1-2% of portfolio per trade</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-medium">2.</span>
                <span>Always set stop loss below key support levels</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-medium">3.</span>
                <span>Target minimum 2:1 risk/reward ratio</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-medium">4.</span>
                <span>Scale out of positions at resistance levels</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-medium">5.</span>
                <span>Avoid earnings plays unless specifically targeting them</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-medium">6.</span>
                <span>Confirm with multiple timeframes before entry</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
