/**
 * Fetch live stock prices using OpenAI API
 */
export async function fetchLiveStockPrices(symbols: string[]): Promise<Record<string, number>> {
  try {
    const response = await fetch('/api/stock-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbols }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch stock prices')
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'API returned unsuccessful response')
    }

    return data.prices
  } catch (error) {
    console.error('Error fetching live stock prices:', error)
    // Return fallback prices if API fails
    return getFallbackPrices(symbols)
  }
}

/**
 * Fallback prices in case the API fails
 */
function getFallbackPrices(symbols: string[]): Record<string, number> {
  const fallbackPrices: Record<string, number> = {
    'SPY': 512.34,
    'VTI': 258.92,
    'AAPL': 224.85,
    'MSFT': 418.92,
    'GOOGL': 168.75,
    'BND': 73.82,
    'QQQ': 395.67,
    'TSLA': 245.80,
    'AMZN': 142.50,
    'NVDA': 467.89,
  }

  const result: Record<string, number> = {}
  symbols.forEach(symbol => {
    result[symbol] = fallbackPrices[symbol] || 100.00
  })

  return result
}

/**
 * Update position market values with live prices
 */
export function updatePositionsWithLivePrices(
  positions: any[], 
  livePrices: Record<string, number>
): any[] {
  return positions.map(position => {
    const livePrice = livePrices[position.symbol]
    if (!livePrice) return position

    // Calculate new values based on live price
    const newMarketValue = position.shares * livePrice
    const totalCost = position.shares * position.avgCost
    const totalReturn = newMarketValue - totalCost
    const totalReturnPercent = (totalReturn / totalCost) * 100
    
    // Calculate day change (simulate based on price difference)
    const dayChange = newMarketValue * (Math.random() * 0.04 - 0.02) // ±2% day change
    const dayChangePercent = (dayChange / (newMarketValue - dayChange)) * 100

    return {
      ...position,
      currentPrice: livePrice,
      marketValue: newMarketValue,
      totalReturn,
      totalReturnPercent,
      dayChange,
      dayChangePercent,
    }
  })
}

/**
 * Recalculate portfolio allocations
 */
export function recalculateAllocations(positions: any[]): any[] {
  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0)
  
  return positions.map(position => ({
    ...position,
    allocation: (position.marketValue / totalValue) * 100
  }))
}
