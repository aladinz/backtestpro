import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BacktestPro - Professional Trading Strategy Backtesting',
  description: 'Professional-grade backtesting platform with real market data. Test, optimize, and validate your trading strategies before risking capital.',
  keywords: 'backtesting, trading, stocks, strategy, analysis, finance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-900">
          {children}
        </div>
      </body>
    </html>
  )
}
