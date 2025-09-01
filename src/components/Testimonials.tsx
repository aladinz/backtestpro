'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Quantitative Analyst',
      company: 'Hedge Fund Alpha',
      content: 'BacktestPro has revolutionized our strategy development process. The accuracy and speed are unmatched.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Portfolio Manager',
      company: 'Investment Partners LLC',
      content: 'Finally, a platform that handles institutional-grade data with the precision we need for our clients.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Alex Thompson',
      role: 'Independent Trader',
      company: 'Self-Employed',
      content: 'Increased my strategy win rate by 23% after optimizing with BacktestPro. Worth every penny.',
      rating: 5,
      avatar: '👨‍💻'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Real feedback from professional traders and analysts using BacktestPro daily
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors relative"
          >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4">
              <Quote className="h-6 w-6 text-blue-400/30" />
            </div>

            {/* Rating */}
            <div className="flex space-x-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>

            {/* Content */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{testimonial.avatar}</div>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
                <div className="text-xs text-blue-400">{testimonial.company}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
