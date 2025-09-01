import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PortfolioAsset, PortfolioMetrics } from './portfolioStore'

export interface SavedPortfolio {
  id: string
  name: string
  description?: string
  assets: PortfolioAsset[]
  metrics: PortfolioMetrics
  createdAt: Date
  updatedAt: Date
  tags: string[]
  isActive: boolean
  optimizationSettings?: {
    objective: string
    historicalPeriod: string
    maxAssets: string
    constraints?: any
  }
}

interface PortfolioManagementState {
  savedPortfolios: SavedPortfolio[]
  activePortfolioId: string | null
  
  // Portfolio CRUD operations
  createPortfolio: (name: string, description?: string, assets?: PortfolioAsset[]) => string
  savePortfolio: (portfolio: Omit<SavedPortfolio, 'id' | 'createdAt' | 'updatedAt'>) => string
  updatePortfolio: (id: string, updates: Partial<SavedPortfolio>) => void
  deletePortfolio: (id: string) => void
  duplicatePortfolio: (id: string, newName?: string) => string
  
  // Portfolio management
  setActivePortfolio: (id: string) => void
  getActivePortfolio: () => SavedPortfolio | null
  getPortfolioById: (id: string) => SavedPortfolio | null
  getAllPortfolios: () => SavedPortfolio[]
  
  // Search and filtering
  searchPortfolios: (query: string) => SavedPortfolio[]
  getPortfoliosByTag: (tag: string) => SavedPortfolio[]
  
  // Import/Export
  exportPortfolio: (id: string) => string
  exportAllPortfolios: () => string
  importPortfolio: (data: string) => boolean
  importPortfolios: (data: string) => boolean
  
  // Portfolio comparison
  comparePortfolios: (ids: string[]) => {
    portfolios: SavedPortfolio[]
    comparison: {
      expectedReturn: number[]
      volatility: number[]
      sharpeRatio: number[]
      totalValue: number[]
    }
  }
}

