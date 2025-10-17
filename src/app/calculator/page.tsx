'use client';

import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

// Verified Atlas Earth Data (October 2025)
const PARCEL_DATA = {
  common: { rent: 0.0000000011, cost: 100, name: 'Common', icon: '🟢', color: 'green' },
  rare: { rent: 0.0000000016, cost: 500, name: 'Rare', icon: '🔵', color: 'blue' },
  epic: { rent: 0.0000000022, cost: 1250, name: 'Epic', icon: '🟣', color: 'purple' },
  legendary: { rent: 0.0000000044, cost: 2500, name: 'Legendary', icon: '🟡', color: 'yellow' }
};

interface CalculationResult {
  dailyRent: number;
  monthlyRent: number;
  yearlyRent: number;
  breakEvenDays: number;
  efficiency: number;
}

export default function CalculatorPage() {
  const [selectedParcel, setSelectedParcel] = useState<keyof typeof PARCEL_DATA>('common');
  const [quantity, setQuantity] = useState<number>(1);
  const [quantityInput, setQuantityInput] = useState<string>('1'); // Separate state for input display
  const [boost, setBoost] = useState<number>(1);
  const [badgeBonus, setBadgeBonus] = useState<number>(0);

  const calculateReturns = (): CalculationResult => {
    const parcel = PARCEL_DATA[selectedParcel];
    const baseRent = parcel.rent * quantity;
    const boostMultiplier = boost;
    const badgeMultiplier = 1 + badgeBonus;
    
    const totalRentPerSecond = baseRent * boostMultiplier * badgeMultiplier;
    const dailyRent = totalRentPerSecond * 86400; // 24 * 60 * 60
    const monthlyRent = dailyRent * 30;
    const yearlyRent = dailyRent * 365;
    const totalCost = parcel.cost * quantity;
    const breakEvenDays = totalCost / dailyRent;
    const efficiency = (baseRent * 86400) / parcel.cost;

    return {
      dailyRent,
      monthlyRent,
      yearlyRent,
      breakEvenDays,
      efficiency
    };
  };

  const results = calculateReturns();

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
                <p className="text-sm text-gray-600 dark:text-gray-400">ROI Calculator</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Home</Link>
                <Link href="/calculator" className="text-blue-600 dark:text-blue-400 font-semibold">Calculator</Link>
                <Link href="/strategy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Strategy</Link>
                <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Portfolio</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            ROI Calculator
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Calculate precise returns on your Atlas Earth investments with verified rent rates from Atlas Reality Help Center.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Investment Parameters</h3>
            
            {/* Parcel Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Parcel Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(PARCEL_DATA).map(([key, parcel]) => {
                  const getParcelStyles = () => {
                    if (selectedParcel !== key) {
                      return 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500';
                    }
                    
                    switch (parcel.color) {
                      case 'green':
                        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
                      case 'blue':
                        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
                      case 'purple':
                        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
                      case 'yellow':
                        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
                      default:
                        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
                    }
                  };
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedParcel(key as keyof typeof PARCEL_DATA)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${getParcelStyles()}`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">{parcel.icon}</span>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">{parcel.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.cost} AB</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantityInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuantityInput(value); // Always update the input display
                  
                  if (value === '') {
                    // Don't update quantity state when empty - keep previous value for calculations
                    return;
                  } else {
                    const numValue = parseInt(value) || 0;
                    setQuantity(numValue);
                  }
                }}
                onBlur={(e) => {
                  // Apply minimum when user leaves the field
                  const value = e.target.value;
                  if (value === '' || parseInt(value) < 1) {
                    const newQuantity = Math.max(1, parseInt(value) || 1);
                    setQuantity(newQuantity);
                    setQuantityInput(newQuantity.toString());
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="1"
                placeholder="Enter quantity"
              />
            </div>

            {/* Boost Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Boost Level (1x - 5x)
              </label>
              <select
                value={boost}
                onChange={(e) => setBoost(parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={1}>1x Boost (Free)</option>
                <option value={1.25}>1.25x Boost</option>
                <option value={1.5}>1.5x Boost</option>
                <option value={2}>2x Boost</option>
                <option value={2.5}>2.5x Boost</option>
                <option value={3}>3x Boost</option>
                <option value={4}>4x Boost</option>
                <option value={5}>5x Boost (Max)</option>
              </select>
            </div>

            {/* Badge Bonus */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location Badge Bonus
              </label>
              <select
                value={badgeBonus}
                onChange={(e) => setBadgeBonus(parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          </div>

          {/* Results Panel */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Investment Returns</h3>
            
            {/* Investment Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Investment</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {(PARCEL_DATA[selectedParcel].cost * quantity).toLocaleString()} AB
                </span>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily Earnings</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${results.dailyRent.toFixed(6)}
                  </p>
                </div>
                <span className="text-2xl">📅</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Earnings</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${results.monthlyRent.toFixed(4)}
                  </p>
                </div>
                <span className="text-2xl">📊</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yearly Earnings</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ${results.yearlyRent.toFixed(2)}
                  </p>
                </div>
                <span className="text-2xl">🚀</span>
              </div>
            </div>

            {/* Break Even Analysis */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Break Even Time</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {results.breakEvenDays.toFixed(1)} days
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Efficiency Score</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {(results.efficiency * 1000000).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Comparison */}
        <div className="mt-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Efficiency Comparison</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(PARCEL_DATA).map(([key, parcel]) => {
              const efficiency = (parcel.rent * 86400) / parcel.cost;
              const isSelected = key === selectedParcel;
              
              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl">{parcel.icon}</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-2">{parcel.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.cost} AB</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                      {(efficiency * 1000000).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">efficiency</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>💡 Pro Tip:</strong> Common parcels provide the best efficiency per Atlas Buck invested. 
              25 Common parcels (2,500 AB) generate 6.25x more rent than 1 Legendary parcel (2,500 AB)!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}