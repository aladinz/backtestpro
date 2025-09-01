'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, Eye, RefreshCw, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PortfolioHolding {
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  marketValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  dayChange: number
  dayChangePercent: number
}

interface PortfolioSummary {
  totalValue: number
  totalCost: number
  totalGainLoss: number
  totalGainLossPercent: number
  dayChange: number
  dayChangePercent: number
}

interface PortfolioData {
  summary: PortfolioSummary
  holdings: PortfolioHolding[]
  timestamp: string
}

// Demo portfolio - in a real app this would come from user's account
const demoPortfolio = [
  { symbol: 'AAPL', shares: 50, avgCost: 175.50 },
  { symbol: 'MSFT', shares: 25, avgCost: 380.00 },
  { symbol: 'GOOGL', shares: 15, avgCost: 145.25 },
  { symbol: 'TSLA', shares: 20, avgCost: 220.75 },
  { symbol: 'NVDA', shares: 10, avgCost: 420.00 },
  { symbol: 'AMZN', shares: 8, avgCost: 155.80 },
]

export default function PortfolioTracker() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    fetchPortfolioData()
    // Refresh every 30 seconds during market hours
    const interval = setInterval(fetchPortfolioData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current prices from our Yahoo Finance API
      const symbols = demoPortfolio.map(h => h.symbol)
      const response = await fetch('/api/portfolio-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Portfolio data fetch failed')
      }

      // Calculate portfolio metrics
      const holdings: PortfolioHolding[] = demoPortfolio.map(holding => {
        const quote = result.quotes.find((q: any) => q.symbol === holding.symbol)
        if (!quote) {
          throw new Error(`No quote found for ${holding.symbol}`)
        }

        const currentPrice = quote.price
        const marketValue = holding.shares * currentPrice
        const totalCost = holding.shares * holding.avgCost
        const totalGainLoss = marketValue - totalCost
        const totalGainLossPercent = (totalGainLoss / totalCost) * 100
        const dayChange = holding.shares * quote.change
        const dayChangePercent = quote.changePercent

        return {
          symbol: holding.symbol,
          name: quote.name || holding.symbol,
          shares: holding.shares,
          avgCost: holding.avgCost,
          currentPrice,
          marketValue,
          totalGainLoss,
          totalGainLossPercent,
          dayChange,
          dayChangePercent
        }
      })

      // Calculate portfolio summary
      const summary: PortfolioSummary = {
        totalValue: holdings.reduce((sum, h) => sum + h.marketValue, 0),
        totalCost: holdings.reduce((sum, h) => sum + (h.shares * h.avgCost), 0),
        totalGainLoss: holdings.reduce((sum, h) => sum + h.totalGainLoss, 0),
        totalGainLossPercent: 0, // Will calculate below
        dayChange: holdings.reduce((sum, h) => sum + h.dayChange, 0),
        dayChangePercent: 0 // Will calculate below
      }

      summary.totalGainLossPercent = (summary.totalGainLoss / summary.totalCost) * 100
      summary.dayChangePercent = (summary.dayChange / (summary.totalValue - summary.dayChange)) * 100

      setPortfolioData({
        summary,
        holdings,
        timestamp: new Date().toISOString()
      })
      setLastUpdate(new Date())

    } catch (err) {
      console.error('Portfolio fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !portfolioData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading portfolio data from Yahoo Finance...</p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error && !portfolioData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-900/30 backdrop-blur-sm p-6 rounded-xl border border-red-700/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">Portfolio data unavailable: {error}</span>
          </div>
          <button
            onClick={fetchPortfolioData}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-blue-400" />
            Portfolio Tracker
          </h2>
          <p className="text-sm text-blue-400 mt-1">Live portfolio performance with Yahoo Finance data</p>
        </div>
        <div className="flex items-center space-x-3">
          {lastUpdate && (
            <div className="text-xs text-gray-400">
              Updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={fetchPortfolioData}
            disabled={loading}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {portfolioData && (
        <>
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="text-sm text-gray-300">Total Value</div>
              <div className="text-2xl font-bold text-white">
                ${portfolioData.summary.totalValue.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="text-sm text-gray-300">Total Gain/Loss</div>
              <div className={`text-2xl font-bold ${
                portfolioData.summary.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioData.summary.totalGainLoss >= 0 ? '+' : ''}${portfolioData.summary.totalGainLoss.toFixed(2)}
              </div>
              <div className={`text-sm ${
                portfolioData.summary.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioData.summary.totalGainLossPercent >= 0 ? '+' : ''}{portfolioData.summary.totalGainLossPercent.toFixed(2)}%
              </div>
            </div>

            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="text-sm text-gray-300">Day Change</div>
              <div className={`text-2xl font-bold ${
                portfolioData.summary.dayChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioData.summary.dayChange >= 0 ? '+' : ''}${portfolioData.summary.dayChange.toFixed(2)}
              </div>
              <div className={`text-sm ${
                portfolioData.summary.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioData.summary.dayChangePercent >= 0 ? '+' : ''}{portfolioData.summary.dayChangePercent.toFixed(2)}%
              </div>
            </div>

            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="text-sm text-gray-300">Total Cost</div>
              <div className="text-2xl font-bold text-white">
                ${portfolioData.summary.totalCost.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Holdings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Holdings</h3>
            <div className="space-y-3">
              {portfolioData.holdings.map((holding, index) => (
                <motion.div
                  key={holding.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                    {/* Stock Info */}
                    <div>
                      <div className="font-bold text-white text-lg">{holding.symbol}</div>
                      <div className="text-sm text-gray-400">{holding.name}</div>
                      <div className="text-xs text-blue-400">{holding.shares} shares</div>
                    </div>

                    {/* Current Price */}
                    <div className="text-center">
                      <div className="text-sm text-gray-300">Current Price</div>
                      <div className="text-lg font-semibold text-white">${holding.currentPrice.toFixed(2)}</div>
                      <div className={`text-sm ${holding.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.dayChangePercent >= 0 ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%
                      </div>
                    </div>

                    {/* Average Cost */}
                    <div className="text-center">
                      <div className="text-sm text-gray-300">Avg Cost</div>
                      <div className="text-lg font-semibold text-white">${holding.avgCost.toFixed(2)}</div>
                    </div>

                    {/* Market Value */}
                    <div className="text-center">
                      <div className="text-sm text-gray-300">Market Value</div>
                      <div className="text-lg font-semibold text-white">${holding.marketValue.toFixed(2)}</div>
                    </div>

                    {/* Total Gain/Loss */}
                    <div className="text-center">
                      <div className="text-sm text-gray-300">Total Gain/Loss</div>
                      <div className={`text-lg font-semibold ${
                        holding.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {holding.totalGainLoss >= 0 ? '+' : ''}${holding.totalGainLoss.toFixed(2)}
                      </div>
                      <div className={`text-sm ${
                        holding.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {holding.totalGainLossPercent >= 0 ? '+' : ''}{holding.totalGainLossPercent.toFixed(2)}%
                      </div>
                    </div>

                    {/* Day Change */}
                    <div className="text-center">
                      <div className="text-sm text-gray-300">Day Change</div>
                      <div className={`text-lg font-semibold ${
                        holding.dayChange >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {holding.dayChange >= 0 ? '+' : ''}${holding.dayChange.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
