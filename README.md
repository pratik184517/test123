# SaaSApp — Modern Full-Stack SaaS Starter

A production-ready SaaS boilerplate built with Next.js 14, TypeScript, Tailwind CSS, Prisma, NextAuth.js v5, and Stripe.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js v5 (Email/Password + Google OAuth)
- **Payments**: Stripe (subscriptions, webhooks, billing portal)
- **State**: Zustand (client) + TanStack Query (server)
- **Email**: Resend
- **Deployment**: Docker + docker-compose

## Features

- 🔐 Authentication (email/password + Google OAuth)
- 💳 Stripe subscription billing (Free / Pro / Enterprise)
- 📊 Dashboard with stats, charts, and activity feed
- ⚙️ Profile & billing settings pages
- 🎨 Beautiful landing page (hero, features, pricing, footer)
- 🛡️ Route protection via Next.js middleware
- 🐳 Docker multi-stage build + docker-compose

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd saasapp
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in your credentials in .env
```

### 3. Set up the database

```bash
# With Docker:
docker compose up db -d

# Push schema
npm run db:push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth credentials |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | Stripe price ID for Pro plan |
| `STRIPE_ENTERPRISE_PRICE_ID` | Stripe price ID for Enterprise plan |
| `RESEND_API_KEY` | Resend API key for transactional email |

## Docker Deployment

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f app
```

## Project Structure

```
app/
├── (auth)/          # Sign-in, sign-up pages
├── (dashboard)/     # Protected dashboard pages
├── api/             # API routes
└── page.tsx         # Landing page
components/
├── ui/              # shadcn/ui components
├── landing/         # Landing page sections
└── dashboard/       # Dashboard components
lib/                 # Auth, DB, Stripe, utils
prisma/              # Database schema
```
