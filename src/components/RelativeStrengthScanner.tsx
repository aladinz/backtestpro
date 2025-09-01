'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Search, Filter, Star, Target, Zap, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

// Stock data with relative strength metrics
interface StockData {
  symbol: string
  name: string
  sector: string
  price: number
  change1D: number
  change1W: number
  change1M: number
  change3M: number
  relativeStrength: number // RS vs SPY (100 = same as market, >100 = outperforming)
  rsRank: number // 1-100 ranking
  volume: string
  avgVolume: string
  marketCap: string
  momentum: 'strong' | 'moderate' | 'weak'
  trend: 'bullish' | 'bearish' | 'neutral'
  pattern: string
  support: number
  resistance: number
}

const stockData: StockData[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    price: 181.45,
    change1D: 2.35,
    change1W: 5.8,
    change1M: 12.4,
    change3M: 28.7,
    relativeStrength: 145.2,
    rsRank: 98,
    volume: '45.2M',
    avgVolume: '32.1M',
    marketCap: '4.47T',
    momentum: 'strong',
    trend: 'bullish',
    pattern: 'Cup & Handle',
    support: 175.50,
    resistance: 195.00
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 230.16,
    change1D: 1.85,
    change1W: 3.2,
    change1M: 8.7,
    change3M: 15.4,
    relativeStrength: 128.5,
    rsRank: 89,
    volume: '52.8M',
    avgVolume: '48.3M',
    marketCap: '3.52T',
    momentum: 'strong',
    trend: 'bullish',
    pattern: 'Ascending Triangle',
    support: 225.00,
    resistance: 240.00
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    price: 504.88,
    change1D: 1.12,
    change1W: 2.8,
    change1M: 7.3,
    change3M: 13.1,
    relativeStrength: 122.8,
    rsRank: 85,
    volume: '28.9M',
    avgVolume: '25.4M',
    marketCap: '3.75T',
    momentum: 'strong',
    trend: 'bullish',
    pattern: 'Bull Flag',
    support: 495.00,
    resistance: 520.00
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    price: 208.77,
    change1D: 0.95,
    change1W: 2.1,
    change1M: 6.8,
    change3M: 11.2,
    relativeStrength: 118.3,
    rsRank: 82,
    volume: '24.1M',
    avgVolume: '22.8M',
    marketCap: '2.58T',
    momentum: 'moderate',
    trend: 'bullish',
    pattern: 'Breakout',
    support: 200.00,
    resistance: 220.00
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Communication Services',
    price: 642.25,
    change1D: 1.45,
    change1W: 3.8,
    change1M: 9.2,
    change3M: 16.7,
    relativeStrength: 125.9,
    rsRank: 87,
    volume: '18.9M',
    avgVolume: '16.2M',
    marketCap: '1.63T',
    momentum: 'strong',
    trend: 'bullish',
    pattern: 'New Highs',
    support: 620.00,
    resistance: 680.00
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Discretionary',
    price: 229.18,
    change1D: 0.78,
    change1W: 2.3,
    change1M: 6.1,
    change3M: 12.8,
    relativeStrength: 115.7,
    rsRank: 78,
    volume: '31.5M',
    avgVolume: '28.9M',
    marketCap: '2.39T',
    momentum: 'moderate',
    trend: 'bullish',
    pattern: 'Higher Lows',
    support: 220.00,
    resistance: 240.00
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Consumer Discretionary',
    price: 248.50,
    change1D: -0.85,
    change1W: 1.2,
    change1M: 8.9,
    change3M: 18.4,
    relativeStrength: 112.4,
    rsRank: 75,
    volume: '67.3M',
    avgVolume: '45.2M',
    marketCap: '790B',
    momentum: 'moderate',
    trend: 'neutral',
    pattern: 'Consolidation',
    support: 240.00,
    resistance: 260.00
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    sector: 'Healthcare',
    price: 895.40,
    change1D: 0.65,
    change1W: 1.8,
    change1M: 4.2,
    change3M: 8.9,
    relativeStrength: 108.7,
    rsRank: 72,
    volume: '2.8M',
    avgVolume: '2.1M',
    marketCap: '850B',
    momentum: 'moderate',
    trend: 'bullish',
    pattern: 'Steady Uptrend',
    support: 870.00,
    resistance: 920.00
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'Technology',
    price: 164.32,
    change1D: 3.15,
    change1W: 7.2,
    change1M: 15.8,
    change3M: 22.4,
    relativeStrength: 138.7,
    rsRank: 93,
    volume: '89.5M',
    avgVolume: '62.1M',
    marketCap: '265B',
    momentum: 'strong',
    trend: 'bullish',
    pattern: 'Breakout Above Resistance',
    support: 155.00,
    resistance: 175.00
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    sector: 'Communication Services',
    price: 985.75,
    change1D: 2.18,
    change1W: 4.6,
    change1M: 11.3,
    change3M: 19.8,
    relativeStrength: 132.4,
    rsRank: 91,
    volume: '4.8M',
    avgVolume: '3.2M',
    marketCap: '425B',
    momentum: 'strong',
    trend: 'bullish',
    pattern: 'New 52-Week High',
    support: 950.00,
    resistance: 1020.00
  },
  {
    symbol: 'CRM',
    name: 'Salesforce Inc.',
    sector: 'Technology',
    price: 358.92,
    change1D: 1.95,
    change1W: 5.1,
    change1M: 13.7,
    change3M: 21.9,
    relativeStrength: 129.8,
    rsRank: 88,
    volume: '8.4M',
    avgVolume: '6.1M',
    marketCap: '352B',
    momentum: 'strong',
    trend: 'bullish',
    pattern: 'Cup with Handle',
    support: 340.00,
    resistance: 380.00
  },
  {
    symbol: 'AVGO',
    name: 'Broadcom Inc.',
    sector: 'Technology',
    price: 1895.45,
    change1D: 1.32,
    change1W: 3.8,
    change1M: 9.4,
    change3M: 16.2,
    relativeStrength: 124.6,
    rsRank: 86,
    volume: '2.1M',
    avgVolume: '1.8M',
    marketCap: '885B',
    momentum: 'strong',
    trend: 'bullish',
    pattern: 'Ascending Channel',
    support: 1850.00,
    resistance: 1950.00
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    sector: 'Financials',
    price: 325.84,
    change1D: 0.89,
    change1W: 2.7,
    change1M: 8.1,
    change3M: 14.5,
    relativeStrength: 119.3,
    rsRank: 83,
    volume: '6.8M',
    avgVolume: '5.9M',
    marketCap: '675B',
    momentum: 'moderate',
    trend: 'bullish',
    pattern: 'Steady Uptrend',
    support: 315.00,
    resistance: 340.00
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group',
    sector: 'Healthcare',
    price: 612.38,
    change1D: 1.15,
    change1W: 2.9,
    change1M: 7.8,
    change3M: 12.6,
    relativeStrength: 117.2,
    rsRank: 81,
    volume: '3.2M',
    avgVolume: '2.8M',
    marketCap: '565B',
    momentum: 'moderate',
    trend: 'bullish',
    pattern: 'Higher Highs',
    support: 595.00,
    resistance: 630.00
  },
  {
    symbol: 'HD',
    name: 'Home Depot Inc.',
    sector: 'Consumer Discretionary',
    price: 428.67,
    change1D: 0.75,
    change1W: 2.1,
    change1M: 6.4,
    change3M: 11.8,
    relativeStrength: 114.9,
    rsRank: 79,
    volume: '4.1M',
    avgVolume: '3.7M',
    marketCap: '425B',
    momentum: 'moderate',
    trend: 'bullish',
    pattern: 'Bull Pennant',
    support: 415.00,
    resistance: 445.00
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financials',
    price: 245.80,
    change1D: -0.32,
    change1W: -1.4,
    change1M: 1.2,
    change3M: 8.9,
    relativeStrength: 102.3,
    rsRank: 65,
    volume: '12.4M',
    avgVolume: '11.8M',
    marketCap: '715B',
    momentum: 'weak',
    trend: 'neutral',
    pattern: 'Range Bound',
    support: 235.00,
    resistance: 255.00
  },
  {
    symbol: 'MA',
    name: 'Mastercard Inc.',
    sector: 'Financials',
    price: 518.92,
    change1D: 1.08,
    change1W: 3.1,
    change1M: 7.9,
    change3M: 13.7,
    relativeStrength: 120.8,
    rsRank: 84,
    volume: '2.8M',
    avgVolume: '2.4M',
    marketCap: '485B',
    momentum: 'strong',
    trend: 'bullish',
    pattern: 'Bullish Flag',
    support: 505.00,
    resistance: 535.00
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    price: 184.25,
    change1D: 0.45,
    change1W: 1.2,
    change1M: 3.8,
    change3M: 7.1,
    relativeStrength: 105.4,
    rsRank: 68,
    volume: '8.9M',
    avgVolume: '7.2M',
    marketCap: '445B',
    momentum: 'weak',
    trend: 'neutral',
    pattern: 'Sideways Trend',
    support: 178.00,
    resistance: 190.00
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy',
    price: 118.75,
    change1D: -1.23,
    change1W: -2.8,
    change1M: -5.4,
    change3M: 2.1,
    relativeStrength: 89.2,
    rsRank: 35,
    volume: '18.6M',
    avgVolume: '15.3M',
    marketCap: '485B',
    momentum: 'weak',
    trend: 'bearish',
    pattern: 'Declining Trend',
    support: 110.00,
    resistance: 125.00
  }
]

