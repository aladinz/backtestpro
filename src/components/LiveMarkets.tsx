'use client'

import React, { useState } from 'react'

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

// Initial state with loading indicators
const initialData: MarketData[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 0, change: 0, changePercent: 0 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 0, change: 0, changePercent: 0 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 0, change: 0, changePercent: 0 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 0, change: 0, changePercent: 0 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 0, change: 0, changePercent: 0 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 0, change: 0, changePercent: 0 },
]

class LiveMarketsComponent extends React.Component<{}, { stockData: MarketData[], isLoading: boolean, error: string | null, lastUpdate: string | null, mounted: boolean }> {
  private intervalId: NodeJS.Timeout | null = null

  constructor(props: {}) {
    super(props)
    console.log('LiveMarkets: Constructor called')
    this.state = {
      stockData: initialData,
      isLoading: true,
      error: null,
      lastUpdate: null,
      mounted: false
    }
  }

  async componentDidMount() {
    console.log('LiveMarkets: componentDidMount called - starting data fetch')
    try {
      this.setState({ mounted: true })
      await this.fetchMarketData()
      
      // Set up interval for updates every 5 seconds
      this.intervalId = setInterval(() => {
        console.log('LiveMarkets: Interval update triggered')
        this.fetchMarketData()
      }, 5000)
    } catch (error) {
      console.error('LiveMarkets: Error in componentDidMount:', error)
      this.setState({ 
        mounted: true, 
        error: 'Failed to initialize component',
        isLoading: false 
      })
    }
  }

  componentWillUnmount() {
    console.log('LiveMarkets: componentWillUnmount called')
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  fetchMarketData = async () => {
    console.log('LiveMarkets: fetchMarketData called')
    try {
      const response = await fetch('/api/market-data')
      console.log('LiveMarkets: API response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      console.log('LiveMarkets: API response data:', data)

      if (data.success && data.data) {
        console.log('LiveMarkets: Setting stock data:', data.data)
        // Ensure data.data is an array
        const stockArray = Array.isArray(data.data) ? data.data : []
        this.setState({
          stockData: stockArray,
          isLoading: false,
          error: null,
          lastUpdate: new Date().toLocaleTimeString()
        })
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('LiveMarkets: Error fetching market data:', error)
      this.setState({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
        lastUpdate: new Date().toLocaleTimeString()
      })
    }
  }

  render() {
    const { stockData, isLoading, error, lastUpdate, mounted } = this.state
    console.log('LiveMarkets: render called - stockData:', stockData, 'isLoading:', isLoading, 'error:', error)

    // Ensure stockData is always an array
    const safeStockData = Array.isArray(stockData) ? stockData : initialData

    // Prevent hydration mismatch by not rendering dynamic content until mounted
    if (!mounted) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Live Markets</h2>
            <div className="flex items-center text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
              Connecting...
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialData.slice(0, 3).map((stock) => (
              <div key={stock.symbol} className="bg-slate-800/50 rounded-lg shadow-md p-4 border border-slate-600">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{stock.symbol}</h3>
                    <p className="text-sm text-slate-400">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="h-6 w-16 bg-slate-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center text-sm text-slate-400">
            Initializing market data connection...
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Error loading market data: {error}</p>
          <button 
            onClick={this.fetchMarketData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Live Markets</h2>
          {isLoading && (
            <div className="flex items-center text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
              Loading...
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeStockData.map((stock) => (
            <div key={stock.symbol} className="bg-slate-800/50 rounded-lg shadow-md p-4 border border-slate-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white">{stock.symbol}</h3>
                  <p className="text-sm text-slate-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    ${stock.price > 0 ? stock.price.toFixed(2) : '--'}
                  </p>
                  {stock.change !== 0 && (
                    <p className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </p>
                  )}
                </div>
              </div>
              
              {stock.price === 0 && (
                <div className="mt-2">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-2 bg-slate-700 rounded"></div>
                      <div className="space-y-1">
                        <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center text-sm text-slate-400">
          {lastUpdate ? `Last updated: ${lastUpdate}` : 'Loading...'}
        </div>
      </div>
    )
  }
}

export default function LiveMarkets() {
  console.log('LiveMarkets: Function component wrapper called')
  return <LiveMarketsComponent />
}
