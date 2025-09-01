import PortfolioLibraryEnhanced from '@/components/PortfolioLibraryEnhanced'
import Navbar from '@/components/Navbar'

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      <PortfolioLibraryEnhanced />
    </div>
  )
}
