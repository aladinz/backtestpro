'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import TradingDashboard from '@/components/TradingDashboard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Trading Dashboard</h1>
          <p className="text-gray-300 text-lg">
            Your comprehensive trading command center with real-time portfolio metrics, signals, and market analysis
          </p>
        </motion.div>
        
        <TradingDashboard />
      </div>
    </div>
  )
}
