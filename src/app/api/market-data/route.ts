import { NextResponse } from 'next/server'
import { yahooFinanceService } from '@/lib/yahooFinance'

// Cache to store consistent market data for the session
let marketDataCache: any = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET(request: Request) {
  console.log('API: Starting market data request with Yahoo Finance')
  
  // Check for force refresh parameter
  const url = new URL(request.url)
  const forceRefresh = url.searchParams.get('refresh') === 'true'
  
  // Check if we have valid cached data
  const now = Date.now()
  if (marketDataCache && (now - cacheTimestamp) < CACHE_DURATION && !forceRefresh) {
    console.log('API: Returning cached market data')
    return NextResponse.json({
      success: true,
      data: marketDataCache,
      timestamp: new Date(cacheTimestamp).toISOString(),
      source: 'cached-yahoo'
    })
  }
  
  if (forceRefresh) {
    console.log('API: Force refresh requested, clearing cache')
    marketDataCache = null
  }
  
  try {
    console.log('API: Fetching real market data from Yahoo Finance')

    // Market indices and popular stocks for homepage
    const marketSymbols = [
      'SPY', 'QQQ', 'IWM', 'VTI', // Major ETFs
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', // Tech giants
      'JPM', 'JNJ', 'PG', 'UNH', // Blue chips
      '^GSPC', '^IXIC', '^DJI' // Major indices
    ]
    
    // Get real market data from Yahoo Finance
    console.log('API: Requesting quotes from Yahoo Finance...')
    const quotes = await yahooFinanceService.getMultipleQuotes(marketSymbols);
    
    if (quotes.length === 0) {
      throw new Error('No quotes received from Yahoo Finance')
    }

    console.log(`API: Successfully received ${quotes.length} quotes from Yahoo Finance`)

    // Organize data into categories for homepage display
    const organizedData: {
      indices: Record<string, { price: number; change: number; changePercent: number }>;
      stocks: Record<string, { price: number; change: number; changePercent: number }>;
      crypto: Record<string, { price: number; change: number; changePercent: number }>;
    } = {
      indices: {},
      stocks: {},
      crypto: {}
    }

    // Map Yahoo Finance data to our format
    quotes.forEach(quote => {
      const formattedData = {
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent
      }

      // Categorize by symbol
      switch (quote.symbol) {
        case 'SPY':
          organizedData.indices['S&P 500 (SPY)'] = formattedData
          break
        case 'QQQ':
          organizedData.indices['NASDAQ (QQQ)'] = formattedData
          break
        case 'IWM':
          organizedData.indices['Russell 2000 (IWM)'] = formattedData
          break
        case 'VTI':
          organizedData.indices['Total Market (VTI)'] = formattedData
          break
        case '^GSPC':
          organizedData.indices['S&P 500 Index'] = formattedData
          break
        case '^IXIC':
          organizedData.indices['NASDAQ Index'] = formattedData
          break
        case '^DJI':
          organizedData.indices['Dow Jones'] = formattedData
          break
        case 'AAPL':
          organizedData.stocks['Apple (AAPL)'] = formattedData
          break
        case 'MSFT':
          organizedData.stocks['Microsoft (MSFT)'] = formattedData
          break
        case 'GOOGL':
          organizedData.stocks['Alphabet (GOOGL)'] = formattedData
          break
        case 'AMZN':
          organizedData.stocks['Amazon (AMZN)'] = formattedData
          break
        case 'TSLA':
          organizedData.stocks['Tesla (TSLA)'] = formattedData
          break
        case 'NVDA':
          organizedData.stocks['NVIDIA (NVDA)'] = formattedData
          break
        case 'JPM':
          organizedData.stocks['JPMorgan (JPM)'] = formattedData
          break
        case 'JNJ':
          organizedData.stocks['Johnson & Johnson (JNJ)'] = formattedData
          break
        case 'PG':
          organizedData.stocks['Procter & Gamble (PG)'] = formattedData
          break
        case 'UNH':
          organizedData.stocks['UnitedHealth (UNH)'] = formattedData
          break
      }
    })

    // Cache the data
    marketDataCache = organizedData
    cacheTimestamp = Date.now()
    
    console.log('API: Successfully cached Yahoo Finance data')

    return NextResponse.json({
      success: true,
      data: organizedData,
      timestamp: new Date().toISOString(),
      source: 'yahoo-finance-live'
    })

  } catch (error) {
    console.error('Market data fetch error:', error)
    
    // Return enhanced fallback data as backup
    const fallbackData = {
      indices: {
        'S&P 500 (SPY)': { price: 543.21, change: -3.89, changePercent: -0.71 },
        'NASDAQ (QQQ)': { price: 462.45, change: -8.67, changePercent: -1.84 },
        'Russell 2000 (IWM)': { price: 215.78, change: -4.22, changePercent: -1.92 },
        'Total Market (VTI)': { price: 267.43, change: -2.14, changePercent: -0.79 }
      },
      stocks: {
        'Apple (AAPL)': { price: 218.34, change: -6.52, changePercent: -2.90 },
        'Microsoft (MSFT)': { price: 405.67, change: -8.78, changePercent: -2.12 },
        'Alphabet (GOOGL)': { price: 164.12, change: -3.63, changePercent: -2.16 },
        'Amazon (AMZN)': { price: 139.88, change: -4.04, changePercent: -2.81 },
        'Tesla (TSLA)': { price: 238.45, change: -13.35, changePercent: -5.30 },
        'NVIDIA (NVDA)': { price: 452.33, change: -27.56, changePercent: -5.75 }
      },
      crypto: {
        'Bitcoin': { price: 58750.00, change: -2850.00, changePercent: -4.63 },
        'Ethereum': { price: 2567.30, change: -267.20, changePercent: -9.43 }
      }
    }

    // Cache fallback data if we don't have any cached data
    if (!marketDataCache) {
      marketDataCache = fallbackData
      cacheTimestamp = Date.now()
      console.log('API: Using fallback data due to Yahoo Finance error')
    }

    return NextResponse.json({
      success: true,
      data: marketDataCache,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      source: 'fallback-data'
    })
  }
}
