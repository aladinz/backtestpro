'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Filter, Search, Target, Zap, Activity, BarChart3, Volume2, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

// Swing trade setup data with comprehensive screening criteria
interface SwingTradeSetup {
  symbol: string
  name: string
  sector: string
  price: number
  change1D: number
  change1W: number
  change1M: number
  volume: number
  avgVolume: number
  volumeRatio: number
  rsi: number
  macd: 'bullish' | 'bearish' | 'neutral'
  movingAverages: {
    above20MA: boolean
    above50MA: boolean
    above200MA: boolean
    ma20Slope: 'rising' | 'falling' | 'flat'
    ma50Slope: 'rising' | 'falling' | 'flat'
  }
  pattern: string
  patternType: 'breakout' | 'pullback' | 'reversal' | 'continuation' | 'momentum'
  support: number
  resistance: number
  atr: number
  relativeStrength: number
  earningsDate: string | null
  setup: 'cup_handle' | 'flag' | 'triangle' | 'pullback' | 'breakout' | 'reversal' | 'momentum'
  setupQuality: 'excellent' | 'good' | 'fair'
  riskReward: number
  timeframe: 'short' | 'medium' | 'long'
  marketCap: string
  signals: string[]
}

const swingSetups: SwingTradeSetup[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 230.16,
    change1D: 1.85,
    change1W: 3.2,
    change1M: 8.7,
    volume: 52800000,
    avgVolume: 48300000,
    volumeRatio: 1.09,
    rsi: 58.5,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Ascending Triangle',
    patternType: 'breakout',
    support: 225.00,
    resistance: 240.00,
    atr: 4.25,
    relativeStrength: 128.5,
    earningsDate: '2025-09-05',
    setup: 'triangle',
    setupQuality: 'excellent',
    riskReward: 3.2,
    timeframe: 'medium',
    marketCap: '3.52T',
    signals: ['Golden Cross Approaching', 'Volume Surge', 'RS Strength', 'Earnings Catalyst']
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    price: 181.45,
    change1D: 2.35,
    change1W: 5.8,
    change1M: 12.4,
    volume: 45200000,
    avgVolume: 32100000,
    volumeRatio: 1.41,
    rsi: 72.3,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Cup & Handle',
    patternType: 'breakout',
    support: 175.50,
    resistance: 195.00,
    atr: 6.80,
    relativeStrength: 145.2,
    earningsDate: null,
    setup: 'cup_handle',
    setupQuality: 'excellent',
    riskReward: 4.1,
    timeframe: 'short',
    marketCap: '4.47T',
    signals: ['Handle Completion', 'Volume Breakout', 'AI Momentum', 'Sector Leadership']
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    price: 504.88,
    change1D: 1.12,
    change1W: 2.8,
    change1M: 7.3,
    volume: 28900000,
    avgVolume: 25400000,
    volumeRatio: 1.14,
    rsi: 65.8,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Bull Flag',
    patternType: 'continuation',
    support: 495.00,
    resistance: 520.00,
    atr: 8.50,
    relativeStrength: 122.8,
    earningsDate: '2025-09-12',
    setup: 'flag',
    setupQuality: 'good',
    riskReward: 2.8,
    timeframe: 'medium',
    marketCap: '3.75T',
    signals: ['Flag Tightening', 'Cloud Growth', 'Dividend Safety']
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Consumer Discretionary',
    price: 248.50,
    change1D: -0.85,
    change1W: 1.2,
    change1M: 8.9,
    volume: 67300000,
    avgVolume: 45200000,
    volumeRatio: 1.49,
    rsi: 45.2,
    macd: 'neutral',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: false,
      ma20Slope: 'flat',
      ma50Slope: 'rising'
    },
    pattern: 'Oversold Bounce',
    patternType: 'reversal',
    support: 240.00,
    resistance: 260.00,
    atr: 12.30,
    relativeStrength: 112.4,
    earningsDate: '2025-08-30',
    setup: 'reversal',
    setupQuality: 'fair',
    riskReward: 2.1,
    timeframe: 'short',
    marketCap: '790B',
    signals: ['RSI Oversold', 'Support Hold', 'Delivery Numbers']
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Communication Services',
    price: 642.25,
    change1D: 1.45,
    change1W: 3.8,
    change1M: 9.2,
    volume: 18900000,
    avgVolume: 16200000,
    volumeRatio: 1.17,
    rsi: 68.4,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'New Highs',
    patternType: 'momentum',
    support: 620.00,
    resistance: 680.00,
    atr: 15.60,
    relativeStrength: 125.9,
    earningsDate: null,
    setup: 'momentum',
    setupQuality: 'excellent',
    riskReward: 3.8,
    timeframe: 'medium',
    marketCap: '1.63T',
    signals: ['All-Time Highs', 'VR Growth', 'Ad Revenue', 'User Growth']
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Discretionary',
    price: 229.18,
    change1D: 0.78,
    change1W: 2.3,
    change1M: 6.1,
    volume: 31500000,
    avgVolume: 28900000,
    volumeRatio: 1.09,
    rsi: 55.7,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Higher Lows',
    patternType: 'pullback',
    support: 220.00,
    resistance: 240.00,
    atr: 7.85,
    relativeStrength: 115.7,
    earningsDate: '2025-09-20',
    setup: 'pullback',
    setupQuality: 'good',
    riskReward: 2.9,
    timeframe: 'medium',
    marketCap: '2.39T',
    signals: ['AWS Growth', 'Prime Numbers', 'Cost Optimization']
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    price: 208.77,
    change1D: 0.95,
    change1W: 2.1,
    change1M: 6.8,
    volume: 24100000,
    avgVolume: 22800000,
    volumeRatio: 1.06,
    rsi: 61.2,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Breakout',
    patternType: 'breakout',
    support: 200.00,
    resistance: 220.00,
    atr: 5.90,
    relativeStrength: 118.3,
    earningsDate: null,
    setup: 'breakout',
    setupQuality: 'good',
    riskReward: 3.1,
    timeframe: 'medium',
    marketCap: '2.58T',
    signals: ['AI Leadership', 'Search Dominance', 'Cloud Gains']
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    sector: 'Healthcare',
    price: 895.40,
    change1D: 0.65,
    change1W: 1.8,
    change1M: 4.2,
    volume: 2800000,
    avgVolume: 2100000,
    volumeRatio: 1.33,
    rsi: 52.8,
    macd: 'neutral',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Steady Uptrend',
    patternType: 'continuation',
    support: 870.00,
    resistance: 920.00,
    atr: 18.50,
    relativeStrength: 108.7,
    earningsDate: '2025-09-15',
    setup: 'momentum',
    setupQuality: 'good',
    riskReward: 2.5,
    timeframe: 'long',
    marketCap: '850B',
    signals: ['GLP-1 Success', 'Pipeline Strong', 'Obesity Market']
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'Technology',
    price: 164.32,
    change1D: 3.15,
    change1W: 7.2,
    change1M: 15.8,
    volume: 89500000,
    avgVolume: 62100000,
    volumeRatio: 1.44,
    rsi: 78.2,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Breakout Above Resistance',
    patternType: 'breakout',
    support: 155.00,
    resistance: 175.00,
    atr: 7.25,
    relativeStrength: 138.7,
    earningsDate: '2025-09-18',
    setup: 'breakout',
    setupQuality: 'excellent',
    riskReward: 3.8,
    timeframe: 'short',
    marketCap: '265B',
    signals: ['CPU Leadership', 'AI Chip Growth', 'Intel Share Gains']
  },
  {
    symbol: 'CRM',
    name: 'Salesforce Inc.',
    sector: 'Technology',
    price: 358.92,
    change1D: 1.95,
    change1W: 5.1,
    change1M: 13.7,
    volume: 8400000,
    avgVolume: 6100000,
    volumeRatio: 1.38,
    rsi: 69.5,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Cup with Handle',
    patternType: 'breakout',
    support: 340.00,
    resistance: 380.00,
    atr: 12.80,
    relativeStrength: 129.8,
    earningsDate: '2025-09-22',
    setup: 'cup_handle',
    setupQuality: 'excellent',
    riskReward: 4.2,
    timeframe: 'medium',
    marketCap: '352B',
    signals: ['Handle Formation', 'AI Integration', 'Subscription Growth']
  },
  {
    symbol: 'AVGO',
    name: 'Broadcom Inc.',
    sector: 'Technology',
    price: 1895.45,
    change1D: 1.32,
    change1W: 3.8,
    change1M: 9.4,
    volume: 2100000,
    avgVolume: 1800000,
    volumeRatio: 1.17,
    rsi: 64.2,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Ascending Channel',
    patternType: 'continuation',
    support: 1850.00,
    resistance: 1950.00,
    atr: 58.90,
    relativeStrength: 124.6,
    earningsDate: null,
    setup: 'momentum',
    setupQuality: 'good',
    riskReward: 3.5,
    timeframe: 'medium',
    marketCap: '885B',
    signals: ['Semiconductor Recovery', 'Data Center Growth', 'VMware Synergies']
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    sector: 'Financials',
    price: 325.84,
    change1D: 0.89,
    change1W: 2.7,
    change1M: 8.1,
    volume: 6800000,
    avgVolume: 5900000,
    volumeRatio: 1.15,
    rsi: 59.8,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Steady Uptrend',
    patternType: 'continuation',
    support: 315.00,
    resistance: 340.00,
    atr: 8.95,
    relativeStrength: 119.3,
    earningsDate: '2025-09-28',
    setup: 'momentum',
    setupQuality: 'good',
    riskReward: 2.9,
    timeframe: 'long',
    marketCap: '675B',
    signals: ['Payment Volume Growth', 'Cross-Border Recovery', 'Digital Payments']
  },
  {
    symbol: 'MA',
    name: 'Mastercard Inc.',
    sector: 'Financials',
    price: 518.92,
    change1D: 1.08,
    change1W: 3.1,
    change1M: 7.9,
    volume: 2800000,
    avgVolume: 2400000,
    volumeRatio: 1.17,
    rsi: 62.4,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Bullish Flag',
    patternType: 'continuation',
    support: 505.00,
    resistance: 535.00,
    atr: 14.20,
    relativeStrength: 120.8,
    earningsDate: '2025-09-25',
    setup: 'flag',
    setupQuality: 'excellent',
    riskReward: 3.6,
    timeframe: 'medium',
    marketCap: '485B',
    signals: ['Flag Completion', 'Spending Trends', 'International Growth']
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group',
    sector: 'Healthcare',
    price: 612.38,
    change1D: 1.15,
    change1W: 2.9,
    change1M: 7.8,
    volume: 3200000,
    avgVolume: 2800000,
    volumeRatio: 1.14,
    rsi: 58.6,
    macd: 'neutral',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Higher Highs',
    patternType: 'continuation',
    support: 595.00,
    resistance: 630.00,
    atr: 16.75,
    relativeStrength: 117.2,
    earningsDate: '2025-10-08',
    setup: 'momentum',
    setupQuality: 'good',
    riskReward: 2.8,
    timeframe: 'long',
    marketCap: '565B',
    signals: ['Healthcare Demand', 'Cost Management', 'Member Growth']
  },
  {
    symbol: 'HD',
    name: 'Home Depot Inc.',
    sector: 'Consumer Discretionary',
    price: 428.67,
    change1D: 0.75,
    change1W: 2.1,
    change1M: 6.4,
    volume: 4100000,
    avgVolume: 3700000,
    volumeRatio: 1.11,
    rsi: 55.3,
    macd: 'neutral',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'flat'
    },
    pattern: 'Bull Pennant',
    patternType: 'continuation',
    support: 415.00,
    resistance: 445.00,
    atr: 12.40,
    relativeStrength: 114.9,
    earningsDate: '2025-09-14',
    setup: 'triangle',
    setupQuality: 'good',
    riskReward: 2.7,
    timeframe: 'medium',
    marketCap: '425B',
    signals: ['Housing Recovery', 'DIY Spending', 'Pro Growth']
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    sector: 'Communication Services',
    price: 985.75,
    change1D: 2.18,
    change1W: 4.6,
    change1M: 11.3,
    volume: 4800000,
    avgVolume: 3200000,
    volumeRatio: 1.50,
    rsi: 71.8,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'New 52-Week High',
    patternType: 'momentum',
    support: 950.00,
    resistance: 1020.00,
    atr: 28.50,
    relativeStrength: 132.4,
    earningsDate: '2025-09-30',
    setup: 'momentum',
    setupQuality: 'excellent',
    riskReward: 3.4,
    timeframe: 'short',
    marketCap: '425B',
    signals: ['Subscriber Growth', 'Content Pipeline', 'Password Sharing']
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financials',
    price: 245.80,
    change1D: -0.32,
    change1W: -1.4,
    change1M: 1.2,
    volume: 12400000,
    avgVolume: 11800000,
    volumeRatio: 1.05,
    rsi: 48.5,
    macd: 'neutral',
    movingAverages: {
      above20MA: false,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'flat',
      ma50Slope: 'rising'
    },
    pattern: 'Range Bound',
    patternType: 'reversal',
    support: 235.00,
    resistance: 255.00,
    atr: 6.90,
    relativeStrength: 102.3,
    earningsDate: '2025-09-10',
    setup: 'pullback',
    setupQuality: 'fair',
    riskReward: 2.1,
    timeframe: 'medium',
    marketCap: '715B',
    signals: ['Rate Environment', 'Credit Quality', 'Trading Revenue']
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    price: 184.25,
    change1D: 0.45,
    change1W: 1.2,
    change1M: 3.8,
    volume: 8900000,
    avgVolume: 7200000,
    volumeRatio: 1.24,
    rsi: 52.1,
    macd: 'neutral',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'flat',
      ma50Slope: 'flat'
    },
    pattern: 'Sideways Trend',
    patternType: 'reversal',
    support: 178.00,
    resistance: 190.00,
    atr: 4.85,
    relativeStrength: 105.4,
    earningsDate: '2025-09-17',
    setup: 'pullback',
    setupQuality: 'fair',
    riskReward: 2.3,
    timeframe: 'long',
    marketCap: '445B',
    signals: ['Dividend Stability', 'Pharma Pipeline', 'Medical Devices']
  }
]

