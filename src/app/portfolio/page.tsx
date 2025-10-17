'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

// Verified Atlas Earth Data
const PARCEL_DATA = {
  common: { rent: 0.0000000011, cost: 100, name: 'Common', icon: '🟢', color: 'green' },
  rare: { rent: 0.0000000016, cost: 500, name: 'Rare', icon: '🔵', color: 'blue' },
  epic: { rent: 0.0000000022, cost: 1250, name: 'Epic', icon: '🟣', color: 'purple' },
  legendary: { rent: 0.0000000044, cost: 2500, name: 'Legendary', icon: '🟡', color: 'yellow' }
};

interface ParcelHolding {
  type: keyof typeof PARCEL_DATA;
  quantity: number;
}

interface PortfolioData {
  parcels: ParcelHolding[];
  boostLevel: number;
  badgeBonus: number;
  totalInvestment: number;
  dailyEarnings: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
  efficiency: number;
  breakEvenDays: number;
}

export default function PortfolioPage() {
  const [parcels, setParcels] = useState<ParcelHolding[]>([
    { type: 'common', quantity: 0 },
    { type: 'rare', quantity: 0 },
    { type: 'epic', quantity: 0 },
    { type: 'legendary', quantity: 0 }
  ]);
  
  const [boostLevel, setBoostLevel] = useState<number>(1);
  const [badgeBonus, setBadgeBonus] = useState<number>(0);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);

  const updateParcelQuantity = (type: keyof typeof PARCEL_DATA, quantity: number) => {
    setParcels(prev => 
      prev.map(parcel => 
        parcel.type === type ? { ...parcel, quantity: Math.max(0, quantity) } : parcel
      )
    );
  };

  const calculatePortfolio = (): PortfolioData => {
    let totalInvestment = 0;
    let baseRentPerSecond = 0;

    parcels.forEach(parcel => {
      const parcelInfo = PARCEL_DATA[parcel.type];
      totalInvestment += parcelInfo.cost * parcel.quantity;
      baseRentPerSecond += parcelInfo.rent * parcel.quantity;
    });

    const totalMultiplier = boostLevel * (1 + badgeBonus);
    const adjustedRentPerSecond = baseRentPerSecond * totalMultiplier;
    
    const dailyEarnings = adjustedRentPerSecond * 86400;
    const monthlyEarnings = dailyEarnings * 30;
    const yearlyEarnings = dailyEarnings * 365;
    
    const efficiency = totalInvestment > 0 ? dailyEarnings / totalInvestment : 0;
    const breakEvenDays = dailyEarnings > 0 ? totalInvestment / dailyEarnings : 0;

    return {
      parcels,
      boostLevel,
      badgeBonus,
      totalInvestment,
      dailyEarnings,
      monthlyEarnings,
      yearlyEarnings,
      efficiency,
      breakEvenDays
    };
  };

  useEffect(() => {
    setPortfolioData(calculatePortfolio());
  }, [parcels, boostLevel, badgeBonus]);

  const formatCurrency = (amount: number) => {
    return amount < 0.01 ? `$${amount.toFixed(6)}` : `$${amount.toFixed(4)}`;
  };

  const getParcelDistribution = () => {
    const total = parcels.reduce((sum, parcel) => sum + parcel.quantity, 0);
    return parcels.map(parcel => ({
      ...parcel,
      percentage: total > 0 ? (parcel.quantity / total) * 100 : 0
    }));
  };

  const getOptimizationSuggestions = () => {
    const suggestions = [];
    const totalParcels = parcels.reduce((sum, parcel) => sum + parcel.quantity, 0);
    
    if (totalParcels === 0) {
      suggestions.push({
        type: 'info',
        message: 'Start by adding your current parcel holdings to see personalized analytics.'
      });
      return suggestions;
    }

    // Check Common parcel ratio
    const commonRatio = (parcels.find(p => p.type === 'common')?.quantity || 0) / totalParcels;
    if (commonRatio < 0.7) {
      suggestions.push({
        type: 'warning',
        message: 'Consider increasing Common parcels - they provide the best efficiency per Atlas Buck invested.'
      });
    }

    // Check for Legendary parcels
    const legendaryCount = parcels.find(p => p.type === 'legendary')?.quantity || 0;
    if (legendaryCount > 0) {
      const commonEquivalent = legendaryCount * 25;
      suggestions.push({
        type: 'alert',
        message: `Your ${legendaryCount} Legendary parcel(s) could be ${commonEquivalent} Common parcels, providing 6.25x more rent!`
      });
    }

    // Check boost level efficiency
    if (boostLevel === 1 && portfolioData && portfolioData.totalInvestment > 1000) {
      suggestions.push({
        type: 'info',
        message: 'With a large portfolio, consider investing in boost levels for increased returns.'
      });
    }

    // Check badge collection - Official Atlas Reality Help Center data
    if (badgeBonus === 0) {
      suggestions.push({
        type: 'info',
        message: 'Consider purchasing badges (200 AB each) for permanent rent bonuses. Start with 1-10 badges for +5% total rent.'
      });
    } else if (badgeBonus === 0.05) {
      suggestions.push({
        type: 'info',
        message: 'You have 1-10 badges (+5% bonus). Invest in more badges to reach higher tiers: 11-30 badges (+10%), up to 101+ badges (+25% MAX).'
      });
    } else if (badgeBonus === 0.10) {
      suggestions.push({
        type: 'info',
        message: 'You have 11-30 badges (+10% bonus). Consider reaching 31-60 badges (+15%) or the maximum 101+ badges (+25%).'
      });
    } else if (badgeBonus === 0.15) {
      suggestions.push({
        type: 'info',
        message: 'You have 31-60 badges (+15% bonus). Push to 61-100 badges (+20%) or maximum 101+ badges (+25%).'
      });
    } else if (badgeBonus === 0.20) {
      suggestions.push({
        type: 'info',
        message: 'You have 61-100 badges (+20% bonus). Reach 101+ badges for the maximum +25% rent bonus!'
      });
    } else if (badgeBonus === 0.25) {
      suggestions.push({
        type: 'success',
        message: 'Excellent! You have 101+ badges for the maximum +25% rent bonus. As mayor, earn 20 AB per badge sold in your jurisdiction.'
      });
    }

    return suggestions;
  };

  const exportPortfolio = () => {
    const data = {
      timestamp: new Date().toISOString(),
      portfolio: portfolioData,
      parcels: parcels.filter(p => p.quantity > 0)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-earth-portfolio-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio Tracker</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Home</Link>
                <Link href="/calculator" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Calculator</Link>
                <Link href="/strategy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Strategy</Link>
                <Link href="/portfolio" className="text-blue-600 dark:text-blue-400 font-semibold">Portfolio</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            Portfolio Tracker
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track your virtual real estate empire with detailed analytics, earnings projections, and optimization insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Portfolio Input */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Holdings</h3>
              
              {/* Parcel Inputs */}
              <div className="space-y-4 mb-6">
                {parcels.map((parcel) => {
                  const parcelInfo = PARCEL_DATA[parcel.type];
                  return (
                    <div key={parcel.type} className="flex items-center space-x-3">
                      <span className="text-2xl">{parcelInfo.icon}</span>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {parcelInfo.name}
                        </label>
                        <input
                          type="number"
                          value={parcel.quantity}
                          onChange={(e) => updateParcelQuantity(parcel.type, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          min="0"
                          placeholder="0"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{parcelInfo.cost} AB</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(parcelInfo.cost * parcel.quantity).toLocaleString()} AB
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Boost Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Boost Level
                </label>
                <select
                  value={boostLevel}
                  onChange={(e) => setBoostLevel(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={1}>1x (Free)</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                  <option value={2.5}>2.5x</option>
                  <option value={3}>3x</option>
                  <option value={4}>4x</option>
                  <option value={5}>5x (Max)</option>
                </select>
              </div>

              {/* Badge Count */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location Badges Collected
                </label>
                <select
                  value={badgeBonus}
                  onChange={(e) => setBadgeBonus(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={0}>0 badges (0%)</option>
                  <option value={0.05}>1-10 badges (+5%)</option>
                  <option value={0.10}>11-30 badges (+10%)</option>
                  <option value={0.15}>31-60 badges (+15%)</option>
                  <option value={0.20}>61-100 badges (+20%)</option>
                  <option value={0.25}>101+ badges (+25% MAX)</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  � Official: Badges cost 200 Atlas Bucks each | Mayor payout: 20 AB per badge sold in your jurisdiction
                </p>
              </div>

              {/* Export Button */}
              <button
                onClick={exportPortfolio}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                📊 Export Portfolio Data
              </button>
            </div>
          </div>

          {/* Portfolio Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Overview */}
            {portfolioData && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Portfolio Overview</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Investment</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {portfolioData.totalInvestment.toLocaleString()} AB
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily Earnings</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(portfolioData.dailyEarnings)}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Earnings</p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(portfolioData.monthlyEarnings)}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Yearly Projection</p>
                    <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(portfolioData.yearlyEarnings)}
                    </p>
                  </div>
                </div>

                {/* Portfolio Distribution */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Distribution</h4>
                  <div className="space-y-3">
                    {getParcelDistribution().map((parcel) => {
                      const parcelInfo = PARCEL_DATA[parcel.type];
                      return parcel.quantity > 0 ? (
                        <div key={parcel.type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{parcelInfo.icon}</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {parcelInfo.name}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {parcel.quantity} parcels
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                  parcelInfo.color === 'green' ? 'bg-green-500' :
                                  parcelInfo.color === 'blue' ? 'bg-blue-500' :
                                  parcelInfo.color === 'purple' ? 'bg-purple-500' :
                                  parcelInfo.color === 'yellow' ? 'bg-yellow-500' :
                                  'bg-gray-500'
                                }`}
                                style={{ width: `${parcel.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                              {parcel.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Break Even Time</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {portfolioData.breakEvenDays > 0 ? `${portfolioData.breakEvenDays.toFixed(1)} days` : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency Score</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {(portfolioData.efficiency * 1000000).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Optimization Suggestions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">💡 Optimization Suggestions</h3>
              
              <div className="space-y-3">
                {getOptimizationSuggestions().map((suggestion, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      suggestion.type === 'alert' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-300'
                        : suggestion.type === 'warning'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-300'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-300'
                    }`}
                  >
                    <p className="text-sm">{suggestion.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projection Chart */}
            {portfolioData && portfolioData.dailyEarnings > 0 && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">📈 Earnings Projection</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {[30, 90, 365].map((days) => {
                    const totalEarnings = portfolioData.dailyEarnings * days;
                    const roiPercentage = (totalEarnings / portfolioData.totalInvestment) * 100;
                    
                    return (
                      <div key={days} className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{days} Days</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(totalEarnings)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {roiPercentage.toFixed(2)}% ROI
                        </p>
                        <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, roiPercentage)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}