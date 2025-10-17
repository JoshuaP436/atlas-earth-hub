import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import PassportBoostVisualizer from '@/components/PassportBoostVisualizer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-900 dark:to-indigo-900 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-purple-200 to-pink-300 dark:from-purple-900 dark:to-pink-900 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">🌎</span>
              </div>
              <div className="transition-all duration-300 group-hover:translate-x-1">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Atlas Earth Hub</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimize Your Empire</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Link href="/calculator" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Calculator</Link>
                <Link href="/strategy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Strategy</Link>
                <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Portfolio</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Master Atlas Earth
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive tools for optimizing your virtual real estate empire with verified game data, strategic insights, and advanced analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/calculator"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>🧮</span>
                <span>ROI Calculator</span>
              </span>
            </Link>
            <Link 
              href="/strategy"
              className="group border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-10 py-4 rounded-full font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>Strategy Planner</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-200">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">ROI Calculator</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Calculate precise returns with verified rent rates. Compare parcel types and optimize your Atlas Buck investments.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Strategy Planner</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Plan optimal boost tier strategies, badge investments, and long-term portfolio growth with advanced analytics.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-400">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Portfolio Tracker</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track your virtual real estate empire with detailed analytics, earnings projections, and performance insights.
            </p>
          </div>
        </div>

        {/* Interactive Tools Section */}
        <div className="mb-16 animate-fade-in-up delay-300">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Interactive Tools
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Visualize your progress and optimize your Atlas Earth strategy with our advanced calculators and planning tools.
            </p>
          </div>

          {/* Passport Boost Visualizer */}
          <div className="mb-12">
            <PassportBoostVisualizer />
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/calculator" className="group">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700 hover:scale-105 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">ROI Calculator</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Calculate precise returns with verified rent rates, boost multipliers, and badge bonuses for optimal investment decisions.
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Start Calculating <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            <Link href="/strategy" className="group">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700 hover:scale-105 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">Strategy Planner</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Plan optimal boost tier strategies, badge investments, and long-term portfolio growth with advanced analytics.
                </p>
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Plan Strategy <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            <Link href="/portfolio" className="group">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700 hover:scale-105 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Tracker</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Track your complete portfolio with real-time calculations, progress analytics, and optimization recommendations.
                </p>
                <div className="flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Track Portfolio <span className="ml-2">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Verified Data Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-16 animate-fade-in-up delay-500">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">✅ Verified Atlas Earth Data (October 2025)</h3>
            <p className="text-indigo-100">
              Our calculations use official rent rates from Atlas Reality Help Center, ensuring 100% accurate projections.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group text-center transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-green-800 to-emerald-800 rounded-2xl p-6 mb-4 border border-green-600 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-2xl">🟢</span>
                  <span className="ml-2 text-lg font-bold text-green-300">Common</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">100 AB</p>
                <p className="text-sm text-green-200">Most Efficient!</p>
              </div>
              <div className="bg-green-900 rounded-lg px-3 py-2">
                <p className="text-sm font-semibold text-green-300">Best ROI per Atlas Buck</p>
              </div>
            </div>
            
            <div className="group text-center transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-blue-800 to-cyan-800 rounded-2xl p-6 mb-4 border border-blue-600 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-2xl">🔵</span>
                  <span className="ml-2 text-lg font-bold text-blue-300">Rare</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">500 AB</p>
                <p className="text-sm text-blue-200">2.9x less efficient</p>
              </div>
              <div className="bg-blue-900 rounded-lg px-3 py-2">
                <p className="text-sm font-semibold text-blue-300">Still viable investment</p>
              </div>
            </div>

            <div className="group text-center transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-2xl p-6 mb-4 border border-purple-600 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-2xl">🟣</span>
                  <span className="ml-2 text-lg font-bold text-purple-300">Epic</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">1,250 AB</p>
                <p className="text-sm text-purple-200">Poor efficiency</p>
              </div>
              <div className="bg-purple-900 rounded-lg px-3 py-2">
                <p className="text-sm font-semibold text-purple-300">Consider alternatives</p>
              </div>
            </div>

            <div className="group text-center transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-yellow-800 to-orange-800 rounded-2xl p-6 mb-4 border border-yellow-600 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-2xl">🟡</span>
                  <span className="ml-2 text-lg font-bold text-yellow-300">Legendary</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">2,500 AB</p>
                <p className="text-sm text-yellow-200">WORST Efficiency!</p>
              </div>
              <div className="bg-red-900 rounded-lg px-3 py-2">
                <p className="text-sm font-semibold text-red-300">⚠️ 25 Commons = 6.25x better!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🌎</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Atlas Earth Hub</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Unofficial community tool for Atlas Earth players. Not affiliated with Atlas Reality, Inc.
                Built with passion for the community.
              </p>
              <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                <span>© 2024 Atlas Earth Hub</span>
                <span>•</span>
                <span>Community Driven</span>
                <span>•</span>
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}