export type UserRole = 'USER' | 'ADMIN'

export type SubscriptionPlan = 'FREE' | 'PRO' | 'ENTERPRISE'

export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING'

export interface User {
  id: string
  name?: string | null
  email: string
  emailVerified?: Date | null
  image?: string | null
  password?: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
  subscription?: Subscription | null
}

export interface Subscription {
  id: string
  userId: string
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  stripePriceId?: string | null
  stripeCurrentPeriodEnd?: Date | null
  plan: SubscriptionPlan
  status: SubscriptionStatus
  createdAt: Date
  updatedAt: Date
}

export interface PricingTier {
  name: string
  price: number
  description: string
  features: string[]
  highlighted: boolean
  plan: SubscriptionPlan
  priceId?: string
}

export interface StatsCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: string
}

export interface NavItem {
  title: string
  href: string
  icon: string
  badge?: string
}
