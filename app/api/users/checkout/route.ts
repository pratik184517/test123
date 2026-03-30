import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createCheckoutSession, createStripeCustomer } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json({ message: 'Price ID is required' }, { status: 400 })
    }

    // Get or create Stripe customer
    let subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    let customerId = subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await createStripeCustomer(
        session.user.email,
        session.user.name ?? undefined
      )
      customerId = customer.id

      await db.subscription.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          stripeCustomerId: customerId,
          plan: 'FREE',
          status: 'ACTIVE',
        },
        update: { stripeCustomerId: customerId },
      })
    }

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      priceId,
      customerId,
      successUrl: absoluteUrl('/billing?success=true'),
      cancelUrl: absoluteUrl('/billing?canceled=true'),
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}
