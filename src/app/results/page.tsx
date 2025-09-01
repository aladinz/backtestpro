'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  DollarSign,
  BarChart3,
  Target,
  Activity,
  Filter,
  Share2,
  ArrowLeft,
  Zap
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

// Function to generate equity curve data based on initial capital
const generateEquityCurveData = (initialCapital: number, totalReturn: number) => {
  const finalValue = initialCapital * (1 + totalReturn / 100)
  const monthlyGrowth = Math.pow(1 + totalReturn / 100, 1/8) - 1 // 8 months of data
  
  return [
    { date: 'Jan', portfolio: initialCapital, benchmark: initialCapital },
    { date: 'Feb', portfolio: Math.round(initialCapital * Math.pow(1 + monthlyGrowth, 1)), benchmark: Math.round(initialCapital * 0.995) },
    { date: 'Mar', portfolio: Math.round(initialCapital * Math.pow(1 + monthlyGrowth, 2)), benchmark: Math.round(initialCapital * 1.01) },
    { date: 'Apr', portfolio: Math.round(initialCapital * Math.pow(1 + monthlyGrowth, 3)), benchmark: Math.round(initialCapital * 1.005) },
    { date: 'May', portfolio: Math.round(initialCapital * Math.pow(1 + monthlyGrowth, 4)), benchmark: Math.round(initialCapital * 1.02) },
    { date: 'Jun', portfolio: Math.round(initialCapital * Math.pow(1 + monthlyGrowth, 5)), benchmark: Math.round(initialCapital * 1.035) },
    { date: 'Jul', portfolio: Math.round(initialCapital * Math.pow(1 + monthlyGrowth, 6)), benchmark: Math.round(initialCapital * 1.04) },
    { date: 'Aug', portfolio: Math.round(finalValue), benchmark: Math.round(initialCapital * 1.05) },
  ]
}

const monthlyReturns = [
  { month: 'Jan', return: 2.3 },
  { month: 'Feb', return: -1.2 },
  { month: 'Mar', return: 4.1 },
  { month: 'Apr', return: 1.8 },
  { month: 'May', return: -0.5 },
  { month: 'Jun', return: 3.2 },
  { month: 'Jul', return: 2.7 },
  { month: 'Aug', return: 4.9 },
]

const drawdownData = [
  { date: 'Jan', drawdown: 0 },
  { date: 'Feb', drawdown: -2.1 },
  { date: 'Mar', drawdown: 0 },
  { date: 'Apr', drawdown: -2.6 },
  { date: 'May', drawdown: 0 },
  { date: 'Jun', drawdown: -1.2 },
  { date: 'Jul', drawdown: 0 },
  { date: 'Aug', drawdown: -0.8 },
]

const trades = [
  { id: 1, date: '2025-08-25', symbol: 'NVDA', type: 'BUY', quantity: 100, price: 248.50, pnl: 1250, status: 'Closed' },
  { id: 2, date: '2025-08-24', symbol: 'NVDA', type: 'SELL', quantity: 100, price: 261.00, pnl: -850, status: 'Closed' },
  { id: 3, date: '2025-08-23', symbol: 'NVDA', type: 'BUY', quantity: 100, price: 242.75, pnl: 2100, status: 'Closed' },
  { id: 4, date: '2025-08-22', symbol: 'NVDA', type: 'SELL', quantity: 100, price: 255.80, pnl: 1675, status: 'Closed' },
  { id: 5, date: '2025-08-21', symbol: 'NVDA', type: 'BUY', quantity: 100, price: 239.15, pnl: 975, status: 'Closed' },
]

