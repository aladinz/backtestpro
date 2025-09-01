'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, Zap, Play, Eye } from 'lucide-react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import QuickStrategy from '@/components/QuickStrategy'
import TradingDashboard from '@/components/TradingDashboard'
import MarketIndices from '@/components/MarketIndicesFixed'
import StrategyShowcase from '@/components/StrategyShowcase'

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

        {/* Main Trading Workspace - Enhanced Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-16">
          {/* Left Column - Quick Strategy (Enhanced Primary Card) */}
          <div className="xl:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
              </div>
              
              {/* Header with Enhanced Icon */}
              <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl backdrop-blur-sm border border-yellow-500/30">
                      <Zap className="h-7 w-7 text-yellow-400 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        Quick Strategy Backtest
                      </h2>
                      <p className="text-slate-400 mt-1">Test your strategy in seconds with real market data</p>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                      <span className="text-green-400 text-sm font-medium">Live Data</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced QuickStrategy Component */}
              <div className="relative z-10">
                <QuickStrategy />
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Market Info */}
          <div className="xl:col-span-5 space-y-6">
            {/* Market Indices - Enhanced for context */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <MarketIndices />
            </motion.div>
          </div>
        </div>

        {/* Strategy Performance Showcase - Amplifies Core Value */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16"
        >
          <StrategyShowcase />
        </motion.div>
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
