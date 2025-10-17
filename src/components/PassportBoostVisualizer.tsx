'use client';

import { useState } from 'react';

// Official Atlas Reality Help Center badge data (October 2025)
const BADGE_SYSTEM = {
  cost: 200, // 200 Atlas Bucks per badge
  tiers: [
    { minBadges: 0, maxBadges: 0, bonus: 0, description: 'No badges', color: 'from-gray-400 to-gray-500' },
    { minBadges: 1, maxBadges: 10, bonus: 0.05, description: '1-10 badges (+5%)', color: 'from-green-400 to-green-500' },
    { minBadges: 11, maxBadges: 30, bonus: 0.10, description: '11-30 badges (+10%)', color: 'from-blue-400 to-blue-500' },
    { minBadges: 31, maxBadges: 60, bonus: 0.15, description: '31-60 badges (+15%)', color: 'from-purple-400 to-purple-500' },
    { minBadges: 61, maxBadges: 100, bonus: 0.20, description: '61-100 badges (+20%)', color: 'from-orange-400 to-orange-500' },
    { minBadges: 101, maxBadges: 999, bonus: 0.25, description: '101+ badges (+25% MAX)', color: 'from-yellow-400 to-yellow-500' }
  ],
  mayorPayout: 20 // 20 AB per badge purchased in your jurisdiction
};

export default function PassportBoostVisualizer() {
  const [currentBadges, setCurrentBadges] = useState<number>(0);
  const [badgesInput, setBadgesInput] = useState<string>('0'); // Separate state for input display
  const [monthlyRent, setMonthlyRent] = useState<number>(100); // Default monthly rent in dollars
  const [rentInput, setRentInput] = useState<string>('100'); // Separate state for input display

  // Find current tier
  const getCurrentTier = () => {
    if (currentBadges === 0) return BADGE_SYSTEM.tiers[0];
    
    for (let i = BADGE_SYSTEM.tiers.length - 1; i >= 1; i--) {
      const tier = BADGE_SYSTEM.tiers[i];
      if (currentBadges >= tier.minBadges) {
        return tier;
      }
    }
    return BADGE_SYSTEM.tiers[1];
  };

  // Find next tier
  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = BADGE_SYSTEM.tiers.findIndex(tier => tier === currentTier);
    
    if (currentIndex < BADGE_SYSTEM.tiers.length - 1) {
      return BADGE_SYSTEM.tiers[currentIndex + 1];
    }
    return null; // Already at max tier
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  
  // Calculate overall progress from 0 to 101+ badges (simpler and clearer)
  const getProgress = () => {
    if (currentBadges >= 101) return 100; // Max tier reached
    
    // Show progress as percentage of way to maximum (101 badges)
    return Math.min(100, (currentBadges / 101) * 100);
  };

  const badgesNeeded = nextTier ? nextTier.minBadges - currentBadges : 0;
  const nextTierBonus = nextTier ? nextTier.bonus - currentTier.bonus : 0;
  const extraMonthlyIncome = monthlyRent * nextTierBonus;
  const investmentRequired = badgesNeeded * BADGE_SYSTEM.cost;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Passport Boost Visualizer
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your badge progression and tier benefits
          </p>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Badges
          </label>
          <input
            type="number"
            min="0"
            max="150"
            value={badgesInput}
            onChange={(e) => {
              const value = e.target.value;
              setBadgesInput(value); // Always update the input display
              
              if (value === '') {
                // Don't update badges state when empty - keep previous value for calculations
                return;
              } else {
                const numValue = parseInt(value) || 0;
                setCurrentBadges(Math.max(0, Math.min(150, numValue)));
              }
            }}
            onBlur={(e) => {
              // Apply bounds when user leaves the field
              const value = e.target.value;
              if (value === '') {
                setBadgesInput('0');
                setCurrentBadges(0);
              } else {
                const numValue = Math.max(0, Math.min(150, parseInt(value) || 0));
                setCurrentBadges(numValue);
                setBadgesInput(numValue.toString());
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter number of badges"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monthly Rent ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={rentInput}
            onChange={(e) => {
              const value = e.target.value;
              setRentInput(value); // Always update the input display
              
              if (value === '') {
                // Don't update rent state when empty - keep previous value for calculations
                return;
              } else {
                const numValue = parseFloat(value) || 0;
                setMonthlyRent(Math.max(0, numValue));
              }
            }}
            onBlur={(e) => {
              // Apply minimum when user leaves the field
              const value = e.target.value;
              if (value === '') {
                setRentInput('0');
                setMonthlyRent(0);
              } else {
                const numValue = Math.max(0, parseFloat(value) || 0);
                setMonthlyRent(numValue);
                setRentInput(numValue.toString());
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter monthly rent amount"
          />
        </div>
      </div>

      {/* Current Tier Status */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Tier: {currentTier.description}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentBadges}/101+ badges
          </span>
        </div>

        {/* Glowing Progress Bar */}
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${currentTier.color} transition-all duration-1000 ease-out relative`}
            style={{ width: `${getProgress()}%` }}
          >
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Tier Markers */}
        <div className="relative flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span style={{position: 'absolute', left: '0%'}}>0</span>
          <span style={{position: 'absolute', left: '9.9%'}}>10</span>
          <span style={{position: 'absolute', left: '29.7%'}}>30</span>
          <span style={{position: 'absolute', left: '59.4%'}}>60</span>
          <span style={{position: 'absolute', left: '99.0%'}}>100</span>
          <span style={{position: 'absolute', left: '100%', transform: 'translateX(-100%)'}}>101+</span>
        </div>
      </div>

      {/* Next Tier Information */}
      {nextTier ? (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            🎯 Next Tier: {nextTier.description}
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {badgesNeeded}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Badges Needed
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                +${extraMonthlyIncome.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Extra Monthly Income
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Investment Required:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {investmentRequired.toLocaleString()} AB
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Bonus Increase:
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                +{(nextTierBonus * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700 text-center">
          <div className="text-2xl mb-2">🏆</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Maximum Tier Achieved!
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You&apos;ve reached the maximum +25% rent bonus. As mayor, earn 20 AB per badge sold in your jurisdiction!
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {(currentTier.bonus * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Current Bonus
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            ${(monthlyRent * currentTier.bonus).toFixed(2)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Monthly Bonus Income
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {(currentBadges * BADGE_SYSTEM.cost).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total AB Invested
          </div>
        </div>
      </div>
    </div>
  );
}