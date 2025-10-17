'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserAuth } from '@/components/user-auth';
import Link from 'next/link';

// Verified Atlas Earth Data
const PARCEL_DATA = {
  common: { rent: 0.0000000011, cost: 100, name: 'Common', icon: '🟢', color: 'green' },
  rare: { rent: 0.0000000016, cost: 500, name: 'Rare', icon: '🔵', color: 'blue' },
  epic: { rent: 0.0000000022, cost: 1250, name: 'Epic', icon: '🟣', color: 'purple' },
  legendary: { rent: 0.0000000044, cost: 2500, name: 'Legendary', icon: '🟡', color: 'yellow' }
};

// Ad boost multipliers (temporary boosts from watching ads)
const AD_BOOST_OPTIONS = [
  { multiplier: 1, label: "No Ad Boost (1x)", hours: 0 },
  { multiplier: 20, label: "20x Ad Boost", hours: 4 },
  { multiplier: 30, label: "30x Ad Boost", hours: 6 },
  { multiplier: 50, label: "50x Super Rent Boost", hours: 8 },
];

// Official Atlas Reality Help Center badge data (October 2025)
const BADGE_SYSTEM = {
  cost: 200, // 200 Atlas Bucks per badge
  tiers: [
    { minBadges: 0, maxBadges: 0, bonus: 0, description: 'No badges (0%)' },
    { minBadges: 1, maxBadges: 10, bonus: 0.05, description: '1-10 badges (+5%)' },
    { minBadges: 11, maxBadges: 30, bonus: 0.10, description: '11-30 badges (+10%)' },
    { minBadges: 31, maxBadges: 60, bonus: 0.15, description: '31-60 badges (+15%)' },
    { minBadges: 61, maxBadges: 100, bonus: 0.20, description: '61-100 badges (+20%)' },
    { minBadges: 101, maxBadges: 999, bonus: 0.25, description: '101+ badges (+25% MAX)' }
  ],
  mayorPayout: 20 // 20 AB per badge purchased in your jurisdiction
};

// Function to calculate optimal badge investment based on budget
const getBadgeRecommendation = (budget: number) => {
  const maxBadgesAffordable = Math.floor(budget / BADGE_SYSTEM.cost);
  
  if (maxBadgesAffordable === 0) {
    return {
      badges: 0,
      cost: 0,
      bonus: 0,
      tier: 'No badges (0%)',
      remainingBudget: budget,
      recommendation: 'Focus on parcels first - badges cost 200 AB each'
    };
  }

  // Find optimal badge tier for this budget
  let recommendedBadges = 0;
  let tier = BADGE_SYSTEM.tiers[0];
  
  for (const badgeTier of BADGE_SYSTEM.tiers) {
    if (badgeTier.minBadges <= maxBadgesAffordable) {
      recommendedBadges = Math.min(badgeTier.maxBadges, maxBadgesAffordable);
      tier = badgeTier;
    }
  }

  const badgeCost = recommendedBadges * BADGE_SYSTEM.cost;
  const remainingBudget = budget - badgeCost;

  return {
    badges: recommendedBadges,
    cost: badgeCost,
    bonus: tier.bonus,
    tier: tier.description,
    remainingBudget,
    recommendation: recommendedBadges > 0 
      ? `Get ${recommendedBadges} badges for ${tier.bonus * 100}% rent bonus (${badgeCost} AB)`
      : 'Focus on parcels first'
  };
};

interface Strategy {
  name: string;
  investment: number;
  dailyReturn: number;
  breakEven: number;
  efficiency: number;
  description: string;
}

