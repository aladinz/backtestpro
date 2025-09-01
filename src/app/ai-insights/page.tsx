import AIInsights from '@/components/AIInsights';
import Navbar from '@/components/Navbar';

export default function AIInsightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">AI Trading Intelligence Center</h1>
          <p className="text-xl text-gray-300 max-w-4xl">
            Harness the power of artificial intelligence to discover trading opportunities, identify market risks, 
            and receive personalized trading strategies. Our AI continuously analyzes market patterns, sentiment, 
            and technical indicators to provide you with actionable insights.
          </p>
        </div>

        {/* AI Insights Component */}
        <AIInsights />

        {/* Educational Content About AI Trading */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">How Our AI Works</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong className="text-blue-400">Pattern Recognition:</strong> Advanced algorithms identify chart patterns, support/resistance levels, and trend changes across thousands of stocks.</p>
              <p><strong className="text-green-400">Sentiment Analysis:</strong> AI processes news, social media, and market data to gauge investor sentiment and predict potential moves.</p>
              <p><strong className="text-purple-400">Risk Assessment:</strong> Continuous monitoring of portfolio risk metrics and market conditions to alert you of potential dangers.</p>
              <p><strong className="text-yellow-400">Market Timing:</strong> Machine learning models analyze market cycles and breadth indicators to optimize entry and exit timing.</p>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">AI Insight Types</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span><strong>Opportunities:</strong> High-probability trade setups and breakout patterns</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span><strong>Warnings:</strong> Market weakness signals and sector rotation alerts</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span><strong>Strategies:</strong> Custom trading approaches based on current market conditions</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span><strong>Market Analysis:</strong> Broader market trend analysis and economic insights</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span><strong>Risk Alerts:</strong> Portfolio concentration and risk management warnings</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features Highlight */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Next-Generation AI Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">Real-Time Analysis</h4>
              <p className="text-gray-300 text-sm">AI continuously monitors market conditions and updates insights throughout the trading day.</p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold mb-2">Confidence Scoring</h4>
              <p className="text-gray-300 text-sm">Each insight includes an AI confidence score from 1-100 to help you prioritize actions.</p>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Personalized Recommendations</h4>
              <p className="text-gray-300 text-sm">AI learns from your trading style and portfolio to provide customized insights.</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-white font-semibold mb-2">🤖 AI Trading Philosophy</h4>
            <p className="text-gray-300 text-sm italic">
              "Our AI doesn't replace human judgment - it enhances it. By processing vast amounts of market data 
              and identifying patterns humans might miss, our AI empowers you to make better-informed trading decisions 
              while maintaining full control over your strategy."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