// Quick Backtest Content Component
function QuickBacktestContent({ quickData, ticker, indicator }: { 
  quickData: any, 
  ticker: string, 
  indicator: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-8"
    >
      {/* Quick Equity Curve */}
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6">Strategy Performance</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={quickData.equityCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                stroke="#10B981" 
                strokeWidth={3}
                name={`${indicator} Strategy`}
              />
              <Line 
                type="monotone" 
                dataKey="benchmark" 
                stroke="#6B7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Benchmark"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Breakdown - Keep this section as requested */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Performance Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Strategy</span>
              <span className="text-white">{indicator} on {ticker}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Period</span>
              <span className="text-white">4 Months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Trades</span>
              <span className="text-white">{quickData.trades.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Trade Duration</span>
              <span className="text-white">2.5 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Commission</span>
              <span className="text-white">$0.005/share</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Quick Trade History</h3>
          <div className="space-y-3">
            {quickData.trades.map((trade: any) => (
              <div key={trade.id} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                <div>
                  <div className="text-white font-medium">{trade.symbol}</div>
                  <div className="text-xs text-gray-400">{trade.date}</div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl > 0 ? '+' : ''}${trade.pnl}
                  </div>
                  <div className="text-xs text-gray-400">{trade.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 justify-center">
        <Link href="/strategy-builder">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Target className="h-4 w-4" />
            <span>Build Full Strategy</span>
          </motion.button>
        </Link>
        
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-slate-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-slate-600 transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Try Another Quick Test</span>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

function Results() {
  const [activeTab, setActiveTab] = useState<'overview' | 'trades' | 'analysis'>('overview')
  const searchParams = useSearchParams()
  
  // Check if this is a quick backtest
  const isQuickBacktest = searchParams.get('mode') === 'quick'
  const quickTicker = searchParams.get('ticker') || 'AAPL'
  const quickIndicator = searchParams.get('indicator') || 'MACD'
  const quickReturn = searchParams.get('return') || '+12.4%'
  const quickSharpe = searchParams.get('sharpe') || '1.8'
  const quickDrawdown = searchParams.get('drawdown') || '-8.2%'
  
  // Get strategy builder parameters
  const strategyName = searchParams.get('name') || 'Custom Strategy'
  const initialCapital = parseFloat(searchParams.get('capital') || '10000')
  const commission = parseFloat(searchParams.get('commission') || '0.01')
  
  // Calculate dollar gains
  const calculateDollarGains = (returnPercent: string, capital: number) => {
    const cleanReturn = parseFloat(returnPercent.replace(/[+%]/g, ''))
    const dollarGain = (capital * cleanReturn) / 100
    const finalValue = capital + dollarGain
    return {
      dollarGain: dollarGain,
      finalValue: finalValue,
      formattedGain: dollarGain >= 0 ? `+$${dollarGain.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : `-$${Math.abs(dollarGain).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      formattedFinal: `$${finalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }
  }

  // Generate quick backtest data based on the strategy
  const generateQuickData = () => {
    const baseValue = initialCapital
    const returnPercent = parseFloat(quickReturn.replace(/[+%]/g, '')) / 100
    const finalValue = baseValue * (1 + returnPercent)
    
    return {
      equityCurve: [
        { date: 'Start', portfolio: baseValue, benchmark: baseValue },
        { date: 'Month 1', portfolio: baseValue * 1.02, benchmark: baseValue * 1.005 },
        { date: 'Month 2', portfolio: baseValue * 1.05, benchmark: baseValue * 1.01 },
        { date: 'Month 3', portfolio: baseValue * 1.08, benchmark: baseValue * 1.015 },
        { date: 'End', portfolio: finalValue, benchmark: baseValue * 1.02 },
      ],
      trades: [
        { id: 1, date: '2025-08-26', symbol: quickTicker, type: 'BUY', quantity: 100, price: 250.00, pnl: 1250, status: 'Closed' },
        { id: 2, date: '2025-08-25', symbol: quickTicker, type: 'SELL', quantity: 100, price: 262.50, pnl: -800, status: 'Closed' },
        { id: 3, date: '2025-08-24', symbol: quickTicker, type: 'BUY', quantity: 100, price: 245.75, pnl: 1650, status: 'Closed' },
      ]
    }
  }

  const quickData = isQuickBacktest ? generateQuickData() : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            {isQuickBacktest && (
              <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-2 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            )}
            <div className="flex items-center gap-3 mb-2">
              {isQuickBacktest && <Zap className="h-8 w-8 text-yellow-400" />}
              <h1 className="text-4xl font-bold text-white">
                {isQuickBacktest ? 'Quick Backtest Results' : 'Backtest Results'}
              </h1>
            </div>
            <p className="text-gray-400">
              {isQuickBacktest 
                ? `Quick analysis of your ${quickIndicator} strategy on ${quickTicker} performance`
                : 'Comprehensive analysis of your trading strategy performance'
              }
            </p>
            {isQuickBacktest && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                <Zap className="h-3 w-3 mr-1" />
                Quick Strategy: {quickIndicator} on {quickTicker}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-600 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Results</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-gray-400 text-sm">Total Returns</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {isQuickBacktest ? quickReturn : '+16.57%'}
            </div>
            <div className="text-sm text-gray-500 mb-1">vs benchmark: +5.0%</div>
            {/* Dollar gains calculation */}
            <div className="mt-2 pt-2 border-t border-slate-600">
              <div className="text-xs text-gray-400 mb-1">Dollar Gains:</div>
              <div className="text-lg font-semibold text-green-300">
                {(() => {
                  const currentReturn = isQuickBacktest ? quickReturn : '+16.57%'
                  const gains = calculateDollarGains(currentReturn, initialCapital)
                  return gains.formattedGain
                })()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Initial: ${initialCapital.toLocaleString()} → Final: {(() => {
                  const currentReturn = isQuickBacktest ? quickReturn : '+16.57%'
                  const gains = calculateDollarGains(currentReturn, initialCapital)
                  return gains.formattedFinal
                })()}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Sharpe Ratio</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {isQuickBacktest ? quickSharpe : '1.69'}
            </div>
            <div className="text-sm text-gray-500">Risk-adjusted return</div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Win Rate</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {isQuickBacktest ? '66.7%' : '47.7%'}
            </div>
            <div className="text-sm text-gray-500">
              {isQuickBacktest ? '2 of 3 trades' : '93 of 195 trades'}
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-400" />
              <span className="text-gray-400 text-sm">Max Drawdown</span>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {isQuickBacktest ? quickDrawdown : '-23.48%'}
            </div>
            <div className="text-sm text-gray-500">Largest loss period</div>
          </div>
        </motion.div>

        {/* Strategy Configuration - Show details when coming from strategy builder */}
        {!isQuickBacktest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Strategy Configuration</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Strategy Name:</span>
                <div className="text-white font-medium">{strategyName}</div>
              </div>
              <div>
                <span className="text-gray-400">Ticker:</span>
                <div className="text-white font-medium">{searchParams.get('ticker') || 'NVDA'}</div>
              </div>
              <div>
                <span className="text-gray-400">Initial Capital:</span>
                <div className="text-white font-medium">${initialCapital.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-400">Commission:</span>
                <div className="text-white font-medium">{(commission * 100).toFixed(2)}%</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-600">
              <span className="text-gray-400 text-sm">Selected Indicators:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(searchParams.get('indicators') || 'macd').split(',').map((indicator, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-900/30 border border-blue-700/50 rounded-full text-xs text-blue-300"
                  >
                    {indicator.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Backtests and Performance Breakdown - Always shown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Recent Backtests */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Backtests</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                <div>
                  <div className="font-semibold text-white">
                    {isQuickBacktest ? `${quickIndicator} on ${quickTicker}` : 'My Strategy'}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center space-x-2">
                    <span>📅 8/26/2025</span>
                    <span>📊 {isQuickBacktest ? '3' : '195'} trades</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">
                    {isQuickBacktest ? quickReturn : '+16.57%'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Sharpe: {isQuickBacktest ? quickSharpe : '1.69'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6">Performance Breakdown</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-white">{isQuickBacktest ? '66.7%' : '47.7%'}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: isQuickBacktest ? '66.7%' : '47.7%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Risk-Adjusted Returns</span>
                  <span className="text-white">{isQuickBacktest ? '45.2%' : '33.8%'}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: isQuickBacktest ? '45.2%' : '33.8%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Consistency Score</span>
                  <span className="text-white">{isQuickBacktest ? '82.3%' : '76.5%'}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: isQuickBacktest ? '82.3%' : '76.5%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4">Key Metrics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Trades</span>
                  <span className="text-white">{isQuickBacktest ? '3' : '195'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg. Trade</span>
                  <span className="text-white">{isQuickBacktest ? '2.1%' : '0.08%'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Best Trade</span>
                  <span className="text-green-400">{isQuickBacktest ? '+$1,650' : '+$2,100'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Worst Trade</span>
                  <span className="text-red-400">{isQuickBacktest ? '-$800' : '-$850'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conditional rendering based on mode */}
        {isQuickBacktest ? (
          <QuickBacktestContent 
            quickData={quickData}
            ticker={quickTicker}
            indicator={quickIndicator}
          />
        ) : (
          <>
            {/* Tab Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex space-x-4 mb-8 border-b border-slate-700"
            >
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'trades', label: 'Trade History', icon: Activity },
                { key: 'analysis', label: 'Deep Analysis', icon: Target },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === key
                      ? 'text-blue-400 border-blue-400'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Equity Curve */}
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6">Equity Curve</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateEquityCurveData(initialCapital, 16.57)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="portfolio" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Strategy"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="benchmark" 
                        stroke="#6B7280" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        name="Benchmark"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Returns and Drawdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Monthly Returns</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyReturns}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                        <Bar 
                          dataKey="return" 
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Drawdown</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={drawdownData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="drawdown" 
                          stroke="#EF4444" 
                          fill="#EF4444"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trades' && (
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Trade History</h3>
                <button className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-600 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Symbol</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Quantity</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">P&L</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade) => (
                      <tr key={trade.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                        <td className="py-3 px-4 text-white">{trade.date}</td>
                        <td className="py-3 px-4 text-white font-medium">{trade.symbol}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.type === 'BUY' 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-red-600/20 text-red-400'
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white text-right">{trade.quantity}</td>
                        <td className="py-3 px-4 text-white text-right">${trade.price}</td>
                        <td className={`py-3 px-4 text-right font-medium ${
                          trade.pnl > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.pnl > 0 ? '+' : ''}${trade.pnl}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs">
                            {trade.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Risk Metrics */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Risk Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Value at Risk (95%)</span>
                      <span className="text-white">-$1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Beta</span>
                      <span className="text-white">1.15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Alpha</span>
                      <span className="text-green-400">0.087</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Information Ratio</span>
                      <span className="text-white">0.73</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sortino Ratio</span>
                      <span className="text-white">1.94</span>
                    </div>
                  </div>
                </div>

                {/* Performance Attribution */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Performance Attribution</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Best Trade</span>
                      <span className="text-green-400">+$2,100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Worst Trade</span>
                      <span className="text-red-400">-$850</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Win</span>
                      <span className="text-white">$1,125</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Loss</span>
                      <span className="text-white">-$425</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit Factor</span>
                      <span className="text-white">2.65</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
          </>
        )}
      </div>
    </main>
  )
}

function ResultsWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center"><div className="text-white">Loading results...</div></div>}>
      <Results />
    </Suspense>
  )
}

export default ResultsWrapper
