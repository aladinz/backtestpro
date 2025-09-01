import MarketBreadth from '@/components/MarketBreadth';
import Navbar from '@/components/Navbar';

export default function MarketBreadthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Market Breadth Center</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Analyze market internals, sentiment indicators, and sector breadth to gauge overall market health and direction. 
            These professional-grade tools help you understand the underlying strength or weakness driving market movements.
          </p>
        </div>

        {/* Market Breadth Component */}
        <MarketBreadth />

        {/* Educational Content */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Understanding Market Breadth</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong className="text-blue-400">Advance/Decline Line:</strong> Shows the cumulative difference between advancing and declining stocks. A rising A/D line confirms market strength.</p>
              <p><strong className="text-green-400">McClellan Oscillator:</strong> Measures market momentum using exponential moving averages of advancing vs declining issues. Values above +50 are bullish.</p>
              <p><strong className="text-yellow-400">VIX Fear Index:</strong> Measures implied volatility and market fear. Values below 20 indicate complacency, above 30 suggest fear.</p>
              <p><strong className="text-purple-400">Put/Call Ratio:</strong> Ratio of put to call options traded. Values below 0.8 indicate bullish sentiment, above 1.2 suggest bearish sentiment.</p>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Trading Signals</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span><strong>Bullish Breadth:</strong> Rising A/D line, positive McClellan, low VIX, strong sector participation</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span><strong>Bearish Breadth:</strong> Declining A/D line, negative McClellan, high VIX, weak sector breadth</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span><strong>Divergence Warning:</strong> Price and breadth moving in opposite directions signal potential reversal</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span><strong>Thrust Signals:</strong> Breadth thrusts (90% up days) often mark the start of new trends</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Explanation */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Professional Market Breadth Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">New Highs/Lows</h4>
              <p className="text-gray-300 text-sm">Track stocks making new 52-week highs vs lows. Healthy markets should see expanding new highs during uptrends.</p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold mb-2">TRIN Index</h4>
              <p className="text-gray-300 text-sm">Arms Index measuring volume vs price changes. Values below 1.0 are bullish, above 1.0 bearish.</p>
            </div>
            <div>
              <h4 className="text-yellow-400 font-semibold mb-2">Sector Rotation</h4>
              <p className="text-gray-300 text-sm">Monitor which sectors are leading or lagging to understand market character and economic cycle.</p>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Volume Analysis</h4>
              <p className="text-gray-300 text-sm">Up volume vs down volume shows the conviction behind price moves and validates market direction.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
