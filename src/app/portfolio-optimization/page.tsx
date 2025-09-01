'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Play, 
  PieChart,
  Target,
  Activity,
  LineChart,
  Zap,
  ArrowLeft,
  CheckCircle,
  Plus,
  X,
  AlertCircle,
  Save,
  Folder,
  FolderOpen
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from 'recharts'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { usePortfolioStore, PortfolioAsset } from '@/store/portfolioStore'
import { usePortfolioManagementStore, SavedPortfolio } from '@/store/portfolioManagementStore'
import PortfolioManagement from '@/components/PortfolioManagement'
import { useRouter } from 'next/navigation'

// Sample efficient frontier data
const efficientFrontierData = [
  { risk: 5, return: 3 },
  { risk: 8, return: 4.5 },
  { risk: 12, return: 6 },
  { risk: 15, return: 7.2 },
  { risk: 18, return: 8.1 },
  { risk: 22, return: 8.8 },
  { risk: 25, return: 9.2 },
  { risk: 30, return: 9.5 },
]

// Enhanced portfolio allocation interface
interface AllocationItem {
  name: string
  symbol?: string
  value: number
  expectedReturn?: number
  volatility?: number
  beta?: number
  riskLevel?: string
  color: string
  contributionToReturn?: number
  contributionToRisk?: number
}

// Sample optimized portfolio allocation
const portfolioAllocation: AllocationItem[] = [
  { 
    name: 'US Stocks', 
    value: 35, 
    color: '#3B82F6',
    expectedReturn: 10.5,
    volatility: 18.2,
    riskLevel: 'Medium',
    contributionToReturn: 3.68,
    contributionToRisk: 6.37
  },
  { 
    name: 'International Stocks', 
    value: 25, 
    color: '#10B981',
    expectedReturn: 8.7,
    volatility: 20.1,
    riskLevel: 'Medium',
    contributionToReturn: 2.18,
    contributionToRisk: 5.03
  },
  { 
    name: 'Bonds', 
    value: 20, 
    color: '#F59E0B',
    expectedReturn: 4.2,
    volatility: 6.5,
    riskLevel: 'Low',
    contributionToReturn: 0.84,
    contributionToRisk: 1.30
  },
  { 
    name: 'REITs', 
    value: 10, 
    color: '#EF4444',
    expectedReturn: 9.1,
    volatility: 25.3,
    riskLevel: 'High',
    contributionToReturn: 0.91,
    contributionToRisk: 2.53
  },
  { 
    name: 'Commodities', 
    value: 10, 
    color: '#8B5CF6',
    expectedReturn: 7.3,
    volatility: 24.8,
    riskLevel: 'High',
    contributionToReturn: 0.73,
    contributionToRisk: 2.48
  },
]

// ETF mappings for optimization
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

const generateCurrentPrice = (basePrice: number): number => {
  const change = (Math.random() - 0.5) * 0.04 // -2% to +2%
  return basePrice * (1 + change)
}

// Sample assets for selection
const availableAssets = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'US Stocks', selected: true },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market', category: 'US Stocks', selected: true },
  { symbol: 'VXUS', name: 'Vanguard Total International Stock', category: 'International', selected: true },
  { symbol: 'BND', name: 'Vanguard Total Bond Market', category: 'Bonds', selected: true },
  { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', category: 'REITs', selected: false },
  { symbol: 'VDE', name: 'Vanguard Energy ETF', category: 'Energy', selected: false },
  { symbol: 'VGT', name: 'Vanguard Information Technology', category: 'Technology', selected: false },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Technology', selected: false },
  { symbol: 'IWM', name: 'iShares Russell 2000', category: 'Small Cap', selected: false },
  { symbol: 'GLD', name: 'SPDR Gold Trust', category: 'Commodities', selected: false },
]

