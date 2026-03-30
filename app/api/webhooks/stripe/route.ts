import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ message: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ message: 'Webhook signature verification failed' }, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string
        const userId = session.metadata?.userId

        if (!userId) break

        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = stripeSubscription.items.data[0].price.id

        const plan = getPlanFromPriceId(priceId)

        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            plan,
            status: 'ACTIVE',
          },
          update: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            plan,
            status: 'ACTIVE',
          },
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = stripeSubscription.items.data[0].price.id
        const customerId = stripeSubscription.customer as string

        const subscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (subscription) {
          await db.subscription.update({
            where: { id: subscription.id },
            data: {
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
              plan: getPlanFromPriceId(priceId),
              status: 'ACTIVE',
            },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const customerId = stripeSubscription.customer as string
        const priceId = stripeSubscription.items.data[0].price.id

        const subscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (subscription) {
          await db.subscription.update({
            where: { id: subscription.id },
            data: {
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
              plan: getPlanFromPriceId(priceId),
              status: mapStripeStatus(stripeSubscription.status),
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const customerId = stripeSubscription.customer as string

        const subscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (subscription) {
          await db.subscription.update({
            where: { id: subscription.id },
            data: {
              plan: 'FREE',
              status: 'CANCELED',
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const subscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (subscription) {
          await db.subscription.update({
            where: { id: subscription.id },
            data: { status: 'PAST_DUE' },
          })
        }
        break
      }

      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ message: 'Webhook processing error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

function getPlanFromPriceId(priceId: string): 'FREE' | 'PRO' | 'ENTERPRISE' {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'PRO'
  if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) return 'ENTERPRISE'
  return 'FREE'
}

function mapStripeStatus(status: string): 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' {
  switch (status) {
    case 'active': return 'ACTIVE'
    case 'canceled': return 'CANCELED'
    case 'past_due': return 'PAST_DUE'
    case 'trialing': return 'TRIALING'
    default: return 'ACTIVE'
  }
}
