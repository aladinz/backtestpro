'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowRight, Activity } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'

export default function PortfolioSummary() {
  const router = useRouter()
  const { 
    metrics, 
    assets, 
    isInitialized, 
    initializeDefaultPortfolio,
    lastOptimized 
  } = usePortfolioStore()

  // Initialize portfolio on first load
  useEffect(() => {
    if (!isInitialized) {
      initializeDefaultPortfolio()
    }
  }, [isInitialized, initializeDefaultPortfolio])

  const topAssets = assets.slice(0, 3) // Show top 3 assets

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <DollarSign className="h-6 w-6 mr-2 text-green-400" />
            Portfolio Overview
          </h2>
          {lastOptimized && (
            <p className="text-sm text-blue-400 mt-1">
              ● Live Portfolio (Optimized {new Date(lastOptimized).toLocaleDateString()})
            </p>
          )}
        </div>
        <motion.button
          onClick={() => router.push('/dashboard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <span>View Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Total Value</div>
          <div className="text-xl font-bold text-white">
            ${metrics.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div className={`text-sm flex items-center mt-1 ${
            metrics.totalReturnPercent >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {metrics.totalReturnPercent >= 0 ? 
              <TrendingUp className="h-3 w-3 mr-1" /> : 
              <TrendingDown className="h-3 w-3 mr-1" />
            }
            {metrics.totalReturnPercent >= 0 ? '+' : ''}{metrics.totalReturnPercent.toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Day P&L</div>
          <div className={`text-xl font-bold ${
            metrics.dayPL >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {metrics.dayPL >= 0 ? '+' : ''}${Math.abs(metrics.dayPL).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div className={`text-sm ${
            metrics.dayPLPercent >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {metrics.dayPLPercent >= 0 ? '+' : ''}{metrics.dayPLPercent.toFixed(2)}%
          </div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Assets</div>
          <div className="text-xl font-bold text-white">{assets.length}</div>
          <div className="text-sm text-blue-400">Diversified</div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Total Return</div>
          <div className={`text-xl font-bold ${
            metrics.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {metrics.totalReturn >= 0 ? '+' : ''}${Math.abs(metrics.totalReturn).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-gray-400">Since inception</div>
        </div>
      </div>

      {/* Top Holdings */}
      {topAssets.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
            Top Holdings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topAssets.map((asset, index) => (
              <div key={asset.symbol} className="bg-slate-700/20 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{asset.symbol}</span>
                  <span className="text-blue-400 text-sm font-medium">{asset.allocation.toFixed(1)}%</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">{asset.category}</div>
                <div className="text-sm text-gray-300">${asset.currentPrice.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Quick Actions</span>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push('/portfolio-optimization')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
            >
              <Activity className="h-3 w-3" />
              <span>Optimize</span>
            </button>
            <button 
              onClick={() => router.push('/strategy-builder')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Build Strategy
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Full Dashboard
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
