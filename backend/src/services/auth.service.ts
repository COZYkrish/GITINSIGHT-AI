import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { User, IUser } from '../models/User'

export interface TokenPayload {
  userId: string
  email: string
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload
}

export async function registerUser(name: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
  const existing = await User.findOne({ email })
  if (existing) throw new Error('Email already registered')

  const user = new User({ name, email, passwordHash: password })
  await user.save()

  const token = generateToken({ userId: user._id.toString(), email: user.email })
  return { user, token }
}

export async function loginUser(email: string, password: string): Promise<{ user: IUser; token: string }> {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Invalid credentials')

  const valid = await user.comparePassword(password)
  if (!valid) throw new Error('Invalid credentials')

  const token = generateToken({ userId: user._id.toString(), email: user.email })
  return { user, token }
}
