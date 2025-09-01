import { NextResponse } from 'next/server'
import { yahooFinanceService } from '@/lib/yahooFinance'

export async function GET() {
  try {
    console.log('Market Breadth API: Fetching market breadth data')

    // Get market breadth data from Yahoo Finance
    const marketBreadth = await yahooFinanceService.getMarketBreadth()
    
    // Get additional sector ETF data for sector rotation analysis
    const sectorETFs = [
      'XLK', // Technology
      'XLV', // Healthcare  
      'XLF', // Financials
      'XLY', // Consumer Discretionary
      'XLP', // Consumer Staples
      'XLE', // Energy
      'XLI', // Industrials
      'XLU', // Utilities
      'XLRE', // Real Estate
      'XLB'  // Materials
    ]

    const sectorQuotes = await yahooFinanceService.getMultipleQuotes(sectorETFs)
    
    // Calculate sector rotation data
    const sectorRotation = sectorQuotes.map(quote => ({
      sector: getSectorName(quote.symbol),
      symbol: quote.symbol,
      price: quote.price,
      change1D: quote.changePercent,
      relativeStrength: calculateRelativeStrength(quote.changePercent),
      momentum: quote.changePercent > 0 ? 'bullish' : 'bearish'
    })).sort((a, b) => b.change1D - a.change1D)

    // Get major index quotes for market breadth analysis
    const indexSymbols = ['SPY', 'QQQ', 'IWM', '^VIX', '^TNX']
    const indexQuotes = await yahooFinanceService.getMultipleQuotes(indexSymbols)
    
    const marketIndices = indexQuotes.map(quote => ({
      symbol: quote.symbol,
      name: getIndexName(quote.symbol),
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent
    }))

    return NextResponse.json({
      success: true,
      data: {
        marketBreadth: {
          spyAdvanceDecline: marketBreadth.spyAdvanceDecline,
          vixLevel: marketBreadth.vixLevel,
          marketSentiment: marketBreadth.marketSentiment
        },
        sectorRotation,
        marketIndices,
        timestamp: new Date().toISOString()
      },
      source: 'yahoo-finance-live'
    })

  } catch (error) {
    console.error('Market Breadth API error:', error)
    
    // Fallback data
    return NextResponse.json({
      success: true,
      data: {
        marketBreadth: {
          spyAdvanceDecline: -0.8,
          vixLevel: 18.5,
          marketSentiment: 'NEUTRAL' as const
        },
        sectorRotation: [
          { sector: 'Technology', symbol: 'XLK', price: 215.30, change1D: 1.2, relativeStrength: 85, momentum: 'bullish' },
          { sector: 'Healthcare', symbol: 'XLV', price: 128.45, change1D: 0.8, relativeStrength: 75, momentum: 'bullish' },
          { sector: 'Energy', symbol: 'XLE', price: 95.20, change1D: -1.5, relativeStrength: 45, momentum: 'bearish' }
        ],
        marketIndices: [
          { symbol: 'SPY', name: 'S&P 500', price: 543.21, change: -3.89, changePercent: -0.71 },
          { symbol: 'QQQ', name: 'NASDAQ', price: 462.45, change: -8.67, changePercent: -1.84 }
        ],
        timestamp: new Date().toISOString()
      },
      source: 'fallback-data',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

function getSectorName(symbol: string): string {
  const sectorMap: { [key: string]: string } = {
    'XLK': 'Technology',
    'XLV': 'Healthcare',
    'XLF': 'Financials',
    'XLY': 'Consumer Discretionary',
    'XLP': 'Consumer Staples',
    'XLE': 'Energy',
    'XLI': 'Industrials',
    'XLU': 'Utilities',
    'XLRE': 'Real Estate',
    'XLB': 'Materials'
  }
  return sectorMap[symbol] || symbol
}

function getIndexName(symbol: string): string {
  const indexMap: { [key: string]: string } = {
    'SPY': 'S&P 500',
    'QQQ': 'NASDAQ',
    'IWM': 'Russell 2000',
    '^VIX': 'VIX',
    '^TNX': '10-Year Treasury'
  }
  return indexMap[symbol] || symbol
}

function calculateRelativeStrength(changePercent: number): number {
  // Simple relative strength calculation (0-100 scale)
  // In real implementation, this would compare to market benchmark
  return Math.max(0, Math.min(100, 50 + (changePercent * 10)))
}
