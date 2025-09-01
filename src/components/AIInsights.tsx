'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Lightbulb, 
  Zap,
  Star,
  ChevronRight,
  BarChart3,
  Shield,
  Clock,
  RefreshCw
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'OPPORTUNITY' | 'WARNING' | 'STRATEGY' | 'MARKET_ANALYSIS' | 'RISK_ALERT';
  confidence: number;
  title: string;
  description: string;
  actionable: string;
  timeframe: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  sector?: string;
  symbol?: string;
}

interface MarketSentiment {
  overall: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number;
  factors: string[];
  recommendation: string;
}

const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const generateAIInsights = () => {
    const aiInsights: AIInsight[] = [
      {
        id: '1',
        type: 'WARNING',
        confidence: 89,
        title: 'Market Breadth Deterioration Across Sectors',
        description: 'AI analysis shows widespread selling pressure with advance/decline line breaking down and VIX spiking above 28.',
        actionable: 'Reduce equity exposure, consider defensive positions, avoid catching falling knives',
        timeframe: '1-2 weeks',
        priority: 'HIGH',
        sector: 'Market-wide'
      },
      {
        id: '2',
        type: 'WARNING',
        confidence: 92,
        title: 'Technology Sector Under Pressure',
        description: 'Multiple tech names breaking below key support levels with declining momentum and negative breadth.',
        actionable: 'Avoid tech dips for now, wait for oversold bounce or institutional support',
        timeframe: '1-2 weeks',
        priority: 'HIGH',
        sector: 'Technology'
      },
      {
        id: '3',
        type: 'STRATEGY',
        confidence: 85,
        title: 'Defensive Positioning Recommended',
        description: 'Current market regime favors capital preservation over growth. McClellan Oscillator negative.',
        actionable: 'Increase cash allocation to 20-30%, focus on dividend-paying stocks and defensive sectors',
        timeframe: '2-4 weeks',
        priority: 'HIGH',
        sector: 'Portfolio Strategy'
      },
      {
        id: '4',
        type: 'OPPORTUNITY',
        confidence: 67,
        title: 'Utilities Showing Relative Strength',
        description: 'Defensive rotation into utilities sector as growth stocks falter, dividend yields attractive.',
        actionable: 'Consider XLU, NEE, or DUK for defensive allocation during market weakness',
        timeframe: '2-3 weeks',
        priority: 'MEDIUM'
      },
      {
        id: '5',
        type: 'RISK_ALERT',
        confidence: 94,
        title: 'Portfolio Concentration Risk Detected',
        description: 'Over 40% allocation in technology sector exceeds recommended diversification limits.',
        actionable: 'Rebalance portfolio, consider reducing tech exposure by 10-15%',
        timeframe: 'Immediate',
        priority: 'HIGH',
        sector: 'Technology'
      },
      {
        id: '6',
        type: 'OPPORTUNITY',
        confidence: 81,
        title: 'Healthcare Sector Showing Relative Strength',
        description: 'Biotech subsector outperforming with several FDA approval catalysts upcoming.',
        actionable: 'Research GILD, MRNA, or XBI ETF for swing trade opportunities',
        timeframe: '4-6 weeks',
        priority: 'MEDIUM',
        sector: 'Healthcare'
      }
    ];

    const sentiment: MarketSentiment = {
      overall: 'BEARISH',
      score: 28,
      factors: [
        'Declining advance/decline line',
        'VIX elevated above 28 threshold',
        'Negative McClellan Oscillator',
        'Put/Call ratio showing fear at 1.34',
        'Sector breadth deteriorating'
      ],
      recommendation: 'Exercise caution in current market environment. Consider defensive positioning, raise cash levels, and avoid momentum stocks. Focus on quality names with strong fundamentals and defensive sectors like utilities and consumer staples.'
    };

    setInsights(aiInsights);
    setMarketSentiment(sentiment);
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {
    // Simulate AI analysis delay
    setTimeout(() => {
      generateAIInsights();
    }, 1500);

    // Refresh insights every 5 minutes
    const interval = setInterval(() => {
      generateAIInsights();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'OPPORTUNITY':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'STRATEGY':
        return <Target className="h-5 w-5 text-blue-400" />;
      case 'MARKET_ANALYSIS':
        return <BarChart3 className="h-5 w-5 text-purple-400" />;
      case 'RISK_ALERT':
        return <Shield className="h-5 w-5 text-red-400" />;
      default:
        return <Lightbulb className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'OPPORTUNITY':
        return 'border-green-500/30 bg-green-500/10';
      case 'WARNING':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'STRATEGY':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'MARKET_ANALYSIS':
        return 'border-purple-500/30 bg-purple-500/10';
      case 'RISK_ALERT':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-cyan-500/30 bg-cyan-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredInsights = selectedFilter === 'ALL' 
    ? insights 
    : insights.filter(insight => insight.type === selectedFilter);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-blue-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'BEARISH':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-400 animate-pulse" />
            <div className="text-white">AI is analyzing market conditions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">AI Trading Insights</h2>
            <p className="text-gray-400">Powered by advanced market analysis algorithms</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <button 
            onClick={generateAIInsights}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Market Sentiment Overview */}
      {marketSentiment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">AI Market Sentiment Analysis</h3>
            <div className={`px-3 py-1 rounded-lg border ${getSentimentColor(marketSentiment.overall)}`}>
              <span className="font-semibold">{marketSentiment.overall}</span>
              <span className="ml-2 text-sm">({marketSentiment.score}/100)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Key Factors:</h4>
              <ul className="space-y-1">
                {marketSentiment.factors.map((factor, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-400 mr-2" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">AI Recommendation:</h4>
              <p className="text-gray-300 text-sm">{marketSentiment.recommendation}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'OPPORTUNITY', 'WARNING', 'STRATEGY', 'MARKET_ANALYSIS', 'RISK_ALERT'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {filter.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border backdrop-blur-sm ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getInsightIcon(insight.type)}
                <div>
                  <h3 className="text-white font-semibold text-lg">{insight.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs border font-semibold ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                    {insight.sector && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
                        {insight.sector}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className={`text-sm font-semibold ${getConfidenceColor(insight.confidence)}`}>
                  {insight.confidence}%
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">{insight.description}</p>
              
              <div className="bg-gray-800/50 rounded-lg p-3">
                <h4 className="text-white font-medium text-sm mb-1">📋 Action Plan:</h4>
                <p className="text-blue-300 text-sm">{insight.actionable}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>⏱️ Timeframe: {insight.timeframe}</span>
                {insight.symbol && (
                  <span>🎯 Focus: {insight.symbol}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Powered By Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="text-center py-4 border-t border-gray-700"
      >
        <p className="text-gray-400 text-sm flex items-center justify-center space-x-2">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span>Powered by AI algorithms analyzing market patterns, sentiment, and technical indicators</span>
        </p>
        <p className="text-gray-500 text-xs mt-1 italic">
          "Where artificial intelligence meets trading excellence - Built with innovation"
        </p>
      </motion.div>
    </div>
  );
};

export default AIInsights;