export default function PortfolioOptimization() {
  const router = useRouter()
  const { updatePortfolio, assets: currentAssets, metrics } = usePortfolioStore()
  const { 
    savePortfolio, 
    getActivePortfolio, 
    setActivePortfolio,
    updatePortfolio: updateSavedPortfolio 
  } = usePortfolioManagementStore()
  
  const [optimizationObjective, setOptimizationObjective] = useState('Maximum Sharpe Ratio')
  const [historicalPeriod, setHistoricalPeriod] = useState('12 Months')
  const [maxAssets, setMaxAssets] = useState('15 Assets')
  const [selectedAssets, setSelectedAssets] = useState(availableAssets)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationComplete, setOptimizationComplete] = useState(false)
  const [currentAllocation, setCurrentAllocation] = useState(portfolioAllocation)
  const [optimizedResults, setOptimizedResults] = useState<PortfolioAsset[]>([])
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    expectedReturn: 0,
    volatility: 0,
    sharpeRatio: 0,
    maxDrawdown: 0
  })
  
  // Portfolio management state
  const [showPortfolioManager, setShowPortfolioManager] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [savePortfolioForm, setSavePortfolioForm] = useState({
    name: '',
    description: '',
    tags: ''
  })
  
  // Custom ticker state management
  const [customTicker, setCustomTicker] = useState('')
  const [customAssets, setCustomAssets] = useState<string[]>([])
  const [tickerValidation, setTickerValidation] = useState<{
    isValid: boolean
    message: string
    isLoading: boolean
  }>({ isValid: false, message: '', isLoading: false })
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Calculate dynamic optimization metrics based on selected assets or optimized results
  const calculateOptimizationMetrics = (optimizedAssets?: PortfolioAsset[]) => {
    const selected = optimizedAssets || selectedAssets.filter(asset => asset.selected)
    if (selected.length === 0) {
      return {
        expectedReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      }
    }
    
    // Risk-free rate (current 10-year Treasury rate approximation)
    const riskFreeRate = 4.5
    
    // Asset characteristics with expected returns and volatilities
    const assetData: { [key: string]: { return: number; volatility: number; beta: number } } = {
      'US Stocks': { return: 10.5, volatility: 18.2, beta: 1.0 },
      'International': { return: 8.7, volatility: 20.1, beta: 0.85 },
      'Bonds': { return: 4.2, volatility: 6.5, beta: 0.15 },
      'REITs': { return: 9.1, volatility: 25.3, beta: 0.65 },
      'Technology': { return: 12.8, volatility: 28.7, beta: 1.25 },
      'Energy': { return: 8.9, volatility: 32.1, beta: 1.15 },
      'Small Cap': { return: 11.2, volatility: 26.4, beta: 1.35 },
      'Commodities': { return: 7.3, volatility: 24.8, beta: 0.45 },
      'Custom': { return: 9.5, volatility: 22.0, beta: 1.0 },
      'Default': { return: 8.0, volatility: 20.0, beta: 1.0 }
    }
    
    // Correlation matrix (simplified - in reality would be much larger)
    const correlationMatrix: { [key: string]: { [key: string]: number } } = {
      'US Stocks': { 'US Stocks': 1.0, 'International': 0.75, 'Bonds': -0.1, 'REITs': 0.6, 'Technology': 0.85, 'Energy': 0.4, 'Small Cap': 0.8, 'Commodities': 0.2, 'Custom': 0.7, 'Default': 0.7 },
      'International': { 'US Stocks': 0.75, 'International': 1.0, 'Bonds': -0.05, 'REITs': 0.5, 'Technology': 0.7, 'Energy': 0.35, 'Small Cap': 0.65, 'Commodities': 0.25, 'Custom': 0.6, 'Default': 0.6 },
      'Bonds': { 'US Stocks': -0.1, 'International': -0.05, 'Bonds': 1.0, 'REITs': 0.1, 'Technology': -0.15, 'Energy': -0.05, 'Small Cap': -0.2, 'Commodities': 0.15, 'Custom': 0.0, 'Default': 0.0 },
      'REITs': { 'US Stocks': 0.6, 'International': 0.5, 'Bonds': 0.1, 'REITs': 1.0, 'Technology': 0.45, 'Energy': 0.3, 'Small Cap': 0.55, 'Commodities': 0.4, 'Custom': 0.5, 'Default': 0.5 },
      'Technology': { 'US Stocks': 0.85, 'International': 0.7, 'Bonds': -0.15, 'REITs': 0.45, 'Technology': 1.0, 'Energy': 0.25, 'Small Cap': 0.75, 'Commodities': 0.1, 'Custom': 0.65, 'Default': 0.65 },
      'Energy': { 'US Stocks': 0.4, 'International': 0.35, 'Bonds': -0.05, 'REITs': 0.3, 'Technology': 0.25, 'Energy': 1.0, 'Small Cap': 0.45, 'Commodities': 0.6, 'Custom': 0.4, 'Default': 0.4 },
      'Small Cap': { 'US Stocks': 0.8, 'International': 0.65, 'Bonds': -0.2, 'REITs': 0.55, 'Technology': 0.75, 'Energy': 0.45, 'Small Cap': 1.0, 'Commodities': 0.3, 'Custom': 0.7, 'Default': 0.7 },
      'Commodities': { 'US Stocks': 0.2, 'International': 0.25, 'Bonds': 0.15, 'REITs': 0.4, 'Technology': 0.1, 'Energy': 0.6, 'Small Cap': 0.3, 'Commodities': 1.0, 'Custom': 0.3, 'Default': 0.3 },
      'Custom': { 'US Stocks': 0.7, 'International': 0.6, 'Bonds': 0.0, 'REITs': 0.5, 'Technology': 0.65, 'Energy': 0.4, 'Small Cap': 0.7, 'Commodities': 0.3, 'Custom': 1.0, 'Default': 0.8 },
      'Default': { 'US Stocks': 0.7, 'International': 0.6, 'Bonds': 0.0, 'REITs': 0.5, 'Technology': 0.65, 'Energy': 0.4, 'Small Cap': 0.7, 'Commodities': 0.3, 'Custom': 0.8, 'Default': 1.0 }
    }
    
    // Calculate weights
    const weights: number[] = []
    const assets: { category: string; data: typeof assetData[string] }[] = []
    let totalAllocation = 0
    
    selected.forEach(asset => {
      const allocation = optimizedAssets ? ((asset as any).allocation || 100/selected.length) : 100/selected.length
      totalAllocation += allocation
      const category = asset.category || 'Default'
      const data = assetData[category] || assetData['Default']
      
      weights.push(allocation)
      assets.push({ category, data })
    })
    
    // Normalize weights to sum to 100%
    const normalizedWeights = weights.map(w => w / totalAllocation)
    
    // Calculate portfolio expected return (weighted average)
    let portfolioReturn = 0
    normalizedWeights.forEach((weight, i) => {
      portfolioReturn += weight * assets[i].data.return
    })
    
    // Calculate portfolio volatility using proper correlation matrix
    let portfolioVariance = 0
    normalizedWeights.forEach((wi, i) => {
      normalizedWeights.forEach((wj, j) => {
        const categoryI = assets[i].category
        const categoryJ = assets[j].category
        const volatilityI = assets[i].data.volatility
        const volatilityJ = assets[j].data.volatility
        const correlation = correlationMatrix[categoryI]?.[categoryJ] || 0.5
        
        portfolioVariance += wi * wj * volatilityI * volatilityJ * correlation
      })
    })
    
    const portfolioVolatility = Math.sqrt(portfolioVariance / 10000) // Convert from percentage squared
    
    // Calculate Sharpe Ratio with proper risk-free rate
    const sharpeRatio = portfolioVolatility > 0 ? (portfolioReturn - riskFreeRate) / portfolioVolatility : 0
    
    // Calculate Max Drawdown using improved estimation
    // Based on portfolio beta, volatility, and diversification
    const portfolioBeta = normalizedWeights.reduce((sum, weight, i) => sum + weight * assets[i].data.beta, 0)
    const diversificationFactor = selected.length > 1 ? Math.min(1, Math.log(selected.length) / Math.log(10)) : 0
    
    // Max drawdown estimation: Higher beta and volatility = higher drawdown potential
    // Diversification reduces maximum drawdown
    const baseMaxDrawdown = portfolioVolatility * portfolioBeta * 1.5
    const diversifiedMaxDrawdown = baseMaxDrawdown * (1 - diversificationFactor * 0.3)
    const maxDrawdown = -Math.min(diversifiedMaxDrawdown, portfolioVolatility * 2.5)
    
    return {
      expectedReturn: Number(portfolioReturn.toFixed(1)),
      volatility: Number(portfolioVolatility.toFixed(1)),
      sharpeRatio: Number(sharpeRatio.toFixed(2)),
      maxDrawdown: Number(maxDrawdown.toFixed(1))
    }
  }

  // Load current portfolio allocation on mount
  useEffect(() => {
    if (currentAssets.length > 0) {
      const assetData = {
        'US Stocks': { return: 10.5, volatility: 18.2, beta: 1.0 },
        'International': { return: 8.7, volatility: 20.1, beta: 0.85 },
        'Bonds': { return: 4.2, volatility: 6.5, beta: 0.15 },
        'REITs': { return: 9.1, volatility: 25.3, beta: 0.65 },
        'Technology': { return: 12.8, volatility: 28.7, beta: 1.25 },
        'Energy': { return: 8.9, volatility: 32.1, beta: 1.15 },
        'Small Cap': { return: 11.2, volatility: 26.4, beta: 1.35 },
        'Commodities': { return: 7.3, volatility: 24.8, beta: 0.45 },
        'Custom': { return: 9.5, volatility: 22.0, beta: 1.0 },
        'Default': { return: 8.0, volatility: 20.0, beta: 1.0 }
      }

      const allocation: AllocationItem[] = currentAssets.map(asset => {
        const data = assetData[asset.category as keyof typeof assetData] || assetData['Default']
        const riskLevel = data.volatility <= 15 ? 'Low' : data.volatility <= 25 ? 'Medium' : 'High'
        
        return {
          name: asset.category,
          symbol: asset.symbol,
          value: asset.allocation,
          expectedReturn: data.return,
          volatility: data.volatility,
          beta: data.beta,
          riskLevel,
          color: getColorForCategory(asset.symbol || asset.category),
          contributionToReturn: (asset.allocation / 100) * data.return,
          contributionToRisk: (asset.allocation / 100) * data.volatility
        }
      })
      setCurrentAllocation(allocation)
    }
  }, [currentAssets])

  // Calculate portfolio metrics when selected assets change
  useEffect(() => {
    const selectedAssetsList = selectedAssets.filter(asset => asset.selected)
    if (selectedAssetsList.length > 0) {
      const metrics = calculateOptimizationMetrics()
      setPortfolioMetrics(metrics)
    } else {
      // Reset metrics when no assets are selected
      setPortfolioMetrics({
        expectedReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      })
    }
  }, [selectedAssets])

  // Initialize with some default selected assets on mount
  useEffect(() => {
    // Select a few default assets for better initial experience
    const defaultSelectedAssets = selectedAssets.map((asset, index) => ({
      ...asset,
      selected: index < 4 // Select first 4 assets by default
    }))
    setSelectedAssets(defaultSelectedAssets)
  }, []) // Empty dependency array - run only on mount

  // Test function for manual optimization testing
  const testOptimization = () => {
    console.log('🧪 MANUAL TEST: Starting optimization test...')
    handleOptimize()
  }

  // Make test function available globally for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testOptimization = testOptimization
      console.log('🔧 Debug function available: window.testOptimization()')
    }
  }, [])

  // Auto-test optimization for debugging
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('debug=auto')) {
      console.log('🤖 AUTO-TEST: Scheduling optimization test in 3 seconds...')
      const timer = setTimeout(() => {
        console.log('🤖 AUTO-TESTING OPTIMIZATION BUTTON...')
        testOptimization()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, []) // Run once on mount

  // Generate dynamic efficient frontier data based on current portfolio
  const generateEfficientFrontierData = () => {
    const baseReturn = portfolioMetrics.expectedReturn || 8
    const baseRisk = portfolioMetrics.volatility || 15
    
    // Create efficient frontier curve around current portfolio
    return [
      { risk: Math.max(baseRisk * 0.4, 3), return: Math.max(baseReturn * 0.6, 2) },
      { risk: Math.max(baseRisk * 0.6, 5), return: Math.max(baseReturn * 0.75, 3.5) },
      { risk: Math.max(baseRisk * 0.8, 8), return: Math.max(baseReturn * 0.85, 5) },
      { risk: baseRisk, return: baseReturn }, // Current portfolio point
      { risk: baseRisk * 1.2, return: baseReturn * 1.1 },
      { risk: baseRisk * 1.4, return: baseReturn * 1.15 },
      { risk: baseRisk * 1.6, return: baseReturn * 1.18 },
      { risk: baseRisk * 1.8, return: baseReturn * 1.2 },
    ].map(point => ({
      risk: Number(point.risk.toFixed(1)),
      return: Number(point.return.toFixed(1))
    }))
  }

  const getColorForCategory = (category: string): string => {
    const colors: { [key: string]: string } = {
      'US Stocks': '#3B82F6',
      'International': '#10B981',
      'Bonds': '#F59E0B',
      'REITs': '#EF4444',
      'Commodities': '#8B5CF6',
      'Energy': '#F97316',
      'Technology': '#6366F1',
      'Small Cap': '#EC4899',
      'Custom': '#64748B'
    }
    
    // If it's a predefined category, return its color
    if (colors[category]) {
      return colors[category]
    }
    
    // For custom assets (like individual stock symbols), generate a beautiful color
    return generateColorFromString(category)
  }

  // Generate beautiful, consistent colors from string hash
  const generateColorFromString = (str: string): string => {
    const beautifulColors = [
      '#3B82F6', // Blue
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#8B5CF6', // Violet
      '#F97316', // Orange
      '#6366F1', // Indigo
      '#EC4899', // Pink
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#F472B6', // Rose
      '#A855F7', // Purple
      '#14B8A6', // Teal
      '#F97316', // Orange
      '#8B5CF6', // Violet
      '#22C55E', // Green
      '#3B82F6', // Blue
      '#DC2626', // Red
      '#7C3AED', // Violet
      '#059669'  // Emerald
    ]
    
    // Simple hash function to convert string to number
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Use absolute value and modulo to get consistent color index
    const colorIndex = Math.abs(hash) % beautifulColors.length
    return beautifulColors[colorIndex]
  }

  // Ticker validation function
  const validateTicker = async (ticker: string) => {
    if (ticker.length < 1) {
      setTickerValidation({ isValid: false, message: '', isLoading: false })
      setShowSuggestions(false)
      return
    }

    setTickerValidation({ isValid: false, message: '', isLoading: true })
    setShowSuggestions(false)

    // Show suggestions for partial matches
    if (ticker.length >= 1 && ticker.length <= 2) {
      setShowSuggestions(true)
    }

    // Simulate ticker validation (in real app, this would call an API)
    setTimeout(() => {
      const cleanTicker = ticker.toUpperCase().trim()
      
      // Check if already exists
      if (availableAssets.some(asset => asset.symbol === cleanTicker) || 
          customAssets.includes(cleanTicker)) {
        setTickerValidation({
          isValid: false,
          message: 'Asset already in list',
          isLoading: false
        })
        return
      }

      // Basic validation (1-5 characters, letters only)
      if (/^[A-Z]{1,5}$/.test(cleanTicker)) {
        setTickerValidation({
          isValid: true,
          message: `${cleanTicker} ready to add`,
          isLoading: false
        })
      } else {
        setTickerValidation({
          isValid: false,
          message: 'Invalid ticker format',
          isLoading: false
        })
      }
    }, 300)
  }

  // Popular ticker suggestions
  const popularTickers = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX',
    'AMD', 'INTC', 'CRM', 'PYPL', 'ADBE', 'ORCL', 'UBER', 'SNOW'
  ]

  const getTickerSuggestions = (input: string) => {
    if (!input) return popularTickers.slice(0, 8)
    return popularTickers.filter(ticker => 
      ticker.toLowerCase().includes(input.toLowerCase()) ||
      ticker.startsWith(input.toUpperCase())
    ).slice(0, 6)
  }

  // Handle custom ticker input
  const handleTickerChange = (value: string) => {
    setCustomTicker(value)
    validateTicker(value)
  }

  // Add custom asset
  const addCustomAsset = () => {
    if (tickerValidation.isValid && customTicker.trim()) {
      const newTicker = customTicker.toUpperCase().trim()
      setCustomAssets(prev => [...prev, newTicker])
      
      // Add to selected assets as asset object
      const newAsset = {
        symbol: newTicker,
        name: `${newTicker} (Custom)`,
        category: 'Custom',
        selected: true
      }
      setSelectedAssets(prev => [...prev, newAsset])
      
      setCustomTicker('')
      setTickerValidation({ isValid: false, message: '', isLoading: false })
    }
  }

  // Remove custom asset
  const removeCustomAsset = (ticker: string) => {
    setCustomAssets(prev => prev.filter(asset => asset !== ticker))
    setSelectedAssets(prev => prev.filter(asset => asset.symbol !== ticker))
  }

  // Handle Enter key for adding custom assets
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tickerValidation.isValid) {
      addCustomAsset()
    }
  }

  const handleAssetToggle = (index: number) => {
    setSelectedAssets(prevAssets => {
      const updated = [...prevAssets]
      updated[index] = { ...updated[index], selected: !updated[index].selected }
      return updated
    })
  }

  const runOptimization = (): PortfolioAsset[] => {
    const selected = selectedAssets.filter(asset => asset.selected)
    console.log('Running optimization for assets:', selected.map(a => `${a.symbol} (${a.category})`))
    
    if (selected.length === 0) {
      console.log('No assets selected for optimization')
      return []
    }
    
    // Asset risk/return data (same as in calculateOptimizationMetrics)
    const assetData: { [key: string]: { return: number; volatility: number; beta: number } } = {
      'US Stocks': { return: 10.5, volatility: 18.2, beta: 1.0 },
      'International': { return: 8.7, volatility: 20.1, beta: 0.85 },
      'Bonds': { return: 4.2, volatility: 6.5, beta: 0.15 },
      'REITs': { return: 9.1, volatility: 25.3, beta: 0.65 },
      'Technology': { return: 12.8, volatility: 28.7, beta: 1.25 },
      'Energy': { return: 8.9, volatility: 32.1, beta: 1.15 },
      'Small Cap': { return: 11.2, volatility: 26.4, beta: 1.35 },
      'Commodities': { return: 7.3, volatility: 24.8, beta: 0.45 },
      'Custom': { return: 9.5, volatility: 22.0, beta: 1.0 },
      'Default': { return: 8.0, volatility: 20.0, beta: 1.0 }
    }
    
    let allocations: number[] = []
    
    switch (optimizationObjective) {
      case 'Maximum Sharpe Ratio':
        // Optimize for risk-adjusted returns using Sharpe ratio
        const sharpeRatios = selected.map(asset => {
          const data = assetData[asset.category] || assetData['Default']
          return (data.return - 4.5) / data.volatility // Risk-adjusted return
        })
        
        // Weight by Sharpe ratio with some diversification constraints
        const totalSharpe = sharpeRatios.reduce((sum, ratio) => sum + Math.max(ratio, 0.1), 0)
        allocations = sharpeRatios.map((ratio, index) => {
          const baseWeight = Math.max(ratio, 0.1) / totalSharpe
          // Apply diversification constraints (min 5%, max 40%)
          return Math.max(5, Math.min(40, baseWeight * 100))
        })
        break
        
      case 'Minimum Volatility':
        // Optimize for minimum portfolio volatility
        const volatilities = selected.map(asset => {
          const data = assetData[asset.category] || assetData['Default']
          return data.volatility
        })
        
        // Inverse volatility weighting with correlation adjustments
        const invVolatilities = volatilities.map(vol => 1 / vol)
        const totalInvVol = invVolatilities.reduce((sum, inv) => sum + inv, 0)
        
        allocations = invVolatilities.map((invVol, index) => {
          const baseWeight = invVol / totalInvVol
          const data = assetData[selected[index].category] || assetData['Default']
          
          // Favor low-risk assets more heavily
          const riskAdjustment = data.volatility < 15 ? 1.5 : data.volatility < 25 ? 1.0 : 0.7
          return Math.max(3, Math.min(50, baseWeight * 100 * riskAdjustment))
        })
        break
        
      case 'Maximum Return':
        // Optimize for maximum expected return
        const returns = selected.map(asset => {
          const data = assetData[asset.category] || assetData['Default']
          return data.return
        })
        
        const totalReturns = returns.reduce((sum, ret) => sum + ret, 0)
        allocations = returns.map(ret => {
          const baseWeight = ret / totalReturns
          // Apply concentration limits (min 8%, max 35%)
          return Math.max(8, Math.min(35, baseWeight * 100))
        })
        break
        
      case 'Equal Weight':
        allocations = selected.map(() => 100 / selected.length)
        break
        
      default:
        // Risk Parity - equal risk contribution
        const riskContributions = selected.map(asset => {
          const data = assetData[asset.category] || assetData['Default']
          return 1 / data.volatility // Inverse volatility for equal risk
        })
        
        const totalRisk = riskContributions.reduce((sum, risk) => sum + risk, 0)
        allocations = riskContributions.map(risk => (risk / totalRisk) * 100)
    }
    
    // Normalize to exactly 100%
    const total = allocations.reduce((sum, val) => sum + val, 0)
    allocations = allocations.map(val => (val / total) * 100)
    
    // Ensure minimum allocation of 2% and maximum of 45% for diversification
    allocations = allocations.map(alloc => Math.max(2, Math.min(45, alloc)))
    
    // Final normalization after constraints
    const finalTotal = allocations.reduce((sum, val) => sum + val, 0)
    allocations = allocations.map(val => (val / finalTotal) * 100)
    
    const result = selected.map((asset, index) => ({
      symbol: asset.symbol,
      name: asset.name,
      allocation: Math.round(allocations[index] * 10) / 10, // Round to 1 decimal
      currentPrice: generateCurrentPrice(
        ETF_DATA[asset.symbol as keyof typeof ETF_DATA]?.basePrice || 100
      ),
      previousPrice: generateCurrentPrice(
        ETF_DATA[asset.symbol as keyof typeof ETF_DATA]?.basePrice || 100
      ) * 0.998, // Slight previous difference
      category: asset.category
    }))
    
    console.log('Optimization result:', result)
    return result
  }

  const handleOptimize = async () => {
    const selected = selectedAssets.filter(asset => asset.selected)
    console.log('🚀 OPTIMIZATION STARTED')
    console.log('📊 Selected assets count:', selected.length)
    console.log('📋 Selected assets:', selected.map(a => `${a.symbol} (${a.category})`))
    console.log('🎯 Optimization objective:', optimizationObjective)
    
    if (selected.length < 2) {
      console.log('❌ Not enough assets selected for optimization (minimum 2 required)')
      alert('Please select at least 2 assets for optimization')
      return
    }
    
    setIsOptimizing(true)
    setOptimizationComplete(false)
    console.log('⏳ Starting 3-second optimization simulation...')
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Run optimization and update portfolio
    const optimizedAssets = runOptimization()
    console.log('✅ Optimization complete!')
    console.log('📈 Optimized portfolio:', optimizedAssets.map(a => `${a.symbol}: ${a.allocation}%`))
    
    // Save optimized results for metrics calculation
    setOptimizedResults(optimizedAssets)
    
    updatePortfolio(optimizedAssets, metrics.initialInvestment)
    
    // Update local allocation display with enhanced data
    const newAllocation = optimizedAssets.map(asset => {
      const assetData = {
        'US Stocks': { return: 10.5, volatility: 18.2, beta: 1.0 },
        'International': { return: 8.7, volatility: 20.1, beta: 0.85 },
        'Bonds': { return: 4.2, volatility: 6.5, beta: 0.15 },
        'REITs': { return: 9.1, volatility: 25.3, beta: 0.65 },
        'Technology': { return: 12.8, volatility: 28.7, beta: 1.25 },
        'Energy': { return: 8.9, volatility: 32.1, beta: 1.15 },
        'Small Cap': { return: 11.2, volatility: 26.4, beta: 1.35 },
        'Commodities': { return: 7.3, volatility: 24.8, beta: 0.45 },
        'Custom': { return: 9.5, volatility: 22.0, beta: 1.0 },
        'Default': { return: 8.0, volatility: 20.0, beta: 1.0 }
      }
      
      const data = assetData[asset.category as keyof typeof assetData] || assetData['Default']
      const riskLevel = data.volatility <= 15 ? 'Low' : data.volatility <= 25 ? 'Medium' : 'High'
      
      return {
        name: asset.category,
        symbol: asset.symbol,
        value: asset.allocation,
        expectedReturn: data.return,
        volatility: data.volatility,
        beta: data.beta,
        riskLevel,
        color: getColorForCategory(asset.category),
        contributionToReturn: (asset.allocation / 100) * data.return,
        contributionToRisk: (asset.allocation / 100) * data.volatility
      }
    })
    setCurrentAllocation(newAllocation)
    console.log('🎨 Updated allocation display:', newAllocation)
    
    // Update portfolio metrics based on optimized results
    const newMetrics = calculateOptimizationMetrics(optimizedAssets)
    setPortfolioMetrics(newMetrics)
    console.log('📊 New portfolio metrics:', newMetrics)
    
    setIsOptimizing(false)
    setOptimizationComplete(true)
    console.log('🎉 Portfolio optimization completed successfully!')
    
  // Hide completion message after 5 seconds (increased from 3)
  setTimeout(() => setOptimizationComplete(false), 5000)
}

