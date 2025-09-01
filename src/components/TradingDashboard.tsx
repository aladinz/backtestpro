'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, AlertCircle, BarChart3, Calendar, PieChart, Shield, Zap } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import SectorRotation from '@/components/SectorRotation'
import RelativeStrengthScanner from '@/components/RelativeStrengthScanner'
import SwingTradeScreener from '@/components/SwingTradeScreener'
import RiskManagement from '@/components/RiskManagement'
import MarketBreadth from '@/components/MarketBreadth'
import AIInsights from '@/components/AIInsights'

export default function TradingDashboard() {
  const router = useRouter()
  const { 
    metrics, 
    assets, 
    isInitialized, 
    initializeDefaultPortfolio, 
    updateAssetPrices,
    lastOptimized 
  } = usePortfolioStore()

  // Initialize portfolio on first load
  useEffect(() => {
    if (!isInitialized) {
      initializeDefaultPortfolio()
    }
  }, [isInitialized, initializeDefaultPortfolio])

  // Update prices periodically for live data
  useEffect(() => {
    const updatePrices = () => {
      if (assets.length > 0) {
        const priceUpdates = assets.map(asset => ({
          symbol: asset.symbol,
          currentPrice: asset.currentPrice * (1 + (Math.random() - 0.5) * 0.002) // Small random movements
        }))
        updateAssetPrices(priceUpdates)
      }
    }

    const interval = setInterval(updatePrices, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [assets, updateAssetPrices])

  const portfolioMetrics = [
    { 
      label: 'Portfolio Value', 
      value: `$${metrics.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, 
      change: `${metrics.totalReturnPercent >= 0 ? '+' : ''}${metrics.totalReturnPercent.toFixed(1)}%`, 
      isPositive: metrics.totalReturnPercent >= 0 
    },
    { 
      label: 'Day P&L', 
      value: `${metrics.dayPL >= 0 ? '+' : ''}$${Math.abs(metrics.dayPL).toLocaleString('en-US', { maximumFractionDigits: 0 })}`, 
      change: `${metrics.dayPLPercent >= 0 ? '+' : ''}${metrics.dayPLPercent.toFixed(2)}%`, 
      isPositive: metrics.dayPL >= 0 
    },
    { 
      label: 'Total Return', 
      value: `${metrics.totalReturn >= 0 ? '+' : ''}$${Math.abs(metrics.totalReturn).toLocaleString('en-US', { maximumFractionDigits: 0 })}`, 
      change: `${metrics.totalReturnPercent >= 0 ? '+' : ''}${metrics.totalReturnPercent.toFixed(1)}%`, 
      isPositive: metrics.totalReturn >= 0 
    },
    { 
      label: 'Portfolio Assets', 
      value: `${assets.length}`, 
      change: lastOptimized ? 'Last optimized' : 'Default allocation', 
      isPositive: true 
    }
  ]

  const tradingAlerts = [
    { type: 'Strategy', message: 'MACD crossover signal on AAPL', time: '2 min ago', priority: 'high' },
    { type: 'Market', message: 'VIX below 15 - Low volatility environment', time: '15 min ago', priority: 'medium' },
    { type: 'Position', message: 'TSLA approaching stop loss level', time: '1 hour ago', priority: 'high' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Trading Dashboard</h2>
        <p className="text-gray-400">
          Your personal trading overview and market insights
        </p>
      </div>

      {/* Portfolio Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-400" />
            Portfolio Performance
          </h3>
          {lastOptimized && (
            <div className="flex items-center space-x-2 text-blue-400 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Live Portfolio (Optimized {new Date(lastOptimized).toLocaleDateString()})</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {portfolioMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-slate-800/50 p-4 rounded-lg border border-slate-700"
            >
              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
              <div className="text-xl font-bold text-white mb-1">{metric.value}</div>
              <div className={`text-sm flex items-center ${
                metric.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {metric.change}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Portfolio Composition */}
        {assets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 bg-slate-800/30 p-4 rounded-lg border border-slate-700"
          >
            <h4 className="text-lg font-medium text-white mb-3 flex items-center">
              <PieChart className="h-4 w-4 mr-2 text-blue-400" />
              Current Asset Allocation
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {assets.map((asset, index) => (
                <div key={asset.symbol} className="text-center">
                  <div className="text-sm font-medium text-white">{asset.symbol}</div>
                  <div className="text-xs text-gray-400 mb-1">{asset.category}</div>
                  <div className="text-sm text-blue-400 font-semibold">{asset.allocation.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">
                    ${asset.currentPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Swing Trading Signals & Trading Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Swing Trading Signals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Swing Trading Signals
          </h3>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-600/20 text-green-400">
                      BUY SIGNAL
                    </span>
                    <span className="font-bold text-white">AAPL</span>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
                <p className="text-sm text-gray-300 mb-1">Golden Cross: 50 MA crossed above 200 MA</p>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-green-400">RSI: 45 (Neutral)</span>
                  <span className="text-blue-400">Volume: +23%</span>
                  <span className="text-purple-400">Target: $235</span>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-600/20 text-orange-400">
                      WATCH
                    </span>
                    <span className="font-bold text-white">TSLA</span>
                  </div>
                  <span className="text-xs text-gray-500">5 min ago</span>
                </div>
                <p className="text-sm text-gray-300 mb-1">Approaching resistance at $250 level</p>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-yellow-400">RSI: 68 (Overbought)</span>
                  <span className="text-blue-400">Volume: Normal</span>
                  <span className="text-red-400">Stop: $240</span>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-red-600/20 text-red-400">
                      SELL SIGNAL
                    </span>
                    <span className="font-bold text-white">NVDA</span>
                  </div>
                  <span className="text-xs text-gray-500">8 min ago</span>
                </div>
                <p className="text-sm text-gray-300 mb-1">Double top pattern confirmed, breakdown below $175</p>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-red-400">RSI: 78 (Overbought)</span>
                  <span className="text-orange-400">Volume: +45%</span>
                  <span className="text-purple-400">Target: $165</span>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-600/20 text-blue-400">
                      MOMENTUM
                    </span>
                    <span className="font-bold text-white">MSFT</span>
                  </div>
                  <span className="text-xs text-gray-500">12 min ago</span>
                </div>
                <p className="text-sm text-gray-300 mb-1">Breaking out of ascending triangle pattern</p>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-green-400">RSI: 58 (Bullish)</span>
                  <span className="text-blue-400">Volume: +67%</span>
                  <span className="text-purple-400">Target: $440</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trading Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
            Trading Alerts
          </h3>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="space-y-4">
              {tradingAlerts.map((alert, index) => (
                <div key={index} className="border-l-2 border-yellow-400 pl-4 py-2">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.priority === 'high' 
                        ? 'bg-red-600/20 text-red-400' 
                        : 'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sector Rotation Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <SectorRotation />
      </motion.div>

      {/* Relative Strength Scanner & Market Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6 }}
          className="xl:col-span-2"
        >
          <RelativeStrengthScanner />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8 }}
          className="space-y-6"
        >
          {/* Market Leaders Compact View */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Today's Leaders
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-500/20 rounded border border-green-500/30">
                <span className="text-white font-medium">NVDA</span>
                <span className="text-green-400">+2.35%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-500/20 rounded border border-green-500/30">
                <span className="text-white font-medium">AAPL</span>
                <span className="text-green-400">+1.85%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-500/20 rounded border border-blue-500/30">
                <span className="text-white font-medium">META</span>
                <span className="text-blue-400">+1.45%</span>
              </div>
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-400" />
              Market Sentiment
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Bullish Stocks</span>
                <span className="text-green-400 font-medium">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">High RS Stocks</span>
                <span className="text-blue-400 font-medium">23%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Above 200 MA</span>
                <span className="text-purple-400 font-medium">82%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-xs text-gray-400 text-center">Market Strength: Strong Bullish</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Swing Trade Screener */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0 }}
      >
        <SwingTradeScreener />
      </motion.div>

      {/* Risk Management & Portfolio Protection */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.2 }}
          className="xl:col-span-2"
        >
          <RiskManagement />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.4 }}
          className="space-y-6"
        >
          {/* Risk Summary */}
          <RiskManagement compact />

          {/* Portfolio Protection Tips */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-400" />
              Protection Tips
            </h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>• Never risk more than 1-2% per trade</div>
              <div>• Set stops before entering positions</div>
              <div>• Size positions based on volatility</div>
              <div>• Limit sector concentration risk</div>
              <div>• Review risk metrics weekly</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Market Breadth Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6 }}
        className="mt-8"
      >
        <MarketBreadth />
      </motion.div>

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        className="mt-8"
      >
        <AIInsights />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-9 gap-4">
          <button 
            onClick={() => router.push('/strategy-builder')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-blue-500/50"
          >
            <Activity className="h-6 w-6 text-blue-400 mb-2" />
            <div className="text-white font-medium text-sm">Scan Strategies</div>
            <div className="text-gray-400 text-xs">Find opportunities</div>
          </button>
          <button 
            onClick={() => router.push('/swing-screener')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-cyan-500/50"
          >
            <Target className="h-6 w-6 text-cyan-400 mb-2" />
            <div className="text-white font-medium text-sm">Swing Screener</div>
            <div className="text-gray-400 text-xs">Perfect setups</div>
          </button>
          <button 
            onClick={() => router.push('/relative-strength')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-emerald-500/50"
          >
            <Target className="h-6 w-6 text-emerald-400 mb-2" />
            <div className="text-white font-medium text-sm">RS Scanner</div>
            <div className="text-gray-400 text-xs">Find strong stocks</div>
          </button>
          <button 
            onClick={() => router.push('/risk-management')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-red-500/50"
          >
            <Shield className="h-6 w-6 text-red-400 mb-2" />
            <div className="text-white font-medium text-sm">Risk Management</div>
            <div className="text-gray-400 text-xs">Protect capital</div>
          </button>
          <button 
            onClick={() => router.push('/portfolio-optimization')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-indigo-500/50"
          >
            <PieChart className="h-6 w-6 text-indigo-400 mb-2" />
            <div className="text-white font-medium text-sm">Portfolio Optimizer</div>
            <div className="text-gray-400 text-xs">Multi-asset allocation</div>
          </button>
          <button 
            onClick={() => router.push('/results')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-green-500/50"
          >
            <BarChart3 className="h-6 w-6 text-green-400 mb-2" />
            <div className="text-white font-medium text-sm">Analyze Trades</div>
            <div className="text-gray-400 text-xs">Review performance</div>
          </button>
          <button 
            onClick={() => window.open('https://finance.yahoo.com/calendar/earnings', '_blank')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-yellow-500/50"
          >
            <Calendar className="h-6 w-6 text-yellow-400 mb-2" />
            <div className="text-white font-medium text-sm">Market Calendar</div>
            <div className="text-gray-400 text-xs">Upcoming events</div>
          </button>
          <button 
            onClick={() => router.push('/library')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-purple-500/50"
          >
            <TrendingUp className="h-6 w-6 text-purple-400 mb-2" />
            <div className="text-white font-medium text-sm">Strategy Library</div>
            <div className="text-gray-400 text-xs">Pre-built strategies</div>
          </button>
          <button 
            onClick={() => router.push('/market-breadth')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-orange-500/50"
          >
            <Activity className="h-6 w-6 text-orange-400 mb-2" />
            <div className="text-white font-medium text-sm">Market Breadth</div>
            <div className="text-gray-400 text-xs">Market internals</div>
          </button>
          <button 
            onClick={() => router.push('/ai-insights')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-lg border border-slate-700 transition-colors text-left hover:border-cyan-500/50"
          >
            <Zap className="h-6 w-6 text-cyan-400 mb-2" />
            <div className="text-white font-medium text-sm">AI Insights</div>
            <div className="text-gray-400 text-xs">Smart recommendations</div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
