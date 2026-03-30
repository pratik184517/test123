'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, Check, CreditCard, ExternalLink, Zap } from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useSubscription } from '@/hooks/use-subscription'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free',
    price: 0,
    plan: 'FREE' as const,
    description: 'Perfect for individuals',
    features: ['Up to 3 projects', '1,000 API requests/month', 'Basic analytics', 'Email support'],
    priceId: null,
  },
  {
    name: 'Pro',
    price: 29,
    plan: 'PRO' as const,
    description: 'For growing teams',
    features: [
      'Unlimited projects',
      '100,000 API requests/month',
      'Advanced analytics',
      'Priority support',
      'API access',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    plan: 'ENTERPRISE' as const,
    description: 'For large organizations',
    features: [
      'Unlimited everything',
      'Custom analytics',
      'Dedicated support',
      'SSO & SAML',
      'SLA guarantee',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  },
]

const mockInvoices = [
  { id: 'INV-001', date: 'Dec 1, 2024', amount: '$29.00', status: 'Paid' },
  { id: 'INV-002', date: 'Nov 1, 2024', amount: '$29.00', status: 'Paid' },
  { id: 'INV-003', date: 'Oct 1, 2024', amount: '$29.00', status: 'Paid' },
]

export default function BillingPage() {
  const { data: session } = useSession()
  const { subscription, isLoading } = useSubscription()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [isPortalLoading, setIsPortalLoading] = useState(false)

  const handleUpgrade = async (priceId: string | null | undefined, planName: string) => {
    if (!priceId) {
      toast({
        title: 'Contact sales',
        description: 'Please contact our sales team for Enterprise pricing.',
      })
      return
    }

    setLoadingPlan(planName)
    try {
      const res = await fetch('/api/users/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message ?? 'Failed to create checkout session')
      }

      window.location.href = data.url
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        variant: 'destructive',
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleManageBilling = async () => {
    setIsPortalLoading(true)
    try {
      const res = await fetch('/api/users/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      window.location.href = data.url
    } catch {
      toast({
        title: 'Error',
        description: 'Could not open billing portal. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsPortalLoading(false)
    }
  }

  const currentPlan = subscription?.plan ?? 'FREE'

  return (
    <div>
      <Header title="Billing" />
      <div className="p-6 max-w-5xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing & Plans</h2>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and billing information.
          </p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>You are on the {currentPlan} plan</CardDescription>
              </div>
              {subscription?.stripeCustomerId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleManageBilling}
                  disabled={isPortalLoading}
                >
                  {isPortalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Manage Billing
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{currentPlan} Plan</span>
                  <Badge variant={currentPlan === 'FREE' ? 'secondary' : 'default'}>
                    {subscription?.status ?? 'ACTIVE'}
                  </Badge>
                </div>
                {subscription?.stripeCurrentPeriodEnd && (
                  <p className="text-sm text-muted-foreground">
                    Renews on{' '}
                    {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = plan.plan === currentPlan
              const isHigher =
                (plan.plan === 'PRO' && currentPlan === 'FREE') ||
                (plan.plan === 'ENTERPRISE' && currentPlan !== 'ENTERPRISE')

              return (
                <Card
                  key={plan.name}
                  className={cn(
                    'relative transition-all',
                    plan.highlighted && 'border-blue-500 shadow-md',
                    isCurrent && 'ring-2 ring-blue-500'
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground text-sm">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={cn(
                        'w-full',
                        isCurrent && 'opacity-50 cursor-not-allowed'
                      )}
                      variant={plan.highlighted && !isCurrent ? 'gradient' : 'outline'}
                      disabled={isCurrent || !!loadingPlan}
                      onClick={() => !isCurrent && handleUpgrade(plan.priceId, plan.name)}
                    >
                      {loadingPlan === plan.name ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {isCurrent ? 'Current Plan' : isHigher ? 'Upgrade' : 'Downgrade'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Download your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {mockInvoices.length > 0 ? (
              <div className="space-y-0">
                {mockInvoices.map((invoice, i) => (
                  <div key={invoice.id}>
                    {i > 0 && <Separator />}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{invoice.id}</p>
                          <p className="text-xs text-muted-foreground">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{invoice.amount}</span>
                        <Badge variant="success" className="text-xs">
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No invoices yet. They will appear here once you subscribe to a paid plan.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
