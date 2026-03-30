import {
  Zap,
  Shield,
  BarChart3,
  Users,
  CreditCard,
  Globe,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built on Next.js 14 with optimized performance. Your app loads instantly and runs smoothly even under heavy load.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'SOC 2 compliant with end-to-end encryption, SSO support, and audit logs. Your data is always protected.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description:
      'Real-time dashboards with detailed metrics. Understand your users and grow your business with data-driven decisions.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Invite your team, set roles and permissions. Work together seamlessly with built-in collaboration tools.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: CreditCard,
    title: 'Stripe Payments',
    description:
      'Accept payments globally with Stripe. Manage subscriptions, invoices, and billing all in one place.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description:
      'Deploy to edge locations worldwide. With CDN support and auto-scaling, you can handle millions of users.',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
  },
]

export function Features() {
  return (
    <section id="features" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Features</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build and scale
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A complete toolkit for modern SaaS development. Stop piecing together tools and focus
            on building your product.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
                >
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
