'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, BarChart3, Award, Clock, Target } from 'lucide-react'

export default function StatsCards() {
  const stats = [
    { icon: Users, label: 'Active Traders', value: '12,543', color: 'text-blue-400' },
    { icon: TrendingUp, label: 'Avg Returns', value: '+18.2%', color: 'text-green-400' },
    { icon: BarChart3, label: 'Strategies Tested', value: '94,231', color: 'text-purple-400' },
    { icon: Award, label: 'Success Rate', value: '73.4%', color: 'text-yellow-400' },
    { icon: Clock, label: 'Years of Data', value: '15+', color: 'text-cyan-400' },
    { icon: Target, label: 'Accuracy', value: '99.8%', color: 'text-orange-400' }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Trusted by Professional Traders</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Join thousands of traders using our platform to validate and optimize their strategies with institutional-grade data
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex justify-center mb-3">
                <IconComponent className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
