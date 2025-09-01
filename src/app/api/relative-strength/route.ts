import { NextResponse } from 'next/server'
import { yahooFinanceService } from '@/lib/yahooFinance'

export async function GET() {
  try {
    console.log('Relative Strength API: Starting relative strength analysis')

    // Top stocks to analyze for relative strength
    const stockSymbols = [
      // Tech leaders
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX',
      // Growth stocks
      'CRM', 'ADBE', 'NOW', 'SNOW', 'PLTR', 'ZM', 'ROKU', 'SQ',
      // Blue chips
      'JPM', 'JNJ', 'PG', 'KO', 'DIS', 'WMT', 'V', 'MA',
      // Industrial/Energy
      'CAT', 'BA', 'XOM', 'CVX', 'LMT', 'GE',
      // Healthcare/Biotech
      'UNH', 'ABBV', 'PFE', 'LLY', 'TMO', 'ABT'
    ]

    // Get SPY as our benchmark
    const spyQuote = await yahooFinanceService.getQuote('SPY')
    if (!spyQuote) {
      throw new Error('Could not fetch SPY benchmark data')
    }

    // Get quotes for all stocks
    const stockQuotes = await yahooFinanceService.getMultipleQuotes(stockSymbols)
    
    if (stockQuotes.length === 0) {
      throw new Error('No stock quotes received')
    }

    // Calculate relative strength vs SPY
    const relativeStrengthData = stockQuotes.map(quote => {
      // Simple relative strength calculation (stock performance vs SPY)
      const relativeStrength = quote.changePercent - spyQuote.changePercent
      const relativeStrengthRank = calculateRelativeStrengthRank(relativeStrength)
      
      return {
        symbol: quote.symbol,
        name: getCompanyName(quote.symbol),
        price: quote.price,
        change1D: quote.change,
        changePercent1D: quote.changePercent,
        relativeStrength,
        relativeStrengthRank,
        sector: getSector(quote.symbol),
        volume: quote.volume || 0,
        marketCap: quote.marketCap || 0,
        momentum: relativeStrength > 1 ? 'strong' : relativeStrength > 0 ? 'moderate' : 'weak',
        signals: generateSignals(quote, relativeStrength)
      }
    })

    // Sort by relative strength (strongest first)
    relativeStrengthData.sort((a, b) => b.relativeStrength - a.relativeStrength)

    // Group by performance categories
    const strongPerformers = relativeStrengthData.filter(stock => stock.relativeStrength > 1)
    const moderatePerformers = relativeStrengthData.filter(stock => stock.relativeStrength > 0 && stock.relativeStrength <= 1)
    const underperformers = relativeStrengthData.filter(stock => stock.relativeStrength <= 0)

    return NextResponse.json({
      success: true,
      data: {
        benchmark: {
          symbol: 'SPY',
          price: spyQuote.price,
          changePercent: spyQuote.changePercent
        },
        allStocks: relativeStrengthData,
        strongPerformers,
        moderatePerformers,
        underperformers,
        summary: {
          totalStocks: relativeStrengthData.length,
          strongCount: strongPerformers.length,
          moderateCount: moderatePerformers.length,
          weakCount: underperformers.length
        },
        timestamp: new Date().toISOString()
      },
      source: 'yahoo-finance-live'
    })

  } catch (error) {
    console.error('Relative Strength API error:', error)
    
    // Fallback data
    return NextResponse.json({
      success: true,
      data: {
        benchmark: { symbol: 'SPY', price: 543.21, changePercent: -0.71 },
        allStocks: [
          {
            symbol: 'NVDA',
            name: 'NVIDIA Corporation',
            price: 467.89,
            change1D: 8.92,
            changePercent1D: 1.94,
            relativeStrength: 2.65,
            relativeStrengthRank: 95,
            sector: 'Technology',
            volume: 25840000,
            marketCap: 1150000000000,
            momentum: 'strong',
            signals: ['Technical Breakout', 'High Volume', 'Strong Momentum']
          }
        ],
        strongPerformers: [],
        moderatePerformers: [],
        underperformers: [],
        summary: { totalStocks: 1, strongCount: 1, moderateCount: 0, weakCount: 0 },
        timestamp: new Date().toISOString()
      },
      source: 'fallback-data',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

function calculateRelativeStrengthRank(relativeStrength: number): number {
  // Convert relative strength to 0-100 rank
  // This is a simplified calculation - in real apps you'd use historical data
  if (relativeStrength > 3) return 99
  if (relativeStrength > 2) return 95
  if (relativeStrength > 1) return 85
  if (relativeStrength > 0.5) return 75
  if (relativeStrength > 0) return 60
  if (relativeStrength > -0.5) return 45
  if (relativeStrength > -1) return 30
  if (relativeStrength > -2) return 15
  return 5
}

function generateSignals(quote: any, relativeStrength: number): string[] {
  const signals: string[] = []
  
  if (relativeStrength > 2) signals.push('Strong Outperformance')
  if (relativeStrength > 1) signals.push('Technical Breakout')
  if (quote.changePercent > 3) signals.push('High Momentum')
  if (quote.volume && quote.volume > 1000000) signals.push('High Volume')
  if (quote.changePercent > 0 && relativeStrength > 0) signals.push('Relative Leadership')
  
  return signals
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
    'CRM': 'Salesforce Inc.',
    'ADBE': 'Adobe Inc.',
    'NOW': 'ServiceNow Inc.',
    'SNOW': 'Snowflake Inc.',
    'PLTR': 'Palantir Technologies',
    'ZM': 'Zoom Video Communications',
    'ROKU': 'Roku Inc.',
    'SQ': 'Block Inc.',
    'JPM': 'JPMorgan Chase & Co.',
    'JNJ': 'Johnson & Johnson',
    'PG': 'Procter & Gamble Co.',
    'KO': 'Coca-Cola Company',
    'DIS': 'Walt Disney Company',
    'WMT': 'Walmart Inc.',
    'V': 'Visa Inc.',
    'MA': 'Mastercard Inc.',
    'CAT': 'Caterpillar Inc.',
    'BA': 'Boeing Company',
    'XOM': 'Exxon Mobil Corp.',
    'CVX': 'Chevron Corporation',
    'LMT': 'Lockheed Martin Corp.',
    'GE': 'General Electric Co.',
    'UNH': 'UnitedHealth Group Inc.',
    'ABBV': 'AbbVie Inc.',
    'PFE': 'Pfizer Inc.',
    'LLY': 'Eli Lilly & Co.',
    'TMO': 'Thermo Fisher Scientific',
    'ABT': 'Abbott Laboratories'
  }
  
  return companyNames[symbol] || symbol
}

function getSector(symbol: string): string {
  const sectorMap: { [key: string]: string } = {
    'AAPL': 'Technology',
    'MSFT': 'Technology', 
    'GOOGL': 'Technology',
    'AMZN': 'Consumer Discretionary',
    'TSLA': 'Consumer Discretionary',
    'NVDA': 'Technology',
    'META': 'Communication Services',
    'NFLX': 'Communication Services',
    'CRM': 'Technology',
    'ADBE': 'Technology',
    'NOW': 'Technology',
    'SNOW': 'Technology',
    'PLTR': 'Technology',
    'ZM': 'Communication Services',
    'ROKU': 'Communication Services',
    'SQ': 'Technology',
    'JPM': 'Financials',
    'JNJ': 'Healthcare',
    'PG': 'Consumer Staples',
    'KO': 'Consumer Staples',
    'DIS': 'Communication Services',
    'WMT': 'Consumer Staples',
    'V': 'Technology',
    'MA': 'Technology',
    'CAT': 'Industrials',
    'BA': 'Industrials',
    'XOM': 'Energy',
    'CVX': 'Energy',
    'LMT': 'Industrials',
    'GE': 'Industrials',
    'UNH': 'Healthcare',
    'ABBV': 'Healthcare',
    'PFE': 'Healthcare',
    'LLY': 'Healthcare',
    'TMO': 'Healthcare',
    'ABT': 'Healthcare'
  }
  
  return sectorMap[symbol] || 'Other'
}
