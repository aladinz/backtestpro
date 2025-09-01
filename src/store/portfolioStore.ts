import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PortfolioAsset {
  symbol: string
  name: string
  allocation: number // percentage
  currentPrice: number
  previousPrice: number
  category: string
}

export interface PortfolioMetrics {
  totalValue: number
  dayPL: number
  dayPLPercent: number
  totalReturn: number
  totalReturnPercent: number
  initialInvestment: number
}

interface PortfolioState {
  assets: PortfolioAsset[]
  metrics: PortfolioMetrics
  lastOptimized: Date | null
  isInitialized: boolean
  
  // Actions
  updatePortfolio: (assets: PortfolioAsset[], initialInvestment?: number) => void
  updateAssetPrices: (priceUpdates: { symbol: string; currentPrice: number }[]) => void
  calculateMetrics: () => void
  initializeDefaultPortfolio: () => void
}

// Market data for ETFs
const ETF_DATA = {
  'SPY': { name: 'SPDR S&P 500 ETF', category: 'US Stocks', basePrice: 551.23 },
  'VTI': { name: 'Vanguard Total Stock Market', category: 'US Stocks', basePrice: 267.89 },
  'VXUS': { name: 'Vanguard Total International Stock', category: 'International', basePrice: 64.21 },
  'BND': { name: 'Vanguard Total Bond Market', category: 'Bonds', basePrice: 77.45 },
  'VNQ': { name: 'Vanguard Real Estate ETF', category: 'REITs', basePrice: 89.67 },
  'VDE': { name: 'Vanguard Energy ETF', category: 'Energy', basePrice: 134.89 },
  'VGT': { name: 'Vanguard Information Technology', category: 'Technology', basePrice: 521.34 },
  'QQQ': { name: 'Invesco QQQ Trust', category: 'Technology', basePrice: 471.45 },
  'IWM': { name: 'iShares Russell 2000', category: 'Small Cap', basePrice: 218.67 },
  'GLD': { name: 'SPDR Gold Trust', category: 'Commodities', basePrice: 238.12 }
}

const generateCurrentPrice = (basePrice: number, volatility: number = 0.02): number => {
  // Generate realistic intraday movements
  const change = (Math.random() - 0.5) * 2 * volatility
  return basePrice * (1 + change)
}

const generatePreviousPrice = (currentPrice: number): number => {
  // Generate previous day's close (simulate overnight gap)
  const overnightChange = (Math.random() - 0.5) * 0.04 // -2% to +2%
  return currentPrice / (1 + overnightChange)
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      assets: [],
      metrics: {
        totalValue: 0,
        dayPL: 0,
        dayPLPercent: 0,
        totalReturn: 0,
        totalReturnPercent: 0,
        initialInvestment: 100000
      },
      lastOptimized: null,
      isInitialized: false,

      initializeDefaultPortfolio: () => {
        const defaultAssets: PortfolioAsset[] = [
          {
            symbol: 'SPY',
            name: ETF_DATA.SPY.name,
            allocation: 35,
            currentPrice: generateCurrentPrice(ETF_DATA.SPY.basePrice),
            previousPrice: 0,
            category: ETF_DATA.SPY.category
          },
          {
            symbol: 'VXUS',
            name: ETF_DATA.VXUS.name,
            allocation: 25,
            currentPrice: generateCurrentPrice(ETF_DATA.VXUS.basePrice),
            previousPrice: 0,
            category: ETF_DATA.VXUS.category
          },
          {
            symbol: 'BND',
            name: ETF_DATA.BND.name,
            allocation: 20,
            currentPrice: generateCurrentPrice(ETF_DATA.BND.basePrice),
            previousPrice: 0,
            category: ETF_DATA.BND.category
          },
          {
            symbol: 'VNQ',
            name: ETF_DATA.VNQ.name,
            allocation: 10,
            currentPrice: generateCurrentPrice(ETF_DATA.VNQ.basePrice),
            previousPrice: 0,
            category: ETF_DATA.VNQ.category
          },
          {
            symbol: 'GLD',
            name: ETF_DATA.GLD.name,
            allocation: 10,
            currentPrice: generateCurrentPrice(ETF_DATA.GLD.basePrice),
            previousPrice: 0,
            category: ETF_DATA.GLD.category
          }
        ]

        // Set previous prices
        defaultAssets.forEach(asset => {
          asset.previousPrice = generatePreviousPrice(asset.currentPrice)
        })

        set({ 
          assets: defaultAssets,
          isInitialized: true,
          lastOptimized: new Date()
        })
        
        get().calculateMetrics()
      },

      updatePortfolio: (newAssets: PortfolioAsset[], initialInvestment = 100000) => {
        set({ 
          assets: newAssets,
          lastOptimized: new Date(),
          metrics: { ...get().metrics, initialInvestment }
        })
        get().calculateMetrics()
      },

      updateAssetPrices: (priceUpdates) => {
        const currentAssets = get().assets
        const updatedAssets = currentAssets.map(asset => {
          const update = priceUpdates.find(u => u.symbol === asset.symbol)
          if (update) {
            return {
              ...asset,
              previousPrice: asset.currentPrice,
              currentPrice: update.currentPrice
            }
          }
          return asset
        })
        
        set({ assets: updatedAssets })
        get().calculateMetrics()
      },

      calculateMetrics: () => {
        const { assets, metrics } = get()
        const initialInvestment = metrics.initialInvestment

        if (assets.length === 0) return

        let totalCurrentValue = 0
        let totalPreviousValue = 0
        let totalInitialValue = initialInvestment

        assets.forEach(asset => {
          const allocation = asset.allocation / 100
          const investmentAmount = initialInvestment * allocation
          
          // Calculate shares owned (assuming we bought at a historical price that's ~10% lower than current for gains)
          const historicalPurchasePrice = asset.currentPrice * 0.9
          const shares = investmentAmount / historicalPurchasePrice
          
          // Current and previous values
          const currentValue = shares * asset.currentPrice
          const previousValue = shares * asset.previousPrice
          
          totalCurrentValue += currentValue
          totalPreviousValue += previousValue
        })

        const dayPL = totalCurrentValue - totalPreviousValue
        const dayPLPercent = totalPreviousValue > 0 ? (dayPL / totalPreviousValue) * 100 : 0
        const totalReturn = totalCurrentValue - totalInitialValue
        const totalReturnPercent = totalInitialValue > 0 ? (totalReturn / totalInitialValue) * 100 : 0

        set({
          metrics: {
            ...metrics,
            totalValue: totalCurrentValue,
            dayPL,
            dayPLPercent,
            totalReturn,
            totalReturnPercent
          }
        })
      }
    }),
    {
      name: 'portfolio-storage',
      partialize: (state) => ({ 
        assets: state.assets, 
        metrics: state.metrics,
        lastOptimized: state.lastOptimized,
        isInitialized: state.isInitialized
      }),
    }
  )
)
