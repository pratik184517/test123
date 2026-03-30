import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for individuals and small projects getting started.',
    features: [
      'Up to 3 projects',
      '1,000 API requests/month',
      'Basic analytics',
      'Email support',
      '1 team member',
      '5 GB storage',
    ],
    cta: 'Get started free',
    href: '/sign-up',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For growing teams that need more power and collaboration features.',
    features: [
      'Unlimited projects',
      '100,000 API requests/month',
      'Advanced analytics & reports',
      'Priority email & chat support',
      'Up to 10 team members',
      '50 GB storage',
      'Custom domains',
      'API access',
    ],
    cta: 'Start Pro trial',
    href: '/sign-up?plan=pro',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large organizations with advanced security and compliance needs.',
    features: [
      'Unlimited everything',
      'Unlimited API requests',
      'Custom analytics & dashboards',
      'Dedicated account manager',
      'Unlimited team members',
      '500 GB storage',
      'Custom integrations',
      'SSO & SAML',
      'SLA guarantee',
      'On-premise option',
    ],
    cta: 'Contact sales',
    href: '/sign-up?plan=enterprise',
    highlighted: false,
    badge: null,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Pricing</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start for free. Upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl p-8 ring-1',
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-blue-500 shadow-2xl scale-105'
                  : 'bg-white text-gray-900 ring-gray-200 shadow-sm'
              )}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 px-4 py-1 font-semibold">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div>
                <h3
                  className={cn(
                    'text-lg font-semibold',
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={cn(
                      'text-5xl font-extrabold',
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      plan.highlighted ? 'text-blue-100' : 'text-gray-500'
                    )}
                  >
                    /month
                  </span>
                </div>
                <p
                  className={cn(
                    'mt-3 text-sm',
                    plan.highlighted ? 'text-blue-100' : 'text-gray-500'
                  )}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                        plan.highlighted ? 'bg-white/20' : 'bg-blue-50'
                      )}
                    >
                      <Check
                        className={cn(
                          'h-3 w-3',
                          plan.highlighted ? 'text-white' : 'text-blue-600'
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        'text-sm',
                        plan.highlighted ? 'text-blue-50' : 'text-gray-700'
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  className={cn(
                    'w-full',
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  )}
                  size="lg"
                >
                  <Link href={plan.href}>
                    {plan.highlighted && <Zap className="mr-2 h-4 w-4" />}
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  )
}
