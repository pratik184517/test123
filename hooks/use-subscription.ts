'use client'

import { useQuery } from '@tanstack/react-query'
import { useUser } from './use-user'

interface Subscription {
  id: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING'
  stripeCurrentPeriodEnd?: string | null
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
}

async function fetchSubscription(): Promise<Subscription | null> {
  const res = await fetch('/api/users/subscription')
  if (!res.ok) return null
  return res.json()
}

export function useSubscription() {
  const { isAuthenticated } = useUser()

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: fetchSubscription,
    enabled: isAuthenticated,
  })

  const isPro = subscription?.plan === 'PRO' || subscription?.plan === 'ENTERPRISE'
  const isEnterprise = subscription?.plan === 'ENTERPRISE'
  const isFree = !subscription || subscription.plan === 'FREE'

  return {
    subscription,
    isLoading,
    isPro,
    isEnterprise,
    isFree,
  }
}
