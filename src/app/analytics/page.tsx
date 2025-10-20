'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { 
  TrendingUp, DollarSign, Target, Calendar, 
  BarChart3, PieChart as PieChartIcon, Activity,
  MapPin, Clock, Zap, Trophy
} from 'lucide-react'

// Atlas Earth verified data
const LAND_TYPES = {
  common: { rate: 0.0000000011, cost: 100, name: 'Common', color: '#8b5cf6' },
  rare: { rate: 0.0000000016, cost: 500, name: 'Rare', color: '#06b6d4' },
  epic: { rate: 0.0000000022, cost: 1250, name: 'Epic', color: '#10b981' },
  legendary: { rate: 0.0000000044, cost: 2500, name: 'Legendary', color: '#f59e0b' }
}

// Analytics data type
interface AnalyticsDay {
  date: string
  fullDate: string
  commonEarnings: number
  rareEarnings: number
  epicEarnings: number
  legendaryEarnings: number
  totalEarnings: number
  landsPurchased: number
  boostsUsed: number
}

// Mock analytics data - in a real app, this would come from user's actual gameplay
const generateMockData = (): AnalyticsDay[] => {
  const days = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      commonEarnings: Math.random() * 0.5 + 0.3,
      rareEarnings: Math.random() * 1.2 + 0.8,
      epicEarnings: Math.random() * 2.1 + 1.4,
      legendaryEarnings: Math.random() * 4.2 + 2.8,
      totalEarnings: 0,
      landsPurchased: Math.floor(Math.random() * 3),
      boostsUsed: Math.random() > 0.8 ? 1 : 0
    })
  }
  
  // Calculate total earnings
  days.forEach(day => {
    day.totalEarnings = day.commonEarnings + day.rareEarnings + day.epicEarnings + day.legendaryEarnings
  })
  
  return days
}

const portfolioData = [
  { name: 'Common', value: 45, count: 23, earnings: 1.2 },
  { name: 'Rare', value: 30, count: 12, earnings: 2.8 },
  { name: 'Epic', value: 20, count: 8, earnings: 4.1 },
  { name: 'Legendary', value: 5, count: 2, earnings: 8.6 }
]

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDay[]>([])
  const [selectedMetric, setSelectedMetric] = useState('earnings')
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    setAnalyticsData(generateMockData())
  }, [])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sign in to view your Atlas Earth performance analytics
          </p>
          <Link
            href="/auth/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    )
  }

  const totalEarnings = analyticsData.reduce((sum, day) => sum + day.totalEarnings, 0)
  const avgDailyEarnings = totalEarnings / analyticsData.length || 0
  const totalLands = portfolioData.reduce((sum, item) => sum + item.count, 0)
  const projectedMonthly = avgDailyEarnings * 30

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your Atlas Earth performance and optimize your strategy
              </p>
            </div>
            
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Earnings (30d)
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${totalEarnings.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Daily Average
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${avgDailyEarnings.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Lands
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {totalLands}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Monthly Projection
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${projectedMonthly.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Earnings Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Daily Earnings Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="totalEarnings" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Total Earnings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Portfolio Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Portfolio Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Land Type Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Land Type Performance
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
              />
              <Legend />
              <Bar dataKey="commonEarnings" stackId="a" fill={LAND_TYPES.common.color} name="Common" />
              <Bar dataKey="rareEarnings" stackId="a" fill={LAND_TYPES.rare.color} name="Rare" />
              <Bar dataKey="epicEarnings" stackId="a" fill={LAND_TYPES.epic.color} name="Epic" />
              <Bar dataKey="legendaryEarnings" stackId="a" fill={LAND_TYPES.legendary.color} name="Legendary" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(LAND_TYPES).map(([type, data]) => {
            const typeData = portfolioData.find(p => p.name === data.name)
            return (
              <div key={type} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data.name} Lands
                  </h4>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: data.color }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Count:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {typeData?.count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Daily Earnings:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${typeData?.earnings?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">ROI per Land:</span>
                    <span className="text-sm font-medium text-green-600">
                      {typeData ? ((typeData.earnings / typeData.count / data.cost * 100) * 365).toFixed(1) : 0}%/year
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}