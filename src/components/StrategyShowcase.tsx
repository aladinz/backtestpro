'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, Zap, Award, Timer, ArrowRight, Sparkles, BarChart3 } from 'lucide-react'
import Link from 'next/link'

interface StrategyResult {
  id: string
  name: string
  ticker: string
  return: number
  timeframe: string
  winRate: number
  trades: number
  status: 'hot' | 'proven' | 'new'
  category: string
}

const featuredStrategies: StrategyResult[] = [
  {
    id: 'macd-momentum',
    name: 'MACD Momentum Pro',
    ticker: 'AAPL',
    return: 24.7,
    timeframe: '3 months',
    winRate: 78,
    trades: 12,
    status: 'hot',
    category: 'Momentum'
  },
  {
    id: 'rsi-reversal',
    name: 'RSI Smart Reversal',
    ticker: 'TSLA',
    return: 31.2,
    timeframe: '6 weeks',
    winRate: 85,
    trades: 8,
    status: 'proven',
    category: 'Mean Reversion'
  },
  {
    id: 'breakout-master',
    name: 'Breakout Master',
    ticker: 'NVDA',
    return: 18.9,
    timeframe: '2 months',
    winRate: 72,
    trades: 15,
    status: 'hot',
    category: 'Breakout'
  },
  {
    id: 'sma-crossover',
    name: 'SMA Golden Cross',
    ticker: 'SPY',
    return: 12.4,
    timeframe: '4 months',
    winRate: 89,
    trades: 6,
    status: 'proven',
    category: 'Trend Following'
  }
]

const quickWins = [
  { metric: '2.3x', label: 'Avg Return Multiplier', icon: TrendingUp },
  { metric: '79%', label: 'Strategy Win Rate', icon: Target },
  { metric: '4.2s', label: 'Avg Backtest Time', icon: Timer },
  { metric: '127', label: 'Strategies Tested Today', icon: BarChart3 }
]

export default function StrategyShowcase() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'proven': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot': return <Zap className="h-3 w-3" />
      case 'proven': return <Award className="h-3 w-3" />
      case 'new': return <Sparkles className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
          Proven Strategy Performance
        </h2>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Real backtests, real results. See what's working in today's markets and start your own winning strategy.
        </p>
      </motion.div>

      {/* Quick Metrics */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {quickWins.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <motion.div
              key={metric.label}
              className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-xl border border-slate-600/50 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, borderColor: 'rgb(59 130 246 / 0.5)' }}
            >
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <IconComponent className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.metric}</div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Featured Strategy Results */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Award className="h-6 w-6 mr-3 text-yellow-400" />
            Top Performing Strategies
          </h3>
          <Link href="/library">
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore All Strategies</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Strategy Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-white group-hover:text-blue-200 transition-colors mb-1">
                    {strategy.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">{strategy.ticker}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{strategy.category}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center space-x-1 ${getStatusColor(strategy.status)}`}>
                  {getStatusIcon(strategy.status)}
                  <span className="capitalize">{strategy.status}</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Return</span>
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                    <span className="text-green-400 font-semibold">+{strategy.return}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Win Rate</span>
                  <span className="text-white font-medium">{strategy.winRate}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Trades</span>
                  <span className="text-slate-300">{strategy.trades}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Timeframe</span>
                  <span className="text-slate-300 text-sm">{strategy.timeframe}</span>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                className="w-full mt-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                whileHover={{ backgroundColor: 'rgb(37 99 235 / 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Test This Strategy</span>
                <ArrowRight className="h-3 w-3" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call-to-Action */}
      <motion.div
        className="text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Ready to Build Your Winning Strategy?
        </h3>
        <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
          Join thousands of traders using BacktestPro to discover profitable strategies. 
          Test your ideas with real market data in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/strategy-builder">
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-5 w-5" />
              <span>Build Custom Strategy</span>
            </motion.button>
          </Link>
          <Link href="/library">
            <motion.button
              className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Browse Strategy Library</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
