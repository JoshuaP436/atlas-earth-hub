import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!userProfile) {
      // Create default profile if it doesn't exist
      const newProfile = await prisma.userProfile.create({
        data: {
          userId: session.user.id,
          currentAB: 0,
          totalLands: 0,
          currentBadgeTier: 0,
          mayor: false,
        }
      })
      return NextResponse.json(newProfile)
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentAB, totalLands, currentBadgeTier, mayor } = await request.json()

    const userProfile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        currentAB,
        totalLands,
        currentBadgeTier,
        mayor,
      },
      create: {
        userId: session.user.id,
        currentAB,
        totalLands,
        currentBadgeTier,
        mayor,
      }
    })

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}