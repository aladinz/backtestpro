import { NextResponse } from 'next/server'
import { yahooFinanceService } from '@/lib/yahooFinance'

export async function POST(request: Request) {
  try {
    const { symbols } = await request.json()
    
    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid symbols array provided'
      }, { status: 400 })
    }

    console.log('Portfolio Quotes API: Fetching quotes for', symbols)

    // Get quotes from Yahoo Finance
    const quotes = await yahooFinanceService.getMultipleQuotes(symbols)
    
    if (quotes.length === 0) {
      throw new Error('No quotes received from Yahoo Finance')
    }

    // Format quotes for portfolio calculation
    const formattedQuotes = quotes.map(quote => ({
      symbol: quote.symbol,
      name: getCompanyName(quote.symbol),
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      volume: quote.volume,
      marketCap: quote.marketCap
    }))

    return NextResponse.json({
      success: true,
      quotes: formattedQuotes,
      timestamp: new Date().toISOString(),
      source: 'yahoo-finance-live'
    })

  } catch (error) {
    console.error('Portfolio Quotes API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

function getCompanyName(symbol: string): string {
  const companyNames: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms Inc.',
    'NFLX': 'Netflix Inc.',
    'JPM': 'JPMorgan Chase & Co.',
    'JNJ': 'Johnson & Johnson',
    'PG': 'Procter & Gamble Co.',
    'UNH': 'UnitedHealth Group Inc.',
    'V': 'Visa Inc.',
    'HD': 'Home Depot Inc.',
    'MA': 'Mastercard Inc.',
    'BAC': 'Bank of America Corp.',
    'XOM': 'Exxon Mobil Corp.',
    'WMT': 'Walmart Inc.',
    'LLY': 'Eli Lilly & Co.',
    'COST': 'Costco Wholesale Corp.'
  }
  
  return companyNames[symbol] || symbol
}