// Utility functions
const generateId = (): string => {
  return `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const calculatePortfolioMetrics = (assets: PortfolioAsset[], initialInvestment: number = 100000): PortfolioMetrics => {
  if (assets.length === 0) {
    return {
      totalValue: 0,
      dayPL: 0,
      dayPLPercent: 0,
      totalReturn: 0,
      totalReturnPercent: 0,
      initialInvestment
    }
  }

  const totalValue = assets.reduce((sum, asset) => {
    const value = (initialInvestment * asset.allocation / 100)
    return sum + value
  }, 0)

  const dayPL = assets.reduce((sum, asset) => {
    const value = (initialInvestment * asset.allocation / 100)
    const change = ((asset.currentPrice - asset.previousPrice) / asset.previousPrice) * value
    return sum + change
  }, 0)

  const dayPLPercent = totalValue > 0 ? (dayPL / totalValue) * 100 : 0
  const totalReturn = totalValue - initialInvestment
  const totalReturnPercent = initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0

  return {
    totalValue,
    dayPL,
    dayPLPercent,
    totalReturn,
    totalReturnPercent,
    initialInvestment
  }
}

export const usePortfolioManagementStore = create<PortfolioManagementState>()(
  persist(
    (set, get) => ({
      savedPortfolios: [],
      activePortfolioId: null,

      createPortfolio: (name: string, description?: string, assets: PortfolioAsset[] = []) => {
        const id = generateId()
        const now = new Date()
        const metrics = calculatePortfolioMetrics(assets)
        
        const newPortfolio: SavedPortfolio = {
          id,
          name,
          description,
          assets,
          metrics,
          createdAt: now,
          updatedAt: now,
          tags: [],
          isActive: false
        }

        set(state => ({
          savedPortfolios: [...state.savedPortfolios, newPortfolio]
        }))

        return id
      },

      savePortfolio: (portfolio) => {
        const id = generateId()
        const now = new Date()
        
        const savedPortfolio: SavedPortfolio = {
          ...portfolio,
          id,
          createdAt: now,
          updatedAt: now,
          isActive: false
        }

        set(state => ({
          savedPortfolios: [...state.savedPortfolios, savedPortfolio]
        }))

        return id
      },

      updatePortfolio: (id: string, updates: Partial<SavedPortfolio>) => {
        set(state => ({
          savedPortfolios: state.savedPortfolios.map(portfolio => 
            portfolio.id === id 
              ? { 
                  ...portfolio, 
                  ...updates, 
                  updatedAt: new Date(),
                  // Recalculate metrics if assets changed
                  metrics: updates.assets 
                    ? calculatePortfolioMetrics(updates.assets, portfolio.metrics.initialInvestment)
                    : portfolio.metrics
                }
              : portfolio
          )
        }))
      },

      deletePortfolio: (id: string) => {
        set(state => {
          const newActiveId = state.activePortfolioId === id ? null : state.activePortfolioId
          return {
            savedPortfolios: state.savedPortfolios.filter(portfolio => portfolio.id !== id),
            activePortfolioId: newActiveId
          }
        })
      },

      duplicatePortfolio: (id: string, newName?: string) => {
        const portfolio = get().getPortfolioById(id)
        if (!portfolio) return ''

        const duplicatedPortfolio = {
          ...portfolio,
          name: newName || `${portfolio.name} (Copy)`,
          description: portfolio.description ? `Copy of: ${portfolio.description}` : 'Duplicated portfolio'
        }

        return get().savePortfolio(duplicatedPortfolio)
      },

      setActivePortfolio: (id: string) => {
        set(state => ({
          activePortfolioId: id,
          savedPortfolios: state.savedPortfolios.map(portfolio => ({
            ...portfolio,
            isActive: portfolio.id === id
          }))
        }))
      },

      getActivePortfolio: () => {
        const state = get()
        return state.activePortfolioId 
          ? state.savedPortfolios.find(p => p.id === state.activePortfolioId) || null
          : null
      },

      getPortfolioById: (id: string) => {
        return get().savedPortfolios.find(portfolio => portfolio.id === id) || null
      },

      getAllPortfolios: () => {
        return get().savedPortfolios
      },

      searchPortfolios: (query: string) => {
        const lowercaseQuery = query.toLowerCase()
        return get().savedPortfolios.filter(portfolio => 
          portfolio.name.toLowerCase().includes(lowercaseQuery) ||
          portfolio.description?.toLowerCase().includes(lowercaseQuery) ||
          portfolio.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        )
      },

      getPortfoliosByTag: (tag: string) => {
        return get().savedPortfolios.filter(portfolio => 
          portfolio.tags.includes(tag)
        )
      },

      exportPortfolio: (id: string) => {
        const portfolio = get().getPortfolioById(id)
        if (!portfolio) return ''
        
        return JSON.stringify({
          version: '1.0',
          type: 'single_portfolio',
          data: portfolio
        }, null, 2)
      },

      exportAllPortfolios: () => {
        const portfolios = get().getAllPortfolios()
        
        return JSON.stringify({
          version: '1.0',
          type: 'portfolio_collection',
          data: portfolios,
          exportedAt: new Date()
        }, null, 2)
      },

      importPortfolio: (data: string) => {
        try {
          const parsed = JSON.parse(data)
          
          if (parsed.type === 'single_portfolio' && parsed.data) {
            const portfolio = parsed.data
            delete portfolio.id // Generate new ID
            get().savePortfolio(portfolio)
            return true
          }
          
          return false
        } catch (error) {
          console.error('Failed to import portfolio:', error)
          return false
        }
      },

      importPortfolios: (data: string) => {
        try {
          const parsed = JSON.parse(data)
          
          if (parsed.type === 'portfolio_collection' && Array.isArray(parsed.data)) {
            parsed.data.forEach((portfolio: any) => {
              delete portfolio.id // Generate new ID
              get().savePortfolio(portfolio)
            })
            return true
          }
          
          return false
        } catch (error) {
          console.error('Failed to import portfolios:', error)
          return false
        }
      },

      comparePortfolios: (ids: string[]) => {
        const portfolios = ids.map(id => get().getPortfolioById(id)).filter(Boolean) as SavedPortfolio[]
        
        const comparison = {
          expectedReturn: portfolios.map(p => p.metrics.totalReturnPercent),
          volatility: portfolios.map(p => {
            // Calculate portfolio volatility based on asset allocations
            return p.assets.reduce((vol, asset) => {
              const assetVol = getAssetVolatility(asset.category)
              return vol + (assetVol * asset.allocation / 100)
            }, 0)
          }),
          sharpeRatio: portfolios.map(p => {
            const expectedReturn = p.metrics.totalReturnPercent
            const volatility = p.assets.reduce((vol, asset) => {
              const assetVol = getAssetVolatility(asset.category)
              return vol + (assetVol * asset.allocation / 100)
            }, 0)
            return volatility > 0 ? expectedReturn / volatility : 0
          }),
          totalValue: portfolios.map(p => p.metrics.totalValue)
        }

        return { portfolios, comparison }
      }
    }),
    {
      name: 'portfolio-management-store'
    }
  )
)

// Helper function to get asset volatility by category
const getAssetVolatility = (category: string): number => {
  const volatilities: { [key: string]: number } = {
    'US Stocks': 18.2,
    'International': 20.1,
    'Bonds': 6.5,
    'REITs': 22.8,
    'Commodities': 28.5,
    'Energy': 32.1,
    'Technology': 25.4,
    'Small Cap': 28.9
  }
  return volatilities[category] || 20.0
}
