'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserProfile {
  id: string
  currentAB: number
  totalLands: number
  currentBadgeTier: number
  mayor: boolean
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [currentAB, setCurrentAB] = useState(0)
  const [totalLands, setTotalLands] = useState(0)
  const [currentBadgeTier, setCurrentBadgeTier] = useState(0)
  const [mayor, setMayor] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.id) {
      fetchProfile()
    }
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/user/profile`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setCurrentAB(data.currentAB)
        setTotalLands(data.totalLands)
        setCurrentBadgeTier(data.currentBadgeTier)
        setMayor(data.mayor)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentAB,
          totalLands,
          currentBadgeTier,
          mayor,
        }),
      })

      if (response.ok) {
        await fetchProfile()
      } else {
        setError('Failed to save profile')
      }
    } catch (error) {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const BADGE_TIERS = [
    { value: 0, label: 'No badges (0%)', minBadges: 0, maxBadges: 0 },
    { value: 1, label: '1-10 badges (+5%)', minBadges: 1, maxBadges: 10 },
    { value: 2, label: '11-30 badges (+10%)', minBadges: 11, maxBadges: 30 },
    { value: 3, label: '31-60 badges (+15%)', minBadges: 31, maxBadges: 60 },
    { value: 4, label: '61-100 badges (+20%)', minBadges: 61, maxBadges: 100 },
    { value: 5, label: '101+ badges (+25%)', minBadges: 101, maxBadges: 999 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              ← Back to Atlas Earth Hub
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Atlas Earth Profile
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    value={session.user?.name || ''}
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    value={session.user?.email || ''}
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Atlas Earth Data */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Atlas Earth Data</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Atlas Bucks</label>
                  <input
                    type="number"
                    value={currentAB}
                    onChange={(e) => setCurrentAB(parseInt(e.target.value) || 0)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your current AB balance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Land Parcels</label>
                  <input
                    type="number"
                    value={totalLands}
                    onChange={(e) => setTotalLands(parseInt(e.target.value) || 0)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Total number of land parcels owned"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Badge Tier</label>
                  <select
                    value={currentBadgeTier}
                    onChange={(e) => setCurrentBadgeTier(parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    {BADGE_TIERS.map((tier) => (
                      <option key={tier.value} value={tier.value}>
                        {tier.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={mayor}
                      onChange={(e) => setMayor(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      I am a Mayor
                    </span>
                  </label>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Mayors earn 20 AB per badge sold in their jurisdiction
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}