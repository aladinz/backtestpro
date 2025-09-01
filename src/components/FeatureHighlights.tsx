'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, BarChart3, Clock, Target, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FeatureHighlights() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute backtests in seconds with our optimized engine',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Shield,
      title: 'Institutional Data',
      description: 'Access the same data sources used by hedge funds',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive risk metrics and performance attribution',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Live market data with millisecond precision',
      color: 'from-green-400 to-teal-400'
    },
    {
      icon: Target,
      title: 'Precise Execution',
      description: 'Account for slippage, fees, and market impact',
      color: 'from-red-400 to-orange-400'
    },
    {
      icon: TrendingUp,
      title: 'Strategy Optimization',
      description: 'AI-powered parameter tuning and walk-forward analysis',
      color: 'from-indigo-400 to-purple-400'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Why Choose BacktestPro?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Built for serious traders who need reliable, accurate, and fast backtesting capabilities
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="group bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} bg-opacity-20`}>
                  <IconComponent className={`h-6 w-6 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center pt-8"
      >
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-6">
            Join thousands of traders who trust BacktestPro for their strategy validation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/strategy-builder">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>Build Strategy</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
            <Link href="/results">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>View Sample Results</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