export default function StrategyPage() {
  const { data: session } = useSession();
  const [budget, setBudget] = useState<number>(1000);
  const [budgetInput, setBudgetInput] = useState<string>('1000');
  const [timeHorizon, setTimeHorizon] = useState<number>(365);
  const [boostHoursPerDay, setBoostHoursPerDay] = useState<number>(4);
  const [selectedAdBoost, setSelectedAdBoost] = useState<number>(20);
  const [currentBadgeTier, setCurrentBadgeTier] = useState<number>(0); // Index of tier in BADGE_SYSTEM.tiers
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [selectedStrategies, setSelectedStrategies] = useState<number[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load user profile data when authenticated
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
        // Auto-populate with user's data
        setBudget(profile.currentAB || 1000);
        setBudgetInput((profile.currentAB || 1000).toString());
        setCurrentBadgeTier(profile.currentBadgeTier || 0);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount < 0.01) {
      return `$${(amount * 1000).toFixed(2)}‰`;
    }
    return `$${amount.toFixed(4)}`;
  };

  // Get current badge bonus based on tier index
  const getCurrentBadgeBonus = (): number => {
    return BADGE_SYSTEM.tiers[currentBadgeTier]?.bonus || 0;
  };

  // Get current badge count (use midpoint of tier range for calculations)
  const getCurrentBadgeCount = (): number => {
    const tier = BADGE_SYSTEM.tiers[currentBadgeTier];
    if (!tier) return 0;
    if (tier.minBadges === 0 && tier.maxBadges === 0) return 0;
    if (tier.maxBadges === 999) return 101; // For 101+ tier, use 101 as baseline
    // Use midpoint of tier range
    return Math.floor((tier.minBadges + tier.maxBadges) / 2);
  };

  const generateStrategies = (): Strategy[] => {
    const newStrategies: Strategy[] = [];

    // Helper function to calculate daily earnings with badge bonus and ad boost
    const calculateDailyEarnings = (baseRent: number, badgeBonus: number, adBoostMultiplier: number, adHours: number) => {
      const baseDailyRent = baseRent * 86400;
      const rentWithBadgeBonus = baseDailyRent * (1 + badgeBonus);
      
      const boostedHours = Math.min(adHours, 24);
      const unboostedHours = 24 - boostedHours;
      
      const boostedEarnings = (rentWithBadgeBonus / 24) * boostedHours * adBoostMultiplier;
      const unboostedEarnings = (rentWithBadgeBonus / 24) * unboostedHours;
      
      return boostedEarnings + unboostedEarnings;
    };

    // Get current badge info
    const currentBadgeBonus = getCurrentBadgeBonus();
    const currentBadgeCount = getCurrentBadgeCount();

    // Strategy 1: All Common Parcels with Current Badges
    const commonCount = Math.floor(budget / PARCEL_DATA.common.cost);
    if (commonCount > 0) {
      const baseRent = PARCEL_DATA.common.rent * commonCount;
      const dailyReturn = calculateDailyEarnings(baseRent, currentBadgeBonus, selectedAdBoost, boostHoursPerDay);
      const investment = commonCount * PARCEL_DATA.common.cost;
      
      newStrategies.push({
        name: `${commonCount}x Common Parcels${currentBadgeCount > 0 ? ` (${BADGE_SYSTEM.tiers[currentBadgeTier].description})` : ''}`,
        investment,
        dailyReturn,
        breakEven: investment / dailyReturn,
        efficiency: dailyReturn / investment,
        description: `Maximum parcels strategy - ${commonCount} Commons${currentBadgeCount > 0 ? ` with existing ${BADGE_SYSTEM.tiers[currentBadgeTier].description} (${(currentBadgeBonus * 100).toFixed(0)}% bonus)` : ''} + ${boostHoursPerDay}h of ${selectedAdBoost}x ad boosts daily`
      });
    }

    // Strategy 2: Additional Badge Investment + Common Parcels 
    if (budget >= BADGE_SYSTEM.cost && currentBadgeTier < BADGE_SYSTEM.tiers.length - 1) {
      // Calculate badge investment strategy considering current tier
      const nextTierIndex = Math.min(currentBadgeTier + 1, BADGE_SYSTEM.tiers.length - 1);
      const nextTier = BADGE_SYSTEM.tiers[nextTierIndex];
      const targetBadgeCount = nextTier.maxBadges === 999 ? 101 : nextTier.maxBadges;
      const additionalBadgesNeeded = Math.max(0, targetBadgeCount - currentBadgeCount);
      
      if (additionalBadgesNeeded > 0) {
        const badgeCost = additionalBadgesNeeded * BADGE_SYSTEM.cost;
        const remainingForParcels = budget - badgeCost;
        
        if (remainingForParcels >= PARCEL_DATA.common.cost) {
          const commonCountWithMoreBadges = Math.floor(remainingForParcels / PARCEL_DATA.common.cost);
          const newBadgeBonus = nextTier.bonus;
          const baseRent = PARCEL_DATA.common.rent * commonCountWithMoreBadges;
          const dailyReturn = calculateDailyEarnings(baseRent, newBadgeBonus, selectedAdBoost, boostHoursPerDay);
          const totalInvestment = badgeCost + (commonCountWithMoreBadges * PARCEL_DATA.common.cost);
          
          newStrategies.push({
            name: `Upgrade to ${nextTier.description} + ${commonCountWithMoreBadges}x Common`,
            investment: totalInvestment,
            dailyReturn,
            breakEven: totalInvestment / dailyReturn,
            efficiency: dailyReturn / totalInvestment,
            description: `Buy ${additionalBadgesNeeded} additional badges to reach ${nextTier.description} + ${commonCountWithMoreBadges} Commons`
          });
        }
      }
    }

    return newStrategies.sort((a, b) => b.efficiency - a.efficiency);
  };

  const handleCalculate = () => {
    const results = generateStrategies();
    setStrategies(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">🌎</span>
              </div>
              <div className="transition-all duration-300 group-hover:translate-x-1">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Atlas Earth Hub</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Strategy Planner</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Home</Link>
                <Link href="/calculator" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Calculator</Link>
                <Link href="/strategy" className="text-blue-600 dark:text-blue-400 font-semibold">Strategy</Link>
                <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 hover:scale-105">Portfolio</Link>
              </nav>
              <UserAuth />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Strategy Planner
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Plan optimal investment strategies with badge optimization, parcel calculations, and ad boost earnings analysis.
          </p>
          
          {/* Boost System Explanation */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">📱 How Atlas Earth Boosts Work</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
              <div>
                <p><strong>🎯 Ad Boosts:</strong> Temporary multipliers from watching ads (20x, 30x, 50x)</p>
                <p><strong>⏰ Duration:</strong> Usually 4-8 hours per ad session</p>
              </div>
              <div>
                <p><strong>🏆 Badge Bonus:</strong> Permanent percentage increase (5%-25%)</p>
                <p><strong>🔄 Stacking:</strong> Badge bonus applies to ALL earnings, including boosted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Parameters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Investment Parameters</h3>
            {session && userProfile && (
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Using your saved data</span>
              </div>
            )}
            {session && !userProfile && (
              <div className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Update your <Link href="/profile" className="underline">profile</Link> for personalized data</span>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Budget (Atlas Bucks)
              </label>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setBudgetInput(value);
                  
                  if (value === '') {
                    return;
                  } else {
                    const numValue = parseInt(value) || 0;
                    setBudget(numValue);
                  }
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value) || 100;
                  const finalValue = Math.max(100, value);
                  setBudget(finalValue);
                  setBudgetInput(finalValue.toString());
                }}
                min="100"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Badge Tier
              </label>
              <select
                value={currentBadgeTier}
                onChange={(e) => setCurrentBadgeTier(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {BADGE_SYSTEM.tiers.map((tier, index) => (
                  <option key={index} value={index}>
                    {tier.description}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current bonus: {(getCurrentBadgeBonus() * 100).toFixed(0)}%
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Horizon
              </label>
              <select
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={30}>30 Days (Short-term)</option>
                <option value={90}>90 Days (Medium-term)</option>
                <option value={180}>180 Days (Long-term)</option>
                <option value={365}>1 Year (Extended)</option>
                <option value={730}>2 Years (Maximum)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ad Boost Multiplier
              </label>
              <select
                value={selectedAdBoost}
                onChange={(e) => setSelectedAdBoost(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {AD_BOOST_OPTIONS.map((boost) => (
                  <option key={boost.multiplier} value={boost.multiplier}>
                    {boost.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily Boost Hours
              </label>
              <select
                value={boostHoursPerDay}
                onChange={(e) => setBoostHoursPerDay(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={0}>0 hours (No ads)</option>
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={4}>4 hours</option>
                <option value={6}>6 hours</option>
                <option value={8}>8 hours</option>
                <option value={12}>12 hours</option>
                <option value={16}>16 hours</option>
                <option value={20}>20 hours</option>
                <option value={24}>24 hours (Max)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleCalculate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              🔍 Generate Strategies
            </button>
          </div>
        </div>

        {/* Strategy Results */}
        {strategies.length > 0 && (
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recommended Strategies (Ranked by Efficiency)
              </h3>
              
              {selectedStrategies.length >= 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  🔍 Compare ({selectedStrategies.length})
                </button>
              )}
            </div>
            
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:scale-105 ${
                  index === 0 
                    ? 'border-green-500 dark:border-green-400 bg-green-50/50 dark:bg-green-900/20' 
                    : 'border-white/20 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {index === 0 && <span className="text-2xl">🏆</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {strategy.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {strategy.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {index === 0 && (
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                        Best Choice
                      </span>
                    )}
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStrategies.includes(index)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (selectedStrategies.length < 3) {
                              setSelectedStrategies([...selectedStrategies, index]);
                            }
                          } else {
                            setSelectedStrategies(selectedStrategies.filter(i => i !== index));
                          }
                        }}
                        disabled={selectedStrategies.length >= 3 && !selectedStrategies.includes(index)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Compare</span>
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Investment</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {strategy.investment.toLocaleString()} AB
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily Return</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(strategy.dailyReturn)}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Break Even</p>
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {strategy.breakEven.toFixed(1)} days
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {(strategy.efficiency * 1000000).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Strategy Comparison Modal */}
        {showComparison && selectedStrategies.length >= 2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🔍 Strategy Comparison
                  </h3>
                  <button
                    onClick={() => setShowComparison(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold text-gray-900 dark:text-white">
                          Metric
                        </th>
                        {selectedStrategies.map((strategyIndex) => (
                          <th key={strategyIndex} className="border border-gray-300 dark:border-gray-600 p-3 text-center font-semibold text-gray-900 dark:text-white">
                            {strategies[strategyIndex].name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium text-gray-900 dark:text-white">
                          💰 Investment Required
                        </td>
                        {selectedStrategies.map((strategyIndex) => (
                          <td key={strategyIndex} className="border border-gray-300 dark:border-gray-600 p-3 text-center text-blue-600 dark:text-blue-400 font-semibold">
                            {strategies[strategyIndex].investment.toLocaleString()} AB
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium text-gray-900 dark:text-white">
                          📈 Daily Earnings
                        </td>
                        {selectedStrategies.map((strategyIndex) => (
                          <td key={strategyIndex} className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400 font-semibold">
                            {formatCurrency(strategies[strategyIndex].dailyReturn)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium text-gray-900 dark:text-white">
                          ⏰ Break Even Period
                        </td>
                        {selectedStrategies.map((strategyIndex) => (
                          <td key={strategyIndex} className="border border-gray-300 dark:border-gray-600 p-3 text-center text-yellow-600 dark:text-yellow-400 font-semibold">
                            {strategies[strategyIndex].breakEven.toFixed(1)} days
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowComparison(false)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                  >
                    Close Comparison
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}