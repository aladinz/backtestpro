'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, Zap, Play, Eye } from 'lucide-react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import QuickStrategy from '@/components/QuickStrategy'
import TradingDashboard from '@/components/TradingDashboard'
import PortfolioSummary from '@/components/PortfolioSummary'
import MarketIndices from '@/components/MarketIndicesFixed'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      {/* Hero Section with integrated StatsCards flow */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <HeroSection />
        </div>

        {/* Main Trading Workspace - Optimized for Swing Trading */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-16">
          {/* Left Column - Quick Strategy (Primary for swing trading) */}
          <div className="xl:col-span-2">
            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Zap className="h-6 w-6 mr-3 text-yellow-400" />
                Quick Strategy Backtest
              </h2>
              <QuickStrategy />
            </div>
          </div>
          
          {/* Right Column - Market Info */}
          <div className="xl:col-span-2 space-y-6">
            {/* Market Indices - Major indices for swing trading context */}
            <MarketIndices />
          </div>
        </div>

        {/* Portfolio Summary - Clean overview with link to full dashboard */}
        <div className="mt-8">
          <PortfolioSummary />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-slate-800/50 border-t border-slate-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 BacktestPro. Personal trading strategy platform.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Settings</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
