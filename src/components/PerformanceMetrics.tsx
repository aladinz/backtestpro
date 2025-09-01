'use client'

import { motion } from 'framer-motion'
import { BarChart3, Target, TrendingUp, TrendingDown, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const performanceData = [
  { date: '8/26/2025', returns: 16.57, trades: 195, sharpe: 1.69 },
]

const monthlyData = [
  { month: 'Jan', return: 2.3 },
  { month: 'Feb', return: -1.2 },
  { month: 'Mar', return: 4.1 },
  { month: 'Apr', return: 1.8 },
  { month: 'May', return: -0.5 },
  { month: 'Jun', return: 3.2 },
  { month: 'Jul', return: 2.7 },
  { month: 'Aug', return: 4.9 },
]

export default function PerformanceMetrics() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Backtest Results</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Results</span>
        </motion.button>
      </div>
      
      <p className="text-gray-400">Comprehensive analysis of your trading strategy performance</p>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 p-6 rounded-lg border border-slate-700"
        >
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-gray-400 text-sm">Total Returns</span>
          </div>
          <div className="text-2xl font-bold text-green-400">+16.57%</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 p-6 rounded-lg border border-slate-700"
        >
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Sharpe Ratio</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">1.69</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 p-6 rounded-lg border border-slate-700"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-purple-400" />
            <span className="text-gray-400 text-sm">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">47.7%</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-800/50 p-6 rounded-lg border border-slate-700"
        >
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="h-5 w-5 text-orange-400" />
            <span className="text-gray-400 text-sm">Max Drawdown</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">-23.48%</div>
        </motion.div>
      </div>

      {/* Recent Backtests and Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Backtests */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-slate-800/50 p-6 rounded-lg border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Recent Backtests</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
              <div>
                <div className="font-semibold text-white">My Strategy</div>
                <div className="text-sm text-gray-400 flex items-center space-x-2">
                  <span>📅 8/26/2025</span>
                  <span>📊 195 trades</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">+16.57%</div>
                <div className="text-sm text-gray-400">Sharpe: 1.69</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-slate-800/50 p-6 rounded-lg border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Performance Breakdown</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-white">47.7%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '47.7%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Risk-Adjusted Returns</span>
                <span className="text-white">33.8%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '33.8%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Consistency Score</span>
                <span className="text-white">76.5%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76.5%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Trades</span>
                <span className="text-white">195</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Trade</span>
                <span className="text-white">0.08%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Best Month</span>
                <span className="text-green-400">+4.97%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Worst Month</span>
                <span className="text-red-400">-14.09%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
