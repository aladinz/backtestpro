'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Target,
  Folder,
  Star,
  X,
  Eye,
  Copy,
  Trash2,
  Edit,
  Share2,
  Calendar,
  DollarSign,
  Activity,
  Award,
  Users,
  Zap,
  Settings,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import PortfolioManagement from '@/components/PortfolioManagement'
import { usePortfolioManagementStore, SavedPortfolio } from '@/store/portfolioManagementStore'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useRouter } from 'next/navigation'

export default function PortfolioLibrary() {
  const router = useRouter()
  const { getAllPortfolios, comparePortfolios, deletePortfolio } = usePortfolioManagementStore()
  const { updatePortfolio } = usePortfolioStore()
  
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonData, setComparisonData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'return' | 'value' | 'risk'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favorites' | 'high-return' | 'low-risk'>('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [bookmarkedPortfolios, setBookmarkedPortfolios] = useState<Set<string>>(new Set())

  const handlePortfolioSelect = (portfolio: SavedPortfolio) => {
    // Load portfolio into the optimizer and navigate there
    updatePortfolio(portfolio.assets, portfolio.metrics.initialInvestment)
    router.push('/portfolio-optimization')
  }

  const handleComparePortfolios = () => {
    if (selectedForComparison.length >= 2) {
      const data = comparePortfolios(selectedForComparison)
      setComparisonData(data)
      setShowComparison(true)
    }
  }

  const handleDeletePortfolio = (portfolioId: string) => {
    deletePortfolio(portfolioId)
    setShowDeleteConfirm(null)
    setSelectedForComparison(prev => prev.filter(id => id !== portfolioId))
  }

  const toggleBookmark = (portfolioId: string) => {
    setBookmarkedPortfolios(prev => {
      const newSet = new Set(prev)
      if (newSet.has(portfolioId)) {
        newSet.delete(portfolioId)
      } else {
        newSet.add(portfolioId)
      }
      return newSet
    })
  }

  const portfolios = getAllPortfolios()

  // Enhanced filtering and sorting
  const filteredAndSortedPortfolios = portfolios
    .filter(portfolio => {
      if (selectedFilter === 'favorites') return bookmarkedPortfolios.has(portfolio.id)
      if (selectedFilter === 'high-return') return portfolio.metrics.totalReturnPercent > 10
      if (selectedFilter === 'low-risk') return portfolio.metrics.totalReturnPercent < 15
      return true
    })
    .filter(portfolio => 
      portfolio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.assets.some(asset => asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case 'return':
          aValue = a.metrics.totalReturnPercent
          bValue = b.metrics.totalReturnPercent
          break
        case 'value':
          aValue = a.metrics.totalValue
          bValue = b.metrics.totalValue
          break
        case 'risk':
          aValue = Math.abs(a.metrics.dayPLPercent)
          bValue = Math.abs(b.metrics.dayPLPercent)
          break
        case 'date':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }
      
      if (sortOrder === 'asc') return aValue - bValue
      return bValue - aValue
    })

  const getReturnColor = (returnPercent: number) => {
    if (returnPercent > 15) return 'text-green-400'
    if (returnPercent > 5) return 'text-green-300'
    if (returnPercent > 0) return 'text-blue-400'
    if (returnPercent > -5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRiskColor = (risk: number) => {
    if (risk < 10) return 'text-green-400 bg-green-900/20'
    if (risk < 20) return 'text-yellow-400 bg-yellow-900/20'
    return 'text-red-400 bg-red-900/20'
  }

  const getRiskLabel = (risk: number) => {
    if (risk < 10) return 'Low Risk'
    if (risk < 20) return 'Medium Risk'
    return 'High Risk'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
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
                  <Folder className="h-10 w-10 text-blue-400" />
                  <h1 className="text-4xl font-bold text-white">Portfolio Library</h1>
                  <Zap className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-gray-300 mt-2 text-lg">Manage, analyze, and optimize your investment portfolios with advanced tools</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {selectedForComparison.length >= 2 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={handleComparePortfolios}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
                >
                  <BarChart3 className="h-5 w-5" />
                  Compare Portfolios ({selectedForComparison.length})
                </motion.button>
              )}
              
              <Link 
                href="/portfolio-optimization" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
              >
                <Plus className="h-5 w-5" />
                Create New Portfolio
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Portfolio Stats Overview */}
        {portfolios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Portfolios</p>
                  <p className="text-3xl font-bold text-white">{portfolios.length}</p>
                  <p className="text-xs text-blue-400 mt-1">Active collections</p>
                </div>
                <div className="bg-blue-900/30 p-3 rounded-lg">
                  <Folder className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Combined Value</p>
                  <p className="text-3xl font-bold text-white">
                    ${(portfolios.reduce((sum, p) => sum + p.metrics.totalValue, 0) / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-green-400 mt-1">Total assets under management</p>
                </div>
                <div className="bg-green-900/30 p-3 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-yellow-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Best Performer</p>
                  <p className="text-2xl font-bold text-green-400">
                    {portfolios.length > 0 ? 
                      `+${Math.max(...portfolios.map(p => p.metrics.totalReturnPercent)).toFixed(1)}%` :
                      'N/A'
                    }
                  </p>
                  <p className="text-xs text-yellow-400 mt-1">Top annual return</p>
                </div>
                <div className="bg-yellow-900/30 p-3 rounded-lg">
                  <Award className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Avg Return</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {portfolios.length > 0 ? 
                      (portfolios.reduce((sum, p) => sum + p.metrics.totalReturnPercent, 0) / portfolios.length).toFixed(1) + '%' :
                      'N/A'
                    }
                  </p>
                  <p className="text-xs text-purple-400 mt-1">Average portfolio return</p>
                </div>
                <div className="bg-purple-900/30 p-3 rounded-lg">
                  <Activity className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search portfolios or symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Portfolios', icon: Folder },
                { id: 'favorites', label: 'Bookmarked', icon: BookmarkCheck },
                { id: 'high-return', label: 'High Return', icon: TrendingUp },
                { id: 'low-risk', label: 'Low Risk', icon: CheckCircle }
              ].map((filter) => {
                const IconComponent = filter.icon
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      selectedFilter === filter.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{filter.label}</span>
                  </button>
                )
              })}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="return">Sort by Return</option>
                  <option value="value">Sort by Value</option>
                  <option value="risk">Sort by Risk</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white hover:bg-slate-700 transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Portfolio Grid/List */}
        {filteredAndSortedPortfolios.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Folder className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No portfolios found</h3>
            <p className="text-gray-400 mb-8">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first portfolio to get started'
              }
            </p>
            <Link 
              href="/portfolio-optimization"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Your First Portfolio
            </Link>
          </motion.div>
        ) : (
          <PortfolioManagement
            onPortfolioSelect={handlePortfolioSelect}
          />
        )}

        {/* Enhanced Comparison Modal */}
        {showComparison && comparisonData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">Portfolio Comparison</h2>
                </div>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisonData.portfolios.map((portfolio: SavedPortfolio, index: number) => (
                  <div key={portfolio.id} className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                    <h3 className="text-xl font-bold text-white mb-4">{portfolio.name}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Return:</span>
                        <span className={`font-semibold ${getReturnColor(comparisonData.comparison.return?.[index] || 0)}`}>
                          {comparisonData.comparison.return?.[index]?.toFixed(2) || 'N/A'}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk:</span>
                        <span className="text-yellow-400 font-semibold">
                          {comparisonData.comparison.risk?.[index]?.toFixed(2) || 'N/A'}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Value:</span>
                        <span className="text-white font-semibold">
                          ${comparisonData.comparison.totalValue?.[index]?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowComparison(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Delete Portfolio</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete this portfolio? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeletePortfolio(showDeleteConfirm)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