// Portfolio management functions
const handleSavePortfolio = () => {
  if (!savePortfolioForm.name.trim()) return
  
  const portfolio = {
    name: savePortfolioForm.name,
    description: savePortfolioForm.description,
    assets: optimizedResults.length > 0 ? optimizedResults : currentAssets,
    metrics: metrics,
    tags: savePortfolioForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    isActive: false,
    optimizationSettings: {
      objective: optimizationObjective,
      historicalPeriod: historicalPeriod,
      maxAssets: maxAssets
    }
  }
  
  savePortfolio(portfolio)
  setShowSaveModal(false)
  setSavePortfolioForm({ name: '', description: '', tags: '' })
}

const handleLoadPortfolio = (portfolio: SavedPortfolio) => {
  // Load portfolio assets into the optimizer
  updatePortfolio(portfolio.assets, portfolio.metrics.initialInvestment)
  
  // Update selected assets based on loaded portfolio
  const updatedSelectedAssets = availableAssets.map(asset => ({
    ...asset,
    selected: portfolio.assets.some(pAsset => pAsset.symbol === asset.symbol)
  }))
  setSelectedAssets(updatedSelectedAssets)
  
  // Update optimization settings if available
  if (portfolio.optimizationSettings) {
    setOptimizationObjective(portfolio.optimizationSettings.objective)
    setHistoricalPeriod(portfolio.optimizationSettings.historicalPeriod)
    setMaxAssets(portfolio.optimizationSettings.maxAssets)
  }
  
  // Set as active portfolio
  setActivePortfolio(portfolio.id)
  setShowPortfolioManager(false)
}

