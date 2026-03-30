import { auth } from '@/lib/auth'
import { Header } from '@/components/dashboard/header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users,
  DollarSign,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

const recentActivity = [
  { user: 'Alice Johnson', action: 'Upgraded to Pro', time: '2 minutes ago', type: 'upgrade' },
  { user: 'Bob Smith', action: 'Created new project', time: '15 minutes ago', type: 'create' },
  { user: 'Carol Williams', action: 'Signed up', time: '1 hour ago', type: 'signup' },
  { user: 'David Brown', action: 'Canceled subscription', time: '2 hours ago', type: 'cancel' },
  { user: 'Eva Martinez', action: 'Upgraded to Enterprise', time: '3 hours ago', type: 'upgrade' },
  { user: 'Frank Lee', action: 'Invited team members', time: '5 hours ago', type: 'invite' },
]

const activityTypeConfig = {
  upgrade: { color: 'text-green-600', bg: 'bg-green-50', badge: 'success' as const },
  create: { color: 'text-blue-600', bg: 'bg-blue-50', badge: 'default' as const },
  signup: { color: 'text-purple-600', bg: 'bg-purple-50', badge: 'secondary' as const },
  cancel: { color: 'text-red-600', bg: 'bg-red-50', badge: 'destructive' as const },
  invite: { color: 'text-indigo-600', bg: 'bg-indigo-50', badge: 'default' as const },
}

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user?.name?.split(' ')[0] ?? 'there'} 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="$48,295"
            change="+12.5% from last month"
            trend="up"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatsCard
            title="Active Users"
            value="2,847"
            change="+8.2% from last month"
            trend="up"
            icon={<Users className="h-5 w-5" />}
          />
          <StatsCard
            title="Subscriptions"
            value="1,234"
            change="+15.1% from last month"
            trend="up"
            icon={<CreditCard className="h-5 w-5" />}
          />
          <StatsCard
            title="Growth Rate"
            value="24.3%"
            change="+4.6% from last month"
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue for the last 12 months</CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +12.5%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-end gap-1.5 pt-4">
                {[
                  { month: 'Jan', value: 65 },
                  { month: 'Feb', value: 55 },
                  { month: 'Mar', value: 70 },
                  { month: 'Apr', value: 60 },
                  { month: 'May', value: 78 },
                  { month: 'Jun', value: 72 },
                  { month: 'Jul', value: 85 },
                  { month: 'Aug', value: 80 },
                  { month: 'Sep', value: 90 },
                  { month: 'Oct', value: 88 },
                  { month: 'Nov', value: 95 },
                  { month: 'Dec', value: 100 },
                ].map((item) => (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-400 transition-all hover:from-blue-700 hover:to-indigo-500"
                      style={{ height: `${item.value}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions from your users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const config = activityTypeConfig[activity.type as keyof typeof activityTypeConfig]
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback
                          className={`${config.bg} ${config.color} text-xs font-semibold`}
                        >
                          {getInitials(activity.user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.user}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Free Users', value: '1,613', percent: '56.7%', color: 'bg-gray-200' },
            { label: 'Pro Users', value: '987', percent: '34.7%', color: 'bg-blue-500' },
            { label: 'Enterprise', value: '247', percent: '8.6%', color: 'bg-indigo-600' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{stat.percent}</span>
                </div>
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full ${stat.color}`}
                    style={{ width: stat.percent }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
