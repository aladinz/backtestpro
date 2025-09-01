'use client'

import { motion } from 'framer-motion'
import { Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Main Heading */}
      <div className="space-y-4">
        <h1 className="text-5xl lg:text-6xl font-bold text-white">
          Backtest Your{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Trading Strategies
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl">
          Professional-grade backtesting platform with real market data. 
          Test, optimize, and validate your trading strategies before risking capital.
        </p>
        
        {/* Special Collaboration Slogan */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 max-w-3xl"
        >
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-center">
            🌍 Welcome to the Ultimate Swing Trader's Arsenal Platform - Where Professional Trading Meets Innovation! ⚡
          </p>
          <p className="text-sm text-gray-400 text-center mt-2 italic">
            "Built with passion, powered by collaboration, designed for trading excellence"
          </p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/strategy-builder">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Zap className="h-5 w-5" />
            <span>Start Backtesting</span>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}
