import Link from 'next/link'
import { ArrowRight, Play, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6366f1] to-[#3b82f6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <Badge variant="secondary" className="gap-1.5 px-4 py-1.5 text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              Trusted by 10,000+ teams worldwide
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Build faster with{' '}
            <span className="gradient-text">SaaSApp</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            The all-in-one platform that helps modern teams ship products faster. Manage users,
            subscriptions, analytics, and more — all in one beautiful dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="gradient" size="xl" asChild className="gap-2">
              <Link href="/sign-up">
                Get started free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="gap-2">
              <Play className="h-4 w-4 fill-current" />
              Watch demo
            </Button>
          </div>

          {/* Social proof */}
          <p className="mt-6 text-sm text-gray-500">
            No credit card required · Free plan available · Cancel anytime
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-2 shadow-2xl ring-1 ring-white/10">
            {/* Browser Chrome */}
            <div className="mb-2 flex items-center gap-2 px-3 py-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-gray-700 px-3 text-xs text-gray-400">
                app.saasapp.com/dashboard
              </div>
            </div>

            {/* Mock Dashboard */}
            <div className="rounded-xl bg-gray-50 p-6">
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Total Revenue', value: '$48,295', change: '+12.5%', color: 'blue' },
                  { label: 'Active Users', value: '2,847', change: '+8.2%', color: 'indigo' },
                  { label: 'Subscriptions', value: '1,234', change: '+15.1%', color: 'purple' },
                  { label: 'Growth Rate', value: '24.3%', change: '+4.6%', color: 'green' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="text-xs text-gray-500">{stat.label}</div>
                    <div className="mt-1 text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="mt-1 text-xs font-medium text-green-600">{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-700">Revenue Overview</div>
                  <div className="h-4 w-24 rounded bg-gray-100" />
                </div>
                <div className="flex h-32 items-end gap-2">
                  {[40, 65, 50, 80, 70, 90, 75, 95, 85, 100, 88, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-500 to-indigo-400 opacity-80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
