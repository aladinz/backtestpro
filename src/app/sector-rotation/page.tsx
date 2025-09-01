import MarketBreadthEnhanced from '@/components/MarketBreadthEnhanced'
import Navbar from '@/components/Navbar'

export default function SectorRotationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sector Rotation Dashboard</h1>
          <p className="text-gray-400">Real-time sector analysis and market breadth with Yahoo Finance integration</p>
        </div>
        
        <MarketBreadthEnhanced />
      </div>
    </div>
  )
}