const selectedCount = selectedAssets.filter(asset => asset.selected).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <div className="flex items-center space-x-3">
                  <PieChart className="h-8 w-8 text-blue-400" />
                  <h1 className="text-3xl font-bold text-white">Portfolio Optimization Engine</h1>
                </div>
                <p className="text-gray-300 mt-2">Modern Portfolio Theory & Multi-Asset Allocation Algorithms</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Portfolio Management Buttons */}
              <button
                onClick={() => setShowSaveModal(true)}
                disabled={currentAssets.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Save Current Portfolio"
              >
                <Save className="h-4 w-4" />
                Save Portfolio
              </button>
              
              <button
                onClick={() => setShowPortfolioManager(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Manage Portfolios"
              >
                <FolderOpen className="h-4 w-4" />
                My Portfolios
              </button>
              
              <Link href="/strategy-builder" className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">
                Backtester
              </Link>
              <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Optimization Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Optimization Parameters</h2>
            </div>
            <button 
              onClick={() => {
                const assetSection = document.getElementById('asset-selection');
                if (assetSection) {
                  assetSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              CONFIGURE YOUR PORTFOLIO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Optimization Objective:
              </label>
              <select
                value={optimizationObjective}
                onChange={(e) => setOptimizationObjective(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Maximum Sharpe Ratio">Maximum Sharpe Ratio</option>
                <option value="Minimum Volatility">Minimum Volatility</option>
                <option value="Maximum Return">Maximum Return</option>
                <option value="Risk Parity">Risk Parity</option>
                <option value="Equal Weight">Equal Weight</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Historical Data Period:
              </label>
              <select
                value={historicalPeriod}
                onChange={(e) => setHistoricalPeriod(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
                <option value="24 Months">24 Months</option>
                <option value="36 Months">36 Months</option>
                <option value="60 Months">60 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Maximum Assets:
              </label>
              <select
                value={maxAssets}
                onChange={(e) => setMaxAssets(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5 Assets">5 Assets</option>
                <option value="10 Assets">10 Assets</option>
                <option value="15 Assets">15 Assets</option>
                <option value="20 Assets">20 Assets</option>
                <option value="No Limit">No Limit</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-4">
            <motion.button
              onClick={handleOptimize}
              disabled={isOptimizing || selectedCount < 2}
              whileHover={{ scale: isOptimizing ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
                isOptimizing || selectedCount < 2
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>OPTIMIZING...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>OPTIMIZE PORTFOLIO</span>
                </>
              )}
            </motion.button>

            {optimizationComplete && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-2 text-green-400"
              >
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Portfolio optimized and updated!</span>
              </motion.div>
            )}

            <div className="flex space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>VIEW DASHBOARD</span>
              </button>

              {optimizationComplete && (
                <Link 
                  href="/portfolio-tracker"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Activity className="h-4 w-4" />
                  <span>GO LIVE</span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Asset Selection and Results Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Asset Selection */}
          <motion.div
            id="asset-selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-400" />
                Asset Selection ({selectedCount} selected)
              </h3>
              <div className="text-sm text-gray-400">
                Select 2+ assets to optimize
              </div>
            </div>

            {/* Custom Ticker Input */}
            <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <div className="flex items-center space-x-2 mb-2">
                <Plus className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Add Custom Asset</span>
              </div>
              
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={customTicker}
                    onChange={(e) => handleTickerChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Enter ticker symbol (e.g., AAPL, TSLA)"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  
                  {/* Ticker suggestions */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                      {getTickerSuggestions(customTicker).map((ticker) => (
                        <button
                          key={ticker}
                          onClick={() => {
                            setCustomTicker(ticker)
                            validateTicker(ticker)
                            setShowSuggestions(false)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-white hover:bg-slate-700 transition-colors"
                        >
                          {ticker}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Validation feedback */}
                  {(tickerValidation.message || tickerValidation.isLoading) && !showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 px-3 py-1 text-xs rounded-md">
                      {tickerValidation.isLoading ? (
                        <div className="flex items-center text-blue-400">
                          <div className="animate-spin h-3 w-3 border border-blue-400 border-t-transparent rounded-full mr-2"></div>
                          Validating...
                        </div>
                      ) : tickerValidation.isValid ? (
                        <div className="flex items-center text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {tickerValidation.message}
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {tickerValidation.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={addCustomAsset}
                  disabled={!tickerValidation.isValid}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tickerValidation.isValid
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add
                </button>
              </div>
              
              {/* Custom assets display */}
              {customAssets.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {customAssets.map((ticker) => (
                    <div
                      key={ticker}
                      className="flex items-center space-x-1 px-2 py-1 bg-slate-600/50 rounded text-xs text-white"
                    >
                      <span>{ticker}</span>
                      <button
                        onClick={() => removeCustomAsset(ticker)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedAssets.map((asset, index) => (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.02 }}
                  className={`p-3 rounded-lg border transition-colors ${
                    asset.selected
                      ? 'bg-blue-900/30 border-blue-700/50'
                      : 'bg-slate-700/30 border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={asset.selected}
                          onChange={(e) => {
                            console.log('Checkbox changed for', asset.symbol, 'from', asset.selected, 'to', e.target.checked)
                            handleAssetToggle(index)
                          }}
                          className="text-blue-500 focus:ring-blue-500 cursor-pointer"
                        />
                        <div 
                          className="cursor-pointer flex-1"
                          onClick={() => {
                            console.log('Asset div clicked for', asset.symbol)
                            handleAssetToggle(index)
                          }}
                        >
                          <div className="font-semibold text-white">{asset.symbol}</div>
                          <div className="text-sm text-gray-400">{asset.name}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-blue-400 px-2 py-1 bg-blue-900/30 rounded">
                        {asset.category}
                      </div>
                      {/* Remove button for custom assets */}
                      {asset.category === 'Custom' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCustomAsset(asset.symbol)
                          }}
                          className="p-1 hover:bg-red-600/20 rounded text-red-400 hover:text-red-300 transition-colors"
                          title="Remove custom asset"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Portfolio Allocation Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-xl border border-slate-600/50 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                  <PieChart className="h-5 w-5 text-purple-400" />
                </div>
                Optimized Portfolio Allocation
              </h3>
              {currentAllocation.length > 0 && (
                <div className="text-sm text-gray-400">
                  {currentAllocation.length} assets • 100% allocated
                </div>
              )}
            </div>

            <div className="relative">
              <div className="h-80 mb-6 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={currentAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      animationDuration={1000}
                      animationBegin={200}
                    >
                      {currentAllocation.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke={entry.color}
                          strokeWidth={2}
                          style={{
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-xl p-4 shadow-xl">
                              <div className="text-white font-semibold mb-2 flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: data.color }}
                                />
                                {data.name}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Allocation:</span>
                                  <span className="text-white font-medium">{data.value.toFixed(1)}%</span>
                                </div>
                                {data.expectedReturn && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Expected Return:</span>
                                    <span className="text-green-400">{data.expectedReturn.toFixed(1)}%</span>
                                  </div>
                                )}
                                {data.volatility && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Volatility:</span>
                                    <span className={`${
                                      data.riskLevel === 'Low' ? 'text-green-400' : 
                                      data.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                      {data.volatility.toFixed(1)}% ({data.riskLevel})
                                    </span>
                                  </div>
                                )}
                                {data.contributionToReturn && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Return Contribution:</span>
                                    <span className="text-blue-400">{data.contributionToReturn.toFixed(2)}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                
                {/* Center Statistics */}
                {currentAllocation.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {portfolioMetrics.expectedReturn ? `${portfolioMetrics.expectedReturn}%` : '0.0%'}
                      </div>
                      <div className="text-sm text-gray-400">Expected Return</div>
                      <div className="text-lg font-semibold text-purple-400 mt-1">
                        {portfolioMetrics.sharpeRatio ? portfolioMetrics.sharpeRatio.toFixed(2) : '0.00'}
                      </div>
                      <div className="text-xs text-gray-500">Sharpe Ratio</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Legend with Risk Indicators */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-300 mb-3 flex items-center justify-between">
                <span>Asset Breakdown</span>
                <span className="text-xs text-gray-500">Allocation • Risk Level • Return</span>
              </div>
              {currentAllocation.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 transition-all duration-200 border border-transparent hover:border-slate-500/50"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative">
                      <div 
                        className="w-4 h-4 rounded-full shadow-lg" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div 
                        className="absolute inset-0 w-4 h-4 rounded-full opacity-50 animate-pulse" 
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300 text-sm font-medium">{item.name}</span>
                        {item.symbol && (
                          <span className="text-xs text-gray-500">({item.symbol})</span>
                        )}
                        {item.riskLevel && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                            item.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {item.riskLevel} Risk
                          </span>
                        )}
                      </div>
                      {item.expectedReturn && (
                        <div className="text-xs text-gray-500 mt-1">
                          Expected: {item.expectedReturn.toFixed(1)}% • Vol: {item.volatility?.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{item.value.toFixed(1)}%</div>
                    {item.contributionToReturn && (
                      <div className="text-xs text-blue-400">
                        +{item.contributionToReturn.toFixed(2)}% return
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Portfolio Summary */}
            {currentAllocation.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                <div className="text-sm font-medium text-purple-300 mb-2">Portfolio Summary</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-gray-400">Total Return</div>
                    <div className="text-white font-semibold">
                      {currentAllocation.reduce((sum, item) => sum + (item.contributionToReturn || 0), 0).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Weighted Risk</div>
                    <div className="text-white font-semibold">
                      {currentAllocation.reduce((sum, item) => sum + (item.contributionToRisk || 0), 0).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Diversification</div>
                    <div className="text-white font-semibold">
                      {currentAllocation.length} assets
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Largest Position</div>
                    <div className="text-white font-semibold">
                      {Math.max(...currentAllocation.map(item => item.value)).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Efficient Frontier Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 mt-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Efficient Frontier Analysis
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={generateEfficientFrontierData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="risk" 
                  stroke="#9CA3AF"
                  label={{ value: 'Risk (Volatility %)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  label={{ value: 'Expected Return (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => [
                    `${value}%`, 
                    name === 'return' ? 'Expected Return' : 'Risk'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="return" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Expected Return Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-5 rounded-xl border border-slate-600/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="text-gray-400 text-sm font-medium">Expected Return</div>
                </div>
                <div className="relative group/tooltip">
                  <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-300 cursor-help">
                    ?
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/tooltip:block">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                      Projected annual return based on historical data
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold transition-colors ${
                  portfolioMetrics.expectedReturn 
                    ? portfolioMetrics.expectedReturn >= 10 
                      ? 'text-green-400' 
                      : portfolioMetrics.expectedReturn >= 5 
                      ? 'text-yellow-400' 
                      : 'text-red-400'
                    : 'text-gray-400'
                }`}>
                  {portfolioMetrics.expectedReturn ? `${portfolioMetrics.expectedReturn.toFixed(1)}%` : '0.0%'}
                </div>
                {portfolioMetrics.expectedReturn && portfolioMetrics.expectedReturn >= 8 && (
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Strong</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {portfolioMetrics.expectedReturn 
                  ? portfolioMetrics.expectedReturn >= 10 
                    ? 'Excellent performance' 
                    : portfolioMetrics.expectedReturn >= 5 
                    ? 'Moderate returns' 
                    : 'Conservative growth'
                  : 'No assets selected'}
              </div>
            </motion.div>

            {/* Volatility Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-5 rounded-xl border border-slate-600/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                    <Activity className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="text-gray-400 text-sm font-medium">Volatility</div>
                </div>
                <div className="relative group/tooltip">
                  <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-300 cursor-help">
                    ?
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/tooltip:block">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                      Standard deviation of returns (risk measure)
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold transition-colors ${
                  portfolioMetrics.volatility 
                    ? portfolioMetrics.volatility <= 10 
                      ? 'text-green-400' 
                      : portfolioMetrics.volatility <= 20 
                      ? 'text-yellow-400' 
                      : 'text-red-400'
                    : 'text-gray-400'
                }`}>
                  {portfolioMetrics.volatility ? `${portfolioMetrics.volatility.toFixed(1)}%` : '0.0%'}
                </div>
                {portfolioMetrics.volatility && (
                  <div className={`flex items-center text-sm ${
                    portfolioMetrics.volatility <= 10 
                      ? 'text-green-400' 
                      : portfolioMetrics.volatility <= 20 
                      ? 'text-yellow-400' 
                      : 'text-red-400'
                  }`}>
                    <Activity className="h-3 w-3 mr-1" />
                    <span>
                      {portfolioMetrics.volatility <= 10 ? 'Low' : portfolioMetrics.volatility <= 20 ? 'Medium' : 'High'}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {portfolioMetrics.volatility 
                  ? portfolioMetrics.volatility <= 10 
                    ? 'Conservative risk' 
                    : portfolioMetrics.volatility <= 20 
                    ? 'Balanced risk' 
                    : 'Aggressive risk'
                  : 'No risk calculated'}
              </div>
            </motion.div>

            {/* Sharpe Ratio Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-5 rounded-xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <BarChart3 className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-gray-400 text-sm font-medium">Sharpe Ratio</div>
                </div>
                <div className="relative group/tooltip">
                  <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-300 cursor-help">
                    ?
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/tooltip:block">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                      Risk-adjusted return efficiency (higher is better)
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold transition-colors ${
                  portfolioMetrics.sharpeRatio 
                    ? portfolioMetrics.sharpeRatio >= 1.5 
                      ? 'text-green-400' 
                      : portfolioMetrics.sharpeRatio >= 1.0 
                      ? 'text-yellow-400' 
                      : 'text-red-400'
                    : 'text-gray-400'
                }`}>
                  {portfolioMetrics.sharpeRatio ? portfolioMetrics.sharpeRatio.toFixed(2) : '0.00'}
                </div>
                {portfolioMetrics.sharpeRatio && portfolioMetrics.sharpeRatio >= 1.0 && (
                  <div className="flex items-center text-green-400 text-sm">
                    <Target className="h-3 w-3 mr-1" />
                    <span>Good</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {portfolioMetrics.sharpeRatio 
                  ? portfolioMetrics.sharpeRatio >= 1.5 
                    ? 'Excellent efficiency' 
                    : portfolioMetrics.sharpeRatio >= 1.0 
                    ? 'Good efficiency' 
                    : 'Needs improvement'
                  : 'Not calculated'}
              </div>
            </motion.div>

            {/* Max Drawdown Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-5 rounded-xl border border-slate-600/50 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                    <LineChart className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="text-gray-400 text-sm font-medium">Max Drawdown</div>
                </div>
                <div className="relative group/tooltip">
                  <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-300 cursor-help">
                    ?
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/tooltip:block">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                      Maximum peak-to-trough decline expected
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold transition-colors ${
                  portfolioMetrics.maxDrawdown 
                    ? Math.abs(portfolioMetrics.maxDrawdown) <= 10 
                      ? 'text-green-400' 
                      : Math.abs(portfolioMetrics.maxDrawdown) <= 20 
                      ? 'text-yellow-400' 
                      : 'text-red-400'
                    : 'text-gray-400'
                }`}>
                  {portfolioMetrics.maxDrawdown ? `${portfolioMetrics.maxDrawdown.toFixed(1)}%` : '0.0%'}
                </div>
                {portfolioMetrics.maxDrawdown && Math.abs(portfolioMetrics.maxDrawdown) <= 15 && (
                  <div className="flex items-center text-green-400 text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Good</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {portfolioMetrics.maxDrawdown 
                  ? Math.abs(portfolioMetrics.maxDrawdown) <= 10 
                    ? 'Low downside risk' 
                    : Math.abs(portfolioMetrics.maxDrawdown) <= 20 
                    ? 'Moderate risk' 
                    : 'High downside risk'
                  : 'No risk calculated'}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Save Portfolio Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 p-6 rounded-xl border border-slate-600 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">Save Portfolio</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Portfolio Name *
                  </label>
                  <input
                    type="text"
                    value={savePortfolioForm.name}
                    onChange={(e) => setSavePortfolioForm({...savePortfolioForm, name: e.target.value})}
                    placeholder="e.g., Optimized Growth Portfolio"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={savePortfolioForm.description}
                    onChange={(e) => setSavePortfolioForm({...savePortfolioForm, description: e.target.value})}
                    placeholder="Describe your optimization strategy..."
                    rows={3}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    value={savePortfolioForm.tags}
                    onChange={(e) => setSavePortfolioForm({...savePortfolioForm, tags: e.target.value})}
                    placeholder="e.g., aggressive, tech-focused, diversified"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePortfolio}
                  disabled={!savePortfolioForm.name.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Save Portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Management Modal */}
      <AnimatePresence>
        {showPortfolioManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-xl border border-slate-600 w-full max-w-6xl max-h-[90vh] overflow-hidden"
            >
              <PortfolioManagement
                onClose={() => setShowPortfolioManager(false)}
                onPortfolioSelect={handleLoadPortfolio}
                showHeader={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
