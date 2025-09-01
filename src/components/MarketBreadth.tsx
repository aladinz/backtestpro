'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  PieChart, 
  Zap,
  AlertTriangle,
  Target,
  Globe,
  Gauge
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface BreadthIndicator {
  name: string;
  value: number;
  change: number;
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  description: string;
}

interface MarketInternal {
  symbol: string;
  name: string;
  value: number;
  change: number;
  percentChange: number;
  signal: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
}

interface SectorBreadth {
  sector: string;
  advancing: number;
  declining: number;
  unchanged: number;
  netAdvancers: number;
  strength: number;
}

const MarketBreadth: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [breadthData, setBreadthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate dynamic breadth indicators based on timeframe
  const getBreadthIndicators = (timeframe: string): BreadthIndicator[] => {
    let adValue, adChange, mcValue, mcChange, nhValue, nhChange, vixValue, vixChange, pcValue, pcChange, trinValue, trinChange;
    
    switch (timeframe) {
      case '1D':
        adValue = 2145; adChange = -245;
        mcValue = -32.4; mcChange = -18.7;
        nhValue = -89; nhChange = -67;
        vixValue = 28.85; vixChange = 4.92;
        pcValue = 1.34; pcChange = 0.28;
        trinValue = 1.67; trinChange = 0.45;
        break;
      case '5D':
        adValue = 2087; adChange = -378;
        mcValue = -28.1; mcChange = -24.3;
        nhValue = -124; nhChange = -89;
        vixValue = 26.42; vixChange = 3.18;
        pcValue = 1.28; pcChange = 0.35;
        trinValue = 1.54; trinChange = 0.38;
        break;
      case '1M':
        adValue = 1934; adChange = -512;
        mcValue = -18.7; mcChange = -31.8;
        nhValue = -156; nhChange = -124;
        vixValue = 24.75; vixChange = 2.45;
        pcValue = 1.19; pcChange = 0.42;
        trinValue = 1.43; trinChange = 0.29;
        break;
      case '3M':
        adValue = 2234; adChange = -289;
        mcValue = -12.3; mcChange = -28.4;
        nhValue = -67; nhChange = -98;
        vixValue = 22.18; vixChange = 1.87;
        pcValue = 1.12; pcChange = 0.31;
        trinValue = 1.31; trinChange = 0.22;
        break;
      case '1Y':
        adValue = 2456; adChange = -187;
        mcValue = -8.9; mcChange = -22.1;
        nhValue = -34; nhChange = -78;
        vixValue = 20.95; vixChange = 1.23;
        pcValue = 1.06; pcChange = 0.24;
        trinValue = 1.18; trinChange = 0.15;
        break;
      default:
        adValue = 2145; adChange = -245;
        mcValue = -32.4; mcChange = -18.7;
        nhValue = -89; nhChange = -67;
        vixValue = 28.85; vixChange = 4.92;
        pcValue = 1.34; pcChange = 0.28;
        trinValue = 1.67; trinChange = 0.45;
    }
    
    return [
      {
        name: 'Advance/Decline Line',
        value: adValue,
        change: adChange,
        signal: 'BEARISH',
        description: 'More stocks declining than advancing'
      },
      {
        name: 'McClellan Oscillator',
        value: mcValue,
        change: mcChange,
        signal: 'BEARISH',
        description: 'Market momentum is negative'
      },
      {
        name: 'New Highs - New Lows',
        value: nhValue,
        change: nhChange,
        signal: 'BEARISH',
        description: 'More stocks hitting new lows'
      },
      {
        name: 'VIX Fear Index',
        value: vixValue,
        change: vixChange,
        signal: 'BEARISH',
        description: 'Elevated fear, market stress'
      },
      {
        name: 'Put/Call Ratio',
        value: pcValue,
        change: pcChange,
        signal: 'BEARISH',
        description: 'More puts than calls being bought'
      },
      {
        name: 'TRIN Index',
        value: trinValue,
        change: trinChange,
        signal: 'BEARISH',
        description: 'Money flowing into declining stocks'
      }
    ];
  };

  const breadthIndicators = getBreadthIndicators(selectedTimeframe);

  // Mock market internals data - updated for bearish conditions
  const marketInternals: MarketInternal[] = [
    {
      symbol: '$NYAD',
      name: 'NYSE Advance/Decline',
      value: 1247,
      change: -467,
      percentChange: -27.2,
      signal: 'STRONG_SELL'
    },
    {
      symbol: '$NAAD',
      name: 'NASDAQ A/D',
      value: 953,
      change: -289,
      percentChange: -23.3,
      signal: 'SELL'
    },
    {
      symbol: '$NYHL',
      name: 'NYSE High/Low',
      value: -145,
      change: -198,
      percentChange: -57.7,
      signal: 'STRONG_SELL'
    },
    {
      symbol: '$NAHL',
      name: 'NASDAQ High/Low',
      value: -87,
      change: -134,
      percentChange: -60.6,
      signal: 'STRONG_SELL'
    },
    {
      symbol: '$UVOL',
      name: 'Up Volume',
      value: 423,
      change: -289,
      percentChange: -40.6,
      signal: 'SELL'
    },
    {
      symbol: '$DVOL',
      name: 'Down Volume',
      value: 1156,
      change: 423,
      percentChange: 57.7,
      signal: 'STRONG_SELL'
    }
  ];

  // Mock sector breadth data - updated for bearish market
  const sectorBreadth: SectorBreadth[] = [
    { sector: 'Technology', advancing: 28, declining: 67, unchanged: 5, netAdvancers: -39, strength: 29.8 },
    { sector: 'Healthcare', advancing: 35, declining: 58, unchanged: 7, netAdvancers: -23, strength: 38.1 },
    { sector: 'Financials', advancing: 25, declining: 68, unchanged: 7, netAdvancers: -43, strength: 27.7 },
    { sector: 'Consumer Disc.', advancing: 32, declining: 65, unchanged: 3, netAdvancers: -33, strength: 33.8 },
    { sector: 'Industrials', advancing: 29, declining: 64, unchanged: 7, netAdvancers: -35, strength: 31.4 },
    { sector: 'Energy', advancing: 18, declining: 75, unchanged: 7, netAdvancers: -57, strength: 19.2 },
    { sector: 'Materials', advancing: 22, declining: 68, unchanged: 10, netAdvancers: -46, strength: 24.2 },
    { sector: 'Utilities', advancing: 45, declining: 48, unchanged: 7, netAdvancers: -3, strength: 48.4 },
    { sector: 'Real Estate', advancing: 21, declining: 72, unchanged: 7, netAdvancers: -51, strength: 23.1 },
    { sector: 'Communication', advancing: 31, declining: 64, unchanged: 5, netAdvancers: -33, strength: 32.7 },
    { sector: 'Consumer Staples', advancing: 43, declining: 49, unchanged: 8, netAdvancers: -6, strength: 46.8 }
  ];

  useEffect(() => {
    const generateBreadthData = () => {
      const data = [];
      const now = new Date();
      let days, baseAD, trendDirection, baseVIX, baseMcClellan, basePutCall;
      
      // Different data ranges and trends based on timeframe
      switch (selectedTimeframe) {
        case '1D':
          days = 1;
          baseAD = 2145;
          baseVIX = 28.85;
          baseMcClellan = -32.4;
          basePutCall = 1.34;
          trendDirection = -1; // Bearish trend
          break;
        case '5D':
          days = 5;
          baseAD = 2087;
          baseVIX = 26.42;
          baseMcClellan = -28.1;
          basePutCall = 1.28;
          trendDirection = -0.8;
          break;
        case '1M':
          days = 30;
          baseAD = 1934;
          baseVIX = 24.75;
          baseMcClellan = -18.7;
          basePutCall = 1.19;
          trendDirection = -0.6;
          break;
        case '3M':
          days = 90;
          baseAD = 2234;
          baseVIX = 22.18;
          baseMcClellan = -12.3;
          basePutCall = 1.12;
          trendDirection = -0.4;
          break;
        case '1Y':
          days = 365;
          baseAD = 2456;
          baseVIX = 20.95;
          baseMcClellan = -8.9;
          basePutCall = 1.06;
          trendDirection = -0.2;
          break;
        default:
          days = 30;
          baseAD = 1934;
          baseVIX = 24.75;
          baseMcClellan = -18.7;
          basePutCall = 1.19;
          trendDirection = -0.6;
      }
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const progress = (days - 1 - i) / (days - 1);
        const randomFactor = Math.random() * 0.3 - 0.15; // ±15% random variation
        
        data.push({
          date: date.toISOString().split('T')[0],
          advanceDecline: baseAD + (trendDirection * progress * 300) + (Math.random() * 200 - 100),
          mcclellan: baseMcClellan + (trendDirection * progress * 20) + (Math.random() * 10 - 5),
          vix: baseVIX + (Math.abs(trendDirection) * progress * 8) + (Math.random() * 4 - 2),
          putCall: basePutCall + (randomFactor * 0.2) + (Math.random() * 0.15 - 0.075),
          newHighsLows: (baseMcClellan * 2) + (trendDirection * progress * 80) + (Math.random() * 40 - 20)
        });
      }
      
      setBreadthData(data);
      setLoading(false);
    };

    generateBreadthData();
  }, [selectedTimeframe]); // Re-generate when timeframe changes

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BULLISH':
      case 'STRONG_BUY':
      case 'BUY':
        return 'text-green-400';
      case 'BEARISH':
      case 'STRONG_SELL':
      case 'SELL':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getSignalBg = (signal: string) => {
    switch (signal) {
      case 'BULLISH':
      case 'STRONG_BUY':
      case 'BUY':
        return 'bg-green-500/20 border-green-500/30';
      case 'BEARISH':
      case 'STRONG_SELL':
      case 'SELL':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const getSectorStrengthColor = (strength: number) => {
    if (strength >= 70) return 'bg-green-500';
    if (strength >= 60) return 'bg-blue-500';
    if (strength >= 50) return 'bg-yellow-500';
    if (strength >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const overallMarketSentiment = () => {
    // Check if market is closed (assuming market hours are 9:30 AM - 4:00 PM ET)
    const now = new Date();
    const currentHour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const isMarketClosed = isWeekend || currentHour < 9 || currentHour >= 16;
    
    const bullishCount = breadthIndicators.filter(ind => ind.signal === 'BULLISH').length;
    const bearishCount = breadthIndicators.filter(ind => ind.signal === 'BEARISH').length;
    const total = breadthIndicators.length;
    const bullishPercent = (bullishCount / total) * 100;
    
    let sentiment, color, bg;
    
    if (bullishPercent >= 75) {
      sentiment = 'VERY BULLISH';
      color = 'text-green-400';
      bg = 'bg-green-500/20';
    } else if (bullishPercent >= 50) {
      sentiment = 'BULLISH';
      color = 'text-green-400';
      bg = 'bg-green-500/20';
    } else if (bullishPercent >= 25) {
      sentiment = 'NEUTRAL';
      color = 'text-yellow-400';
      bg = 'bg-yellow-500/20';
    } else {
      sentiment = 'BEARISH';
      color = 'text-red-400';
      bg = 'bg-red-500/20';
    }
    
    // Add market status prefix
    const marketStatus = isMarketClosed ? 'MARKET CLOSED, ' : '';
    
    return { 
      sentiment: marketStatus + sentiment, 
      color, 
      bg 
    };
  };

  const marketSentiment = overallMarketSentiment();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Market Breadth Indicators</h2>
          <p className="text-gray-400">Comprehensive market internals and sentiment analysis</p>
        </div>
        <div className={`px-4 py-2 rounded-lg border ${marketSentiment.bg} ${marketSentiment.color} border-opacity-30`}>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span className="font-semibold">Market Sentiment: {marketSentiment.sentiment}</span>
          </div>
        </div>
      </motion.div>

      {/* Timeframe Selector */}
      <div className="flex space-x-2">
        {['1D', '5D', '1M', '3M', '1Y'].map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedTimeframe === timeframe
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      {/* Breadth Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {breadthIndicators.map((indicator, index) => (
          <motion.div
            key={indicator.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border backdrop-blur-sm ${getSignalBg(indicator.signal)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{indicator.name}</h3>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getSignalColor(indicator.signal)}`}>
                {indicator.signal}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{indicator.value}</span>
                <div className={`flex items-center ${indicator.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {indicator.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  <span className="text-sm font-medium">
                    {indicator.change >= 0 ? '+' : ''}{indicator.change}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{indicator.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Market Internals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
      >
        <div className="flex items-center mb-6">
          <Globe className="h-6 w-6 text-blue-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Market Internals</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketInternals.map((internal, index) => (
            <div key={internal.symbol} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-white font-medium">{internal.name}</h4>
                  <p className="text-gray-400 text-sm">{internal.symbol}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold ${getSignalColor(internal.signal)}`}>
                  {internal.signal.replace('_', ' ')}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">{internal.value.toLocaleString()}</span>
                <div className={`flex items-center ${internal.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {internal.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  <span className="text-sm">
                    {internal.change >= 0 ? '+' : ''}{internal.change} ({internal.percentChange >= 0 ? '+' : ''}{internal.percentChange}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sector Breadth Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
      >
        <div className="flex items-center mb-6">
          <PieChart className="h-6 w-6 text-blue-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Sector Breadth Analysis</h3>
        </div>
        
        <div className="space-y-4">
          {sectorBreadth.map((sector, index) => (
            <div key={sector.sector} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{sector.sector}</h4>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-semibold ${sector.netAdvancers >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Net: {sector.netAdvancers >= 0 ? '+' : ''}{sector.netAdvancers}
                  </span>
                  <span className="text-white font-semibold">{sector.strength.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Advancing: {sector.advancing}</span>
                    <span>Declining: {sector.declining}</span>
                    <span>Unchanged: {sector.unchanged}</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="h-full flex">
                      <div 
                        className="bg-green-500 h-full"
                        style={{ width: `${(sector.advancing / (sector.advancing + sector.declining + sector.unchanged)) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-red-500 h-full"
                        style={{ width: `${(sector.declining / (sector.advancing + sector.declining + sector.unchanged)) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-gray-500 h-full"
                        style={{ width: `${(sector.unchanged / (sector.advancing + sector.declining + sector.unchanged)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <div className={`w-16 h-3 rounded-full ${getSectorStrengthColor(sector.strength)}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Breadth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advance/Decline Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Advance/Decline Line</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={breadthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="advanceDecline" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* McClellan Oscillator Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">McClellan Oscillator</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={breadthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mcclellan" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* VIX Fear Index Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">VIX Fear & Greed Index</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={breadthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="vix" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Put/Call Ratio Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 text-purple-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Put/Call Ratio</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={breadthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="putCall" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Market Health Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6"
      >
        <div className="flex items-center mb-4">
          <Gauge className="h-6 w-6 text-blue-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Market Health Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {breadthIndicators.filter(ind => ind.signal === 'BULLISH').length}/{breadthIndicators.length}
            </div>
            <p className="text-gray-400">Bullish Indicators</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {sectorBreadth.filter(sector => sector.strength >= 60).length}/11
            </div>
            <p className="text-gray-400">Strong Sectors</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {marketInternals.filter(internal => internal.signal.includes('BUY')).length}/{marketInternals.length}
            </div>
            <p className="text-gray-400">Positive Internals</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Market Outlook</h4>
          <p className="text-gray-300 text-sm">
            Current market breadth indicators suggest a <span className={marketSentiment.color}>{marketSentiment.sentiment.toLowerCase()}</span> environment. 
            Advance/decline lines are negative, McClellan Oscillator shows deteriorating momentum, and VIX is elevated indicating increased market stress. 
            Most sectors are showing weak breadth with declining stocks outnumbering advancing ones, particularly in Technology and Financials.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketBreadth;
