import { useEffect } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'

// Hook to provide live price updates for portfolio assets
export const useLivePriceUpdates = () => {
  const { assets, updateAssetPrices } = usePortfolioStore()

  useEffect(() => {
    if (assets.length === 0) return

    const updatePrices = () => {
      const priceUpdates = assets.map(asset => ({
        symbol: asset.symbol,
        currentPrice: asset.currentPrice * (1 + (Math.random() - 0.5) * 0.004) // Small realistic movements
      }))
      updateAssetPrices(priceUpdates)
    }

    // Update prices every 15 seconds
    const interval = setInterval(updatePrices, 15000)
    return () => clearInterval(interval)
  }, [assets, updateAssetPrices])
}

// Hook to get current portfolio summary for display
export const usePortfolioSummary = () => {
  const { assets, metrics, lastOptimized } = usePortfolioStore()

  const totalAssets = assets.length
  const topPerformer = assets.length > 0 ? assets.reduce((best, current) => {
    const currentGain = ((current.currentPrice - current.previousPrice) / current.previousPrice) * 100
    const bestGain = ((best.currentPrice - best.previousPrice) / best.previousPrice) * 100
    return currentGain > bestGain ? current : best
  }) : null

  const portfolioValue = metrics.totalValue
  const dayChange = metrics.dayPL
  const dayChangePercent = metrics.dayPLPercent

  return {
    totalAssets,
    topPerformer,
    portfolioValue,
    dayChange,
    dayChangePercent,
    lastOptimized,
    isOptimized: !!lastOptimized
  }
}