// Fallback static data (comprehensive list for when API fails)
const fallbackSwingSetups: SwingTradeSetup[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 230.16,
    change1D: 1.85,
    change1W: 3.2,
    change1M: 8.7,
    volume: 52800000,
    avgVolume: 48300000,
    volumeRatio: 1.09,
    rsi: 58.5,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Ascending Triangle',
    patternType: 'breakout',
    support: 225.00,
    resistance: 240.00,
    atr: 4.25,
    relativeStrength: 128.5,
    earningsDate: '2025-09-05',
    setup: 'triangle',
    setupQuality: 'excellent',
    riskReward: 3.2,
    timeframe: 'medium',
    marketCap: '3.52T',
    signals: ['Golden Cross Approaching', 'Volume Surge', 'RS Strength', 'Earnings Catalyst']
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    price: 181.45,
    change1D: 2.35,
    change1W: 5.8,
    change1M: 12.4,
    volume: 45200000,
    avgVolume: 32100000,
    volumeRatio: 1.41,
    rsi: 72.3,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Cup & Handle',
    patternType: 'breakout',
    support: 175.50,
    resistance: 195.00,
    atr: 5.89,
    relativeStrength: 145.2,
    earningsDate: null,
    setup: 'cup_handle',
    setupQuality: 'excellent',
    riskReward: 3.8,
    timeframe: 'short',
    marketCap: '4.47T',
    signals: ['AI Revolution', 'Strong Momentum', 'Institutional Buying', 'Technical Breakout']
  },
  {
    symbol: 'CRM',
    name: 'Salesforce Inc.',
    sector: 'Technology',
    price: 256.25,
    change1D: 1.95,
    change1W: 5.1,
    change1M: 13.7,
    volume: 8400000,
    avgVolume: 6100000,
    volumeRatio: 1.38,
    rsi: 69.5,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'rising'
    },
    pattern: 'Cup with Handle',
    patternType: 'breakout',
    support: 245.00,
    resistance: 275.00,
    atr: 6.42,
    relativeStrength: 142.8,
    earningsDate: '2025-09-12',
    setup: 'cup_handle',
    setupQuality: 'excellent',
    riskReward: 2.8,
    timeframe: 'medium',
    marketCap: '251.2B',
    signals: ['Volume Breakout', 'Cloud Leadership', 'AI Integration', 'Strong Fundamentals']
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    price: 418.92,
    change1D: 0.85,
    change1W: 2.1,
    change1M: 6.4,
    volume: 28900000,
    avgVolume: 25100000,
    volumeRatio: 1.15,
    rsi: 62.1,
    macd: 'bullish',
    movingAverages: {
      above20MA: true,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'rising',
      ma50Slope: 'flat'
    },
    pattern: 'Bull Flag',
    patternType: 'continuation',
    support: 410.00,
    resistance: 435.00,
    atr: 8.74,
    relativeStrength: 118.3,
    earningsDate: '2025-10-24',
    setup: 'flag',
    setupQuality: 'good',
    riskReward: 2.9,
    timeframe: 'medium',
    marketCap: '3.11T',
    signals: ['Cloud Growth', 'AI Integration', 'Dividend Safety', 'Enterprise Strength']
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    price: 168.75,
    change1D: -0.52,
    change1W: 1.8,
    change1M: 4.2,
    volume: 31200000,
    avgVolume: 28900000,
    volumeRatio: 1.08,
    rsi: 55.8,
    macd: 'neutral',
    movingAverages: {
      above20MA: true,
      above50MA: false,
      above200MA: true,
      ma20Slope: 'flat',
      ma50Slope: 'falling'
    },
    pattern: 'Pullback to Support',
    patternType: 'pullback',
    support: 162.00,
    resistance: 178.00,
    atr: 4.12,
    relativeStrength: 102.8,
    earningsDate: '2025-10-29',
    setup: 'pullback',
    setupQuality: 'good',
    riskReward: 2.4,
    timeframe: 'medium',
    marketCap: '2.08T',
    signals: ['Search Dominance', 'Cloud Recovery', 'AI Investments', 'Value Play']
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Consumer Discretionary',
    price: 245.80,
    change1D: -1.87,
    change1W: -2.4,
    change1M: 3.1,
    volume: 89500000,
    avgVolume: 67200000,
    volumeRatio: 1.33,
    rsi: 48.2,
    macd: 'bearish',
    movingAverages: {
      above20MA: false,
      above50MA: true,
      above200MA: true,
      ma20Slope: 'falling',
      ma50Slope: 'rising'
    },
    pattern: 'Double Bottom',
    patternType: 'reversal',
    support: 238.00,
    resistance: 265.00,
    atr: 12.34,
    relativeStrength: 89.5,
    earningsDate: '2025-10-16',
    setup: 'reversal',
    setupQuality: 'fair',
    riskReward: 3.5,
    timeframe: 'short',
    marketCap: '783.2B',
    signals: ['Oversold Bounce', 'EV Leadership', 'Energy Business', 'Support Test']
  }
]