interface RelativeStrengthScannerProps {
  compact?: boolean
  sectorFilter?: string
}

export default function RelativeStrengthScanner({ compact = false, sectorFilter }: RelativeStrengthScannerProps) {
  const [selectedSector, setSelectedSector] = useState<string>(sectorFilter || 'All')
  const [sortBy, setSortBy] = useState<'rsRank' | 'relativeStrength' | 'change1M'>('rsRank')
  const [minRSRank, setMinRSRank] = useState(60)
  const [showOnlyBullish, setShowOnlyBullish] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [analyzingStock, setAnalyzingStock] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle stock analysis
  const handleAnalyzeStock = async (stock: StockData) => {
    setAnalyzingStock(stock.symbol)
    
    // Simulate analysis process with detailed logging
    console.log(`🔍 Starting Relative Strength Analysis for ${stock.symbol}`)
    console.log(`📊 Current Metrics:`)
    console.log(`   • RS Rank: ${stock.rsRank}/100 (Top ${100 - stock.rsRank}% of market)`)
    console.log(`   • Relative Strength: ${stock.relativeStrength} (${stock.relativeStrength > 100 ? 'Outperforming' : 'Underperforming'} market)`)
    console.log(`   • Price: $${stock.price} | 1M Change: ${stock.change1M > 0 ? '+' : ''}${stock.change1M}%`)
    console.log(`   • Pattern: ${stock.pattern} | Trend: ${stock.trend.toUpperCase()} | Momentum: ${stock.momentum.toUpperCase()}`)
    
    // Calculate detailed analysis
    const priceToResistance = ((stock.resistance - stock.price) / stock.price) * 100
    const priceAboveSupport = ((stock.price - stock.support) / stock.support) * 100
    const volumeRatio = parseFloat(stock.volume.replace('M', '')) / parseFloat(stock.avgVolume.replace('M', ''))
    
    // Generate comprehensive analysis
    const analysis = {
      // Technical Rating
      technicalRating: stock.rsRank >= 95 ? 'Strong Buy' : 
                      stock.rsRank >= 85 ? 'Buy' : 
                      stock.rsRank >= 75 ? 'Hold' : 
                      stock.rsRank >= 60 ? 'Weak Hold' : 'Avoid',
      
      // Strength Metrics
      strengthScore: Math.min(100, Math.round((stock.rsRank + Math.max(0, stock.relativeStrength - 100)) / 2)),
      momentumScore: stock.momentum === 'strong' ? 90 : stock.momentum === 'moderate' ? 70 : 40,
      
      // Risk Assessment
      riskLevel: stock.trend === 'bullish' && stock.momentum === 'strong' && stock.rsRank >= 80 ? 'Low' :
                 stock.trend === 'bullish' && stock.rsRank >= 70 ? 'Medium' :
                 stock.trend === 'neutral' ? 'Medium-High' : 'High',
      
      // Price Targets
      targetPrice: stock.resistance + (stock.resistance - stock.price) * 0.5,
      conservativeTarget: stock.resistance * 1.05,
      stopLoss: stock.support * 0.97,
      
      // Position Sizing Recommendation
      positionSize: stock.rsRank >= 90 && stock.momentum === 'strong' ? 'Full Position (3-5%)' :
                   stock.rsRank >= 80 ? 'Standard Position (2-3%)' :
                   stock.rsRank >= 70 ? 'Small Position (1-2%)' : 'Avoid',
      
      // Key Insights
      upside: priceToResistance,
      downside: priceAboveSupport,
      volumeStrength: volumeRatio >= 1.5 ? 'Strong' : volumeRatio >= 1.2 ? 'Above Average' : 'Normal',
      
      // Confidence Level
      confidence: stock.rsRank >= 90 && stock.trend === 'bullish' ? 'Very High (90%+)' :
                 stock.rsRank >= 80 && stock.momentum === 'strong' ? 'High (80-90%)' :
                 stock.rsRank >= 70 ? 'Medium (70-80%)' : 'Low (60-70%)'
    }
    
    // Simulate realistic analysis time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Enhanced results display
    const resultMessage = `
🔍 RELATIVE STRENGTH ANALYSIS: ${stock.symbol}
${stock.name} | ${stock.sector}

📊 TECHNICAL RATING: ${analysis.technicalRating}
⚡ Strength Score: ${analysis.strengthScore}/100
🚀 Momentum Score: ${analysis.momentumScore}/100
📈 Confidence Level: ${analysis.confidence}

💰 PRICE ANALYSIS:
• Current: $${stock.price}
• Target: $${analysis.targetPrice.toFixed(2)} (+${analysis.upside.toFixed(1)}%)
• Conservative: $${analysis.conservativeTarget.toFixed(2)}
• Stop Loss: $${analysis.stopLoss.toFixed(2)} (-${(100 - priceAboveSupport).toFixed(1)}%)

⚠️ RISK ASSESSMENT:
• Risk Level: ${analysis.riskLevel}
• Position Size: ${analysis.positionSize}
• Volume Strength: ${analysis.volumeStrength}

🎯 KEY METRICS:
• RS Rank: ${stock.rsRank}/100 (Top ${100 - stock.rsRank}%)
• Relative Strength: ${stock.relativeStrength}
• Pattern: ${stock.pattern}
• Trend: ${stock.trend.toUpperCase()}

📋 RECOMMENDATION:
${stock.rsRank >= 85 ? '✅ Strong candidate for position' :
  stock.rsRank >= 75 ? '⚠️ Proceed with caution' :
  '❌ Consider better alternatives'}
    `
    
    console.log(`✅ Analysis Complete for ${stock.symbol}`)
    console.log(resultMessage)
    
    alert(resultMessage)
    setAnalyzingStock(null)
  }

  const sectors = ['All', 'Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Communication Services', 'Energy']

  const filteredStocks = stockData
    .filter(stock => {
      if (selectedSector !== 'All' && stock.sector !== selectedSector) return false
      if (stock.rsRank < minRSRank) return false
      if (showOnlyBullish && stock.trend !== 'bullish') return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'rsRank') return b.rsRank - a.rsRank
      if (sortBy === 'relativeStrength') return b.relativeStrength - a.relativeStrength
      if (sortBy === 'change1M') return b.change1M - a.change1M
      return 0
    })

  const getRSColor = (rsRank: number) => {
    if (rsRank >= 90) return 'text-green-400'
    if (rsRank >= 80) return 'text-blue-400'
    if (rsRank >= 70) return 'text-yellow-400'
    if (rsRank >= 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const getRSBackground = (rsRank: number) => {
    if (rsRank >= 90) return 'bg-green-500/20 border-green-500/30'
    if (rsRank >= 80) return 'bg-blue-500/20 border-blue-500/30'
    if (rsRank >= 70) return 'bg-yellow-500/20 border-yellow-500/30'
    if (rsRank >= 60) return 'bg-orange-500/20 border-orange-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'strong': return <Zap className="h-4 w-4 text-green-400" />
      case 'moderate': return <Activity className="h-4 w-4 text-yellow-400" />
      default: return <TrendingDown className="h-4 w-4 text-red-400" />
    }
  }

  if (!mounted) return null

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Search className="h-5 w-5 mr-2 text-blue-400" />
          Top RS Stocks
        </h3>
        <div className="space-y-2">
          {filteredStocks.slice(0, 5).map((stock, index) => (
            <div key={stock.symbol} className={`flex items-center justify-between p-2 rounded border ${getRSBackground(stock.rsRank)}`}>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">{stock.symbol}</span>
                <span className="text-xs text-gray-400">{stock.sector}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getRSColor(stock.rsRank)}`}>
                  RS: {stock.rsRank}
                </span>
                {getMomentumIcon(stock.momentum)}
              </div>
            </div>
          ))}
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
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Search className="h-6 w-6 mr-2 text-blue-400" />
            Relative Strength Scanner
          </h2>
          <p className="text-sm text-blue-400 mt-1">
            Find the strongest stocks with superior relative performance
          </p>
        </div>
        <div className="flex items-center space-x-2 text-blue-400 text-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Live Scanning</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-700/30 rounded-lg">        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Sector</label>
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Sort By</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
          >
            <option value="rsRank">RS Rank</option>
            <option value="relativeStrength">Relative Strength</option>
            <option value="change1M">1M Performance</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Min RS Rank</label>
          <select 
            value={minRSRank}
            onChange={(e) => setMinRSRank(Number(e.target.value))}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
          >
            <option value={50}>50+</option>
            <option value={60}>60+</option>
            <option value={70}>70+</option>
            <option value={80}>80+</option>
            <option value={90}>90+</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Trend Filter</label>
          <label className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox"
              checked={showOnlyBullish}
              onChange={(e) => setShowOnlyBullish(e.target.checked)}
              className="rounded bg-slate-800 border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-white">Bullish Only</span>
          </label>
        </div>
      </div>

      {/* Stock List */}
      <div className="space-y-3">
        {filteredStocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg border hover:bg-slate-700/30 transition-colors cursor-pointer ${getRSBackground(stock.rsRank)}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              {/* Stock Info */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-lg">{stock.symbol}</span>
                      {stock.rsRank >= 90 && <Star className="h-4 w-4 text-yellow-400" />}
                      {getMomentumIcon(stock.momentum)}
                    </div>
                    <div className="text-sm text-gray-400">{stock.name}</div>
                    <div className="text-xs text-blue-400">{stock.sector}</div>
                  </div>
                </div>
              </div>

              {/* Price & Change */}
              <div>
                <div className="text-lg font-semibold text-white">${stock.price.toFixed(2)}</div>
                <div className={`text-sm ${stock.change1D >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change1D >= 0 ? '+' : ''}{stock.change1D.toFixed(2)}% (1D)
                </div>
                <div className={`text-xs ${stock.change1M >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change1M >= 0 ? '+' : ''}{stock.change1M.toFixed(1)}% (1M)
                </div>
              </div>

              {/* Relative Strength */}
              <div>
                <div className={`text-lg font-bold ${getRSColor(stock.rsRank)}`}>
                  RS: {stock.rsRank}
                </div>
                <div className="text-sm text-gray-400">
                  vs SPY: {stock.relativeStrength.toFixed(1)}
                </div>
                <div className={`text-xs ${
                  stock.trend === 'bullish' ? 'text-green-400' :
                  stock.trend === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {stock.trend}
                </div>
              </div>

              {/* Technical Pattern */}
              <div>
                <div className="text-sm font-medium text-white">{stock.pattern}</div>
                <div className="text-xs text-gray-400">
                  Support: ${stock.support.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  Resistance: ${stock.resistance.toFixed(2)}
                </div>
              </div>

              {/* Volume & Action */}
              <div>
                <div className="text-sm text-gray-400">
                  Vol: {stock.volume}
                </div>
                <div className="text-xs text-gray-500">
                  Avg: {stock.avgVolume}
                </div>
                <button 
                  onClick={() => handleAnalyzeStock(stock)}
                  disabled={analyzingStock === stock.symbol}
                  className={`mt-1 px-3 py-1 rounded text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                    analyzingStock === stock.symbol 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                  }`}
                >
                  {analyzingStock === stock.symbol && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  )}
                  <span>{analyzingStock === stock.symbol ? 'Analyzing...' : 'Analyze'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{filteredStocks.length}</div>
          <div className="text-sm text-gray-400">Stocks Found</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-400">
            {filteredStocks.filter(s => s.rsRank >= 90).length}
          </div>
          <div className="text-sm text-gray-400">RS Rank 90+</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">
            {filteredStocks.filter(s => s.trend === 'bullish').length}
          </div>
          <div className="text-sm text-gray-400">Bullish Trend</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-400">
            {filteredStocks.filter(s => s.momentum === 'strong').length}
          </div>
          <div className="text-sm text-gray-400">Strong Momentum</div>
        </div>
      </div>
    </motion.div>
  )
}
