'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import RelativeStrengthScanner from '@/components/RelativeStrengthScanner'
import { Search, TrendingUp, Target, Zap, Star, BarChart3 } from 'lucide-react'

export default function RelativeStrengthPage() {
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
            <Search className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Relative Strength Scanner</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-4xl">
            Discover the strongest stocks with superior relative performance. Find market leaders before they make big moves 
            by analyzing relative strength rankings, momentum patterns, and technical setups.
          </p>
        </motion.div>

        {/* Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <h3 className="text-white font-medium">Elite Performers</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">7</div>
            <p className="text-sm text-gray-400">
              Stocks with RS Rank 90+ showing exceptional relative strength
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h3 className="text-white font-medium">Bullish Trends</h3>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">8</div>
            <p className="text-sm text-gray-400">
              Stocks in confirmed bullish trends with strong momentum
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-medium">High Momentum</h3>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">6</div>
            <p className="text-sm text-gray-400">
              Stocks showing strong momentum with accelerating moves
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-purple-400" />
              <h3 className="text-white font-medium">Breakout Setups</h3>
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">4</div>
            <p className="text-sm text-gray-400">
              Stocks near key resistance with breakout potential
            </p>
          </div>
        </motion.div>

        {/* Trading Strategy Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/20 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
            Relative Strength Trading Strategy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">🎯 Target Criteria</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• RS Rank 80+ (Top 20% of market)</li>
                <li>• Strong momentum (accelerating moves)</li>
                <li>• Bullish trend confirmation</li>
                <li>• Above-average volume on breakouts</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">📈 Entry Signals</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Breakout above resistance levels</li>
                <li>• RS line making new highs</li>
                <li>• Volume surge on breakout</li>
                <li>• Technical pattern completion</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">⚠️ Risk Management</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Stop loss below support levels</li>
                <li>• Position size based on volatility</li>
                <li>• Exit if RS deteriorates significantly</li>
                <li>• Take profits at resistance zones</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Main Scanner Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <RelativeStrengthScanner />
        </motion.div>

        {/* Understanding Relative Strength */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-slate-800/30 p-6 rounded-lg border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Understanding Relative Strength</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">📊 RS Rank Explained</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-green-500/20 rounded border border-green-500/30">
                  <span className="text-white">90-100 (Elite)</span>
                  <span className="text-green-400">Top 10% - Exceptional strength</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-500/20 rounded border border-blue-500/30">
                  <span className="text-white">80-89 (Strong)</span>
                  <span className="text-blue-400">Top 20% - Above average</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-500/20 rounded border border-yellow-500/30">
                  <span className="text-white">70-79 (Good)</span>
                  <span className="text-yellow-400">Top 30% - Decent performer</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-500/20 rounded border border-orange-500/30">
                  <span className="text-white">60-69 (Average)</span>
                  <span className="text-orange-400">Middle of pack</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-500/20 rounded border border-red-500/30">
                  <span className="text-white">0-59 (Weak)</span>
                  <span className="text-red-400">Underperforming market</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">🎯 How to Use This Scanner</h4>
              <ol className="space-y-2 text-sm text-gray-400">
                <li><span className="text-blue-400 font-medium">1.</span> Start with top RS rank stocks (90+)</li>
                <li><span className="text-blue-400 font-medium">2.</span> Filter by sector based on rotation dashboard</li>
                <li><span className="text-blue-400 font-medium">3.</span> Look for bullish trend confirmation</li>
                <li><span className="text-blue-400 font-medium">4.</span> Check technical patterns for entry signals</li>
                <li><span className="text-blue-400 font-medium">5.</span> Verify volume and momentum strength</li>
                <li><span className="text-blue-400 font-medium">6.</span> Set stops below support levels</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