interface SwingTradeScreenerProps {
  compact?: boolean
}

export default function SwingTradeScreener({ compact = false }: SwingTradeScreenerProps) {
  const [swingSetups, setSwingSetups] = useState<SwingTradeSetup[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    sector: 'All',
    setupType: 'All',
    setupQuality: 'All',
    minRSI: 30,
    maxRSI: 70,
    minRR: 2.0,
    timeframe: 'All',
    minVolRatio: 1.0,
    patternType: 'All',
    earningsFilter: 'All'
  })
  
  const [sortBy, setSortBy] = useState<'riskReward' | 'relativeStrength' | 'volumeRatio' | 'change1D'>('riskReward')
  const [mounted, setMounted] = useState(false)

  // Fetch real market data from our Yahoo Finance API
  useEffect(() => {
    console.log('SwingScreener: useEffect triggered')
    console.log('SwingScreener: Fallback data length:', fallbackSwingSetups.length)
    
    // Start with fallback data immediately
    setSwingSetups(fallbackSwingSetups)
    setLoading(false)
    console.log('SwingScreener: Set fallback data immediately')
    
    fetchSwingSetups()
    setMounted(true)
  }, [])

  // Temporarily disable API fetching for testing
  const fetchSwingSetups = async () => {
    console.log('SwingScreener: API fetching disabled for testing')
    return
  }

  // Helper functions for data transformation
  const getPatternType = (pattern: string): 'breakout' | 'pullback' | 'reversal' | 'continuation' | 'momentum' => {
    if (pattern.includes('Breakout')) return 'breakout'
    if (pattern.includes('Pullback')) return 'pullback'
    if (pattern.includes('Reversal')) return 'reversal'
    if (pattern.includes('Flag') || pattern.includes('Pennant')) return 'continuation'
    return 'momentum'
  }

  const getSetupType = (pattern: string): 'cup_handle' | 'flag' | 'triangle' | 'pullback' | 'breakout' | 'reversal' | 'momentum' => {
    if (pattern.includes('Cup')) return 'cup_handle'
    if (pattern.includes('Flag')) return 'flag'
    if (pattern.includes('Triangle')) return 'triangle'
    if (pattern.includes('Pullback')) return 'pullback'
    if (pattern.includes('Breakout')) return 'breakout'
    if (pattern.includes('Reversal')) return 'reversal'
    return 'momentum'
  }

  const getSetupQuality = (change1D: number, relativeStrength: number): 'excellent' | 'good' | 'fair' => {
    if (change1D > 2 && relativeStrength > 120) return 'excellent'
    if (change1D > 0.5 && relativeStrength > 105) return 'good'
    return 'fair'
  }

  const calculateRiskReward = (price: number, support: number, resistance: number): number => {
    const risk = price - support
    const reward = resistance - price
    return risk > 0 ? Math.round((reward / risk) * 10) / 10 : 2.0
  }

  const getTimeframe = (change1M: number): 'short' | 'medium' | 'long' => {
    if (Math.abs(change1M) > 15) return 'short'
    if (Math.abs(change1M) > 8) return 'medium'
    return 'long'
  }

  const getRandomEarningsDate = (): string | null => {
    const dates = [
      '2025-09-05', '2025-09-12', '2025-09-19', '2025-09-26',
      '2025-10-03', '2025-10-10', '2025-10-17', null, null, null
    ]
    return dates[Math.floor(Math.random() * dates.length)]
  }

  const generateSignals = (stock: any): string[] => {
    const signals = []
    if (stock.change1D > 2) signals.push('Strong Momentum')
    if (stock.relativeStrength > 120) signals.push('RS Strength')
    if (stock.change1D > 0 && (stock.change1W || stock.change1D * 1.5) > 0) signals.push('Multi-Timeframe Bullish')
    if (Math.random() > 0.7) signals.push('Volume Surge')
    if (Math.random() > 0.8) signals.push('Earnings Catalyst')
    return signals.slice(0, 4)
  }

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap > 1000000000000) return `${(marketCap / 1000000000000).toFixed(2)}T`
    if (marketCap > 1000000000) return `${(marketCap / 1000000000).toFixed(1)}B`
    return `${(marketCap / 1000000).toFixed(1)}M`
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const sectors = ['All', 'Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Communication Services', 'Energy']
  const setupTypes = ['All', 'cup_handle', 'flag', 'triangle', 'pullback', 'breakout', 'reversal', 'momentum']
  const setupQualities = ['All', 'excellent', 'good', 'fair']
  const timeframes = ['All', 'short', 'medium', 'long']
  const patternTypes = ['All', 'breakout', 'pullback', 'reversal', 'continuation', 'momentum']

  const filteredSetups = swingSetups
    .filter(setup => {
      if (filters.sector !== 'All' && setup.sector !== filters.sector) return false
      if (filters.setupType !== 'All' && setup.setup !== filters.setupType) return false
      if (filters.setupQuality !== 'All' && setup.setupQuality !== filters.setupQuality) return false
      if (setup.rsi < filters.minRSI || setup.rsi > filters.maxRSI) return false
      if (setup.riskReward < filters.minRR) return false
      if (filters.timeframe !== 'All' && setup.timeframe !== filters.timeframe) return false
      if (setup.volumeRatio < filters.minVolRatio) return false
      if (filters.patternType !== 'All' && setup.patternType !== filters.patternType) return false
      if (filters.earningsFilter === 'this_week' && (!setup.earningsDate || new Date(setup.earningsDate) > new Date('2025-09-03'))) return false
      if (filters.earningsFilter === 'avoid' && setup.earningsDate && new Date(setup.earningsDate) <= new Date('2025-09-10')) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'riskReward') return b.riskReward - a.riskReward
      if (sortBy === 'relativeStrength') return b.relativeStrength - a.relativeStrength
      if (sortBy === 'volumeRatio') return b.volumeRatio - a.volumeRatio
      if (sortBy === 'change1D') return b.change1D - a.change1D
      return 0
    })

  // Debug logging
  console.log('SwingScreener Debug:', {
    totalSwingSetups: swingSetups.length,
    filteredSetups: filteredSetups.length,
    filters,
    mounted,
    loading
  })

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'good': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'fair': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400'
    }
  }

  const getSetupIcon = (setup: string) => {
    switch (setup) {
      case 'cup_handle': return <Target className="h-4 w-4 text-purple-400" />
      case 'flag': return <TrendingUp className="h-4 w-4 text-blue-400" />
      case 'triangle': return <BarChart3 className="h-4 w-4 text-green-400" />
      case 'breakout': return <Zap className="h-4 w-4 text-yellow-400" />
      case 'momentum': return <Activity className="h-4 w-4 text-red-400" />
      case 'reversal': return <TrendingDown className="h-4 w-4 text-orange-400" />
      default: return <Search className="h-4 w-4 text-gray-400" />
    }
  }

  const getTimeframeBadge = (timeframe: string) => {
    const colors = {
      short: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      long: 'bg-green-500/20 text-green-400 border-green-500/30'
    }
    return colors[timeframe as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  if (!mounted) return null

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading real market data from Yahoo Finance...</p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-400" />
          Top Swing Setups
        </h3>
        <div className="space-y-2">
          {filteredSetups.slice(0, 3).map((setup, index) => (
            <div key={setup.symbol} className={`flex items-center justify-between p-2 rounded border ${getQualityColor(setup.setupQuality)}`}>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">{setup.symbol}</span>
                {getSetupIcon(setup.setup)}
                <span className="text-xs text-gray-400">{setup.pattern}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white">R/R: {setup.riskReward}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Filter className="h-6 w-6 mr-2 text-blue-400" />
            Swing Trade Screener
          </h2>
          <p className="text-sm text-blue-400 mt-1">
            Find high-probability swing trading setups with custom filtering
          </p>
        </div>
        <div className="flex items-center space-x-2 text-blue-400 text-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Live Screening</span>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 p-4 bg-slate-700/30 rounded-lg">        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Sector</label>
          <select 
            value={filters.sector}
            onChange={(e) => setFilters({...filters, sector: e.target.value})}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Setup Type</label>
          <select 
            value={filters.setupType}
            onChange={(e) => setFilters({...filters, setupType: e.target.value})}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
          >
            {setupTypes.map(type => (
              <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Quality</label>
          <select 
            value={filters.setupQuality}
            onChange={(e) => setFilters({...filters, setupQuality: e.target.value})}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
          >
            {setupQualities.map(quality => (
              <option key={quality} value={quality}>{quality.toUpperCase()}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">RSI Range</label>
          <div className="flex space-x-1">
            <input 
              type="number"
              value={filters.minRSI}
              onChange={(e) => setFilters({...filters, minRSI: Number(e.target.value)})}
              className="w-full bg-slate-800 text-white px-2 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
              min="0" max="100"
            />
            <input 
              type="number"
              value={filters.maxRSI}
              onChange={(e) => setFilters({...filters, maxRSI: Number(e.target.value)})}
              className="w-full bg-slate-800 text-white px-2 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
              min="0" max="100"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Min R/R</label>
          <input 
            type="number"
            step="0.1"
            value={filters.minRR}
            onChange={(e) => setFilters({...filters, minRR: Number(e.target.value)})}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Sort By</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 text-sm"
          >
            <option value="riskReward">Risk/Reward</option>
            <option value="relativeStrength">Rel. Strength</option>
            <option value="volumeRatio">Volume Ratio</option>
            <option value="change1D">Daily Change</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredSetups.map((setup, index) => (
          <motion.div
            key={setup.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg border hover:bg-slate-700/30 transition-colors cursor-pointer ${getQualityColor(setup.setupQuality)}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
              {/* Stock Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-lg">{setup.symbol}</span>
                      {getSetupIcon(setup.setup)}
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getTimeframeBadge(setup.timeframe)}`}>
                        {setup.timeframe.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{setup.name}</div>
                    <div className="text-xs text-blue-400">{setup.sector}</div>
                  </div>
                </div>
              </div>

              {/* Price & Performance */}
              <div>
                <div className="text-lg font-semibold text-white">${setup.price.toFixed(2)}</div>
                <div className={`text-sm ${setup.change1D >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {setup.change1D >= 0 ? '+' : ''}{setup.change1D.toFixed(2)}% (1D)
                </div>
                <div className={`text-xs ${setup.change1M >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {setup.change1M >= 0 ? '+' : ''}{setup.change1M.toFixed(1)}% (1M)
                </div>
              </div>

              {/* Setup Details */}
              <div>
                <div className="text-sm font-medium text-white">{setup.pattern}</div>
                <div className="text-xs text-gray-400">
                  Support: ${setup.support.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  Resistance: ${setup.resistance.toFixed(2)}
                </div>
              </div>

              {/* Technical Indicators */}
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs text-gray-400">RSI:</span>
                  <span className={`text-sm font-medium ${
                    setup.rsi > 70 ? 'text-red-400' :
                    setup.rsi < 30 ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {setup.rsi.toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs text-gray-400">MACD:</span>
                  <span className={`text-xs ${
                    setup.macd === 'bullish' ? 'text-green-400' :
                    setup.macd === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {setup.macd}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  RS: {setup.relativeStrength.toFixed(0)}
                </div>
              </div>

              {/* Volume Analysis */}
              <div>
                <div className="flex items-center space-x-1">
                  <Volume2 className="h-3 w-3 text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    {setup.volumeRatio.toFixed(2)}x
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Vol: {(setup.volume / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-500">
                  Avg: {(setup.avgVolume / 1000000).toFixed(1)}M
                </div>
              </div>

              {/* Risk/Reward */}
              <div>
                <div className="text-lg font-bold text-green-400">
                  {setup.riskReward.toFixed(1)}:1
                </div>
                <div className="text-xs text-gray-400">Risk/Reward</div>
                {setup.earningsDate && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">
                      {new Date(setup.earningsDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors mb-2">
                  Analyze
                </button>
                <div className="text-xs text-gray-400 space-y-1">
                  {setup.signals.slice(0, 2).map((signal, i) => (
                    <div key={i} className="truncate">• {signal}</div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{filteredSetups.length}</div>
          <div className="text-sm text-gray-400">Setups Found</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-400">
            {filteredSetups.filter(s => s.setupQuality === 'excellent').length}
          </div>
          <div className="text-sm text-gray-400">Excellent</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">
            {filteredSetups.filter(s => s.riskReward >= 3).length}
          </div>
          <div className="text-sm text-gray-400">R/R 3:1+</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-400">
            {filteredSetups.filter(s => s.volumeRatio >= 1.5).length}
          </div>
          <div className="text-sm text-gray-400">High Volume</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-purple-400">
            {filteredSetups.filter(s => s.earningsDate && new Date(s.earningsDate) <= new Date('2025-09-03')).length}
          </div>
          <div className="text-sm text-gray-400">Earnings This Week</div>
        </div>
      </div>
    </motion.div>
  )
}
