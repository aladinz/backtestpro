'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Brain, 
  Activity, 
  Target, 
  PieChart, 
  Zap,
  Globe,
  Calculator,
  AlertTriangle,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-400" />,
      title: "Professional Strategy Builder",
      description: "Create and backtest custom trading strategies with advanced technical indicators, multiple timeframes, and comprehensive performance metrics.",
      highlights: ["50+ Technical Indicators", "Multi-timeframe Analysis", "Walk-forward Optimization", "Monte Carlo Simulation"]
    },
    {
      icon: <Activity className="h-8 w-8 text-green-400" />,
      title: "Market Breadth Indicators",
      description: "Comprehensive market internals analysis including advance/decline lines, McClellan Oscillator, VIX analysis, and sector breadth monitoring.",
      highlights: ["6+ Breadth Indicators", "Sector Analysis", "Market Sentiment", "Real-time Updates"]
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-400" />,
      title: "AI Trading Insights",
      description: "Advanced artificial intelligence analyzes market patterns, identifies opportunities, and provides personalized trading recommendations with confidence scores.",
      highlights: ["Pattern Recognition", "Risk Alerts", "Market Analysis", "Confidence Scoring"]
    },
    {
      icon: <Shield className="h-8 w-8 text-red-400" />,
      title: "Risk Management Center",
      description: "Professional-grade risk controls with position sizing calculator, portfolio risk monitoring, and the '10 Commandments of Risk Management'.",
      highlights: ["Position Sizing", "Risk Budget Analysis", "Portfolio Monitoring", "Educational Content"]
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-yellow-400" />,
      title: "Relative Strength Scanner",
      description: "Identify market leaders and laggards with advanced relative strength analysis, custom filters, and momentum ranking systems.",
      highlights: ["RS Ranking", "Custom Filters", "Momentum Analysis", "Breakout Detection"]
    },
    {
      icon: <Target className="h-8 w-8 text-orange-400" />,
      title: "Swing Trade Screener",
      description: "Advanced pattern recognition system to identify high-probability swing trading setups with entry and exit signals.",
      highlights: ["Pattern Recognition", "Setup Filtering", "Entry Signals", "Risk Assessment"]
    },
    {
      icon: <PieChart className="h-8 w-8 text-indigo-400" />,
      title: "Sector Rotation Dashboard",
      description: "Monitor sector leadership and rotation patterns with 11 major sector ETFs, performance heatmaps, and rotation signals.",
      highlights: ["11 Sector ETFs", "Rotation Signals", "Performance Heatmaps", "Trend Analysis"]
    },
    {
      icon: <Calculator className="h-8 w-8 text-cyan-400" />,
      title: "Portfolio Optimization",
      description: "Multi-asset portfolio allocation with modern portfolio theory, efficient frontier analysis, and risk-adjusted returns.",
      highlights: ["Asset Allocation", "Efficient Frontier", "Risk Optimization", "Rebalancing Alerts"]
    }
  ];

  const keyStats = [
    { number: "6", label: "Professional Trading Tools" },
    { number: "50+", label: "Technical Indicators" },
    { number: "11", label: "Sector ETFs Monitored" },
    { number: "24/7", label: "Market Data Updates" }
  ];

  const benefits = [
    {
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      title: "Real-time Market Data",
      description: "Live market feeds with Yahoo Finance integration for accurate, up-to-date information."
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      title: "Lightning Fast Performance",
      description: "Built with Next.js 15 and optimized for speed with modern web technologies."
    },
    {
      icon: <Users className="h-6 w-6 text-green-400" />,
      title: "Professional Grade",
      description: "Institutional-quality tools that rival Bloomberg Terminal and premium platforms."
    },
    {
      icon: <Star className="h-6 w-6 text-purple-400" />,
      title: "Educational Content",
      description: "Comprehensive guides and explanations to improve your trading knowledge."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Platform <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Features</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Discover the comprehensive suite of professional-grade trading tools that make up the Ultimate Swing Trader's Arsenal Platform. 
            From AI-powered insights to advanced risk management, we've built everything you need for trading success.
          </p>
          
          {/* Special Slogan */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 max-w-4xl mx-auto"
          >
            <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🌍 Welcome to the Ultimate Swing Trader's Arsenal Platform - Where Professional Trading Meets Innovation! ⚡
            </p>
          </motion.div>
        </motion.div>

        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {keyStats.map((stat, index) => (
            <div key={index} className="text-center bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Core Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Core Trading Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-gray-400">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Platform Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Built with Modern Technology</h2>
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-blue-400 font-semibold">Next.js 15</div>
                <div className="text-gray-400 text-sm">React Framework</div>
              </div>
              <div className="space-y-2">
                <div className="text-blue-400 font-semibold">TypeScript</div>
                <div className="text-gray-400 text-sm">Type Safety</div>
              </div>
              <div className="space-y-2">
                <div className="text-blue-400 font-semibold">Tailwind CSS</div>
                <div className="text-gray-400 text-sm">Styling</div>
              </div>
              <div className="space-y-2">
                <div className="text-blue-400 font-semibold">Framer Motion</div>
                <div className="text-gray-400 text-sm">Animations</div>
              </div>
              <div className="space-y-2">
                <div className="text-blue-400 font-semibold">Recharts</div>
                <div className="text-gray-400 text-sm">Data Visualization</div>
              </div>
              <div className="space-y-2">
                <div className="text-blue-400 font-semibold">Yahoo Finance</div>
                <div className="text-gray-400 text-sm">Market Data</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Experience the power of professional-grade trading tools. Start with our Trading Dashboard or explore individual features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
              <span>Explore Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border border-blue-500 hover:bg-blue-600/20 text-blue-400 px-8 py-3 rounded-lg font-semibold transition-colors">
              View Strategy Builder
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
