import PortfolioTracker from '@/components/PortfolioTracker'
import Navbar from '@/components/Navbar'

export default function PortfolioTrackerPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Portfolio Tracker</h1>
          <p className="text-gray-400">Real-time portfolio tracking with Yahoo Finance integration</p>
        </div>
        
        <PortfolioTracker />
      </div>
    </div>
  )
}
