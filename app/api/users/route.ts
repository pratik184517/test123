import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { signUpSchema, updateProfileSchema } from '@/lib/validations'

// POST /api/users - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signUpSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, password } = validatedData.data

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
      },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    return NextResponse.json({ user, message: 'Account created successfully.' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}

// PATCH /api/users - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, image } = validatedData.data

    // Check if email is taken by another user
    if (email) {
      const existingUser = await db.user.findFirst({
        where: { email, NOT: { id: session.user.id } },
      })
      if (existingUser) {
        return NextResponse.json(
          { message: 'This email is already in use.' },
          { status: 409 }
        )
      }
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(image !== undefined && { image: image || null }),
      },
      select: { id: true, name: true, email: true, image: true },
    })

    return NextResponse.json({ user, message: 'Profile updated successfully.' })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}

// GET /api/users - Get current user (with subscription)
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { password: _, ...safeUser } = user
    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}
