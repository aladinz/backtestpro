'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  Upload, 
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Star,
  StarOff,
  Calendar,
  Tag,
  Settings,
  X,
  Check,
  AlertCircle,
  FileText,
  Folder
} from 'lucide-react'
import { usePortfolioManagementStore, SavedPortfolio } from '@/store/portfolioManagementStore'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useRouter } from 'next/navigation'

interface PortfolioManagementProps {
  onClose?: () => void
  onPortfolioSelect?: (portfolio: SavedPortfolio) => void
  showHeader?: boolean
}

export default function PortfolioManagement({ 
  onClose, 
  onPortfolioSelect, 
  showHeader = true 
}: PortfolioManagementProps) {
  const router = useRouter()
  const { 
    savedPortfolios,
    activePortfolioId,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    duplicatePortfolio,
    setActivePortfolio,
    searchPortfolios,
    exportPortfolio,
    exportAllPortfolios,
    importPortfolio,
    importPortfolios,
    getAllPortfolios
  } = usePortfolioManagementStore()
  
  const { assets: currentAssets, metrics: currentMetrics } = usePortfolioStore()

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPortfolios, setFilteredPortfolios] = useState<SavedPortfolio[]>([])
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingPortfolio, setEditingPortfolio] = useState<string | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importData, setImportData] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Form states
  const [newPortfolioName, setNewPortfolioName] = useState('')
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('')
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    tags: ''
  })

  // Update filtered portfolios when search changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredPortfolios(searchPortfolios(searchQuery))
    } else {
      setFilteredPortfolios(getAllPortfolios())
    }
  }, [searchQuery, savedPortfolios, searchPortfolios, getAllPortfolios])

  const handleCreatePortfolio = () => {
    if (!newPortfolioName.trim()) return
    
    const id = createPortfolio(newPortfolioName, newPortfolioDescription, currentAssets)
    updatePortfolio(id, { 
      metrics: currentMetrics,
      tags: newPortfolioDescription ? ['custom'] : []
    })
    
    setIsCreating(false)
    setNewPortfolioName('')
    setNewPortfolioDescription('')
  }

  const handleEditPortfolio = (id: string) => {
    const portfolio = savedPortfolios.find(p => p.id === id)
    if (portfolio) {
      setEditForm({
        name: portfolio.name,
        description: portfolio.description || '',
        tags: portfolio.tags.join(', ')
      })
      setEditingPortfolio(id)
    }
  }

  const handleSaveEdit = () => {
    if (!editingPortfolio) return
    
    updatePortfolio(editingPortfolio, {
      name: editForm.name,
      description: editForm.description,
      tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    })
    
    setEditingPortfolio(null)
  }

  const handleDeletePortfolio = (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      deletePortfolio(id)
    }
  }

  const handleDuplicatePortfolio = (id: string) => {
    const portfolio = savedPortfolios.find(p => p.id === id)
    if (portfolio) {
      duplicatePortfolio(id, `${portfolio.name} (Copy)`)
    }
  }

  const handleExportPortfolio = (id: string) => {
    const data = exportPortfolio(id)
    const portfolio = savedPortfolios.find(p => p.id === id)
    if (data && portfolio) {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `portfolio_${portfolio.name.replace(/\s+/g, '_')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleExportAll = () => {
    const data = exportAllPortfolios()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `all_portfolios_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (importData.trim()) {
      const success = importData.includes('"type":"portfolio_collection"') 
        ? importPortfolios(importData)
        : importPortfolio(importData)
      
      if (success) {
        setShowImportModal(false)
        setImportData('')
      } else {
        alert('Failed to import portfolio data. Please check the format.')
      }
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-400'
    if (value < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div className="bg-slate-900/95 backdrop-blur-sm p-6 rounded-xl border border-slate-700 max-w-7xl mx-auto">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Folder className="h-6 w-6 mr-3 text-blue-400" />
              Portfolio Management
            </h2>
            <p className="text-gray-400 mt-1">Create, save, and manage your investment portfolios</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search portfolios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div className="bg-current h-0.5 rounded-sm"></div>
                <div className="bg-current h-0.5 rounded-sm"></div>
                <div className="bg-current h-0.5 rounded-sm"></div>
                <div className="bg-current h-0.5 rounded-sm"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Portfolio
          </button>
          
          <button
            onClick={() => setShowImportModal(true)}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors"
            title="Import Portfolio"
          >
            <Upload className="h-4 w-4" />
          </button>
          
          {filteredPortfolios.length > 0 && (
            <button
              onClick={handleExportAll}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors"
              title="Export All Portfolios"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Create New Portfolio Modal */}
      <AnimatePresence>
        {isCreating && (
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
              <h3 className="text-xl font-bold text-white mb-4">Create New Portfolio</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Portfolio Name *
                  </label>
                  <input
                    type="text"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    placeholder="e.g., Conservative Growth, Tech Focus"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newPortfolioDescription}
                    onChange={(e) => setNewPortfolioDescription(e.target.value)}
                    placeholder="Describe your investment strategy..."
                    rows={3}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePortfolio}
                  disabled={!newPortfolioName.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Create Portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
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
              className="bg-slate-800 p-6 rounded-xl border border-slate-600 w-full max-w-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Import Portfolio</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Portfolio Data (JSON)
                  </label>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste your portfolio JSON data here..."
                    rows={10}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 font-mono text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importData.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Import
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Grid/List */}
      {filteredPortfolios.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">
            {searchQuery ? 'No portfolios found' : 'No portfolios yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Create your first portfolio to get started'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Portfolio
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredPortfolios.map((portfolio) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-slate-600 transition-all cursor-pointer
                ${viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center justify-between'}
                ${portfolio.isActive ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => {
                if (onPortfolioSelect) {
                  onPortfolioSelect(portfolio)
                } else {
                  setActivePortfolio(portfolio.id)
                }
              }}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Grid View */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {editingPortfolio === portfolio.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="text-lg font-bold bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h3 className="text-lg font-bold text-white mb-1">{portfolio.name}</h3>
                      )}
                      
                      {portfolio.isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                          <Star className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditPortfolio(portfolio.id)
                        }}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExportPortfolio(portfolio.id)
                        }}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicatePortfolio(portfolio.id)
                        }}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePortfolio(portfolio.id)
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {editingPortfolio === portfolio.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        placeholder="Description..."
                        rows={2}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <input
                        type="text"
                        value={editForm.tags}
                        onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                        placeholder="Tags (comma-separated)"
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSaveEdit()
                          }}
                          className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                        >
                          <Check className="h-4 w-4 mx-auto" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingPortfolio(null)
                          }}
                          className="flex-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                        >
                          <X className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {portfolio.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{portfolio.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Total Value</div>
                          <div className="text-lg font-bold text-white">
                            ${portfolio.metrics.totalValue.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Return</div>
                          <div className={`text-lg font-bold ${getPerformanceColor(portfolio.metrics.totalReturnPercent)}`}>
                            {portfolio.metrics.totalReturnPercent >= 0 ? '+' : ''}
                            {portfolio.metrics.totalReturnPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{portfolio.assets.length} assets</span>
                        <span>Updated {formatDate(portfolio.updatedAt)}</span>
                      </div>

                      {portfolio.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {portfolio.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-slate-700/50 text-gray-400 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* List View */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{portfolio.name}</h3>
                        {portfolio.isActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            <Star className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        )}
                      </div>
                      {portfolio.description && (
                        <p className="text-gray-400 text-sm">{portfolio.description}</p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        ${portfolio.metrics.totalValue.toLocaleString()}
                      </div>
                      <div className={`text-sm ${getPerformanceColor(portfolio.metrics.totalReturnPercent)}`}>
                        {portfolio.metrics.totalReturnPercent >= 0 ? '+' : ''}
                        {portfolio.metrics.totalReturnPercent.toFixed(2)}%
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-right">
                      <div>{portfolio.assets.length} assets</div>
                      <div>{formatDate(portfolio.updatedAt)}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditPortfolio(portfolio.id)
                      }}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportPortfolio(portfolio.id)
                      }}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicatePortfolio(portfolio.id)
                      }}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePortfolio(portfolio.id)
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Portfolio Stats Summary */}
      {filteredPortfolios.length > 0 && (
        <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Portfolio Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Total Portfolios</div>
              <div className="text-white font-semibold">{filteredPortfolios.length}</div>
            </div>
            <div>
              <div className="text-gray-500">Combined Value</div>
              <div className="text-white font-semibold">
                ${filteredPortfolios.reduce((sum, p) => sum + p.metrics.totalValue, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Avg Return</div>
              <div className={`font-semibold ${getPerformanceColor(
                filteredPortfolios.reduce((sum, p) => sum + p.metrics.totalReturnPercent, 0) / filteredPortfolios.length
              )}`}>
                {(filteredPortfolios.reduce((sum, p) => sum + p.metrics.totalReturnPercent, 0) / filteredPortfolios.length).toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-gray-500">Active Portfolio</div>
              <div className="text-white font-semibold">
                {filteredPortfolios.find(p => p.isActive)?.name || 'None'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
