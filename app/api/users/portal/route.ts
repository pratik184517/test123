import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createBillingPortalSession } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { message: 'No billing account found. Please subscribe to a plan first.' },
        { status: 400 }
      )
    }

    const portalSession = await createBillingPortalSession(
      subscription.stripeCustomerId,
      absoluteUrl('/billing')
    )

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}
