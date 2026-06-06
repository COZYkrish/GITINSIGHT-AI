import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  githubConnected: boolean
  githubId?: string
  githubAccessToken?: string
  onboardingComplete: boolean
  publicProfileEnabled: boolean
  publicProfileSlug?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    githubConnected: { type: Boolean, default: false },
    githubId: { type: String, sparse: true },
    githubAccessToken: { type: String },
    onboardingComplete: { type: Boolean, default: false },
    publicProfileEnabled: { type: Boolean, default: false },
    publicProfileSlug: { type: String, sparse: true },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (this: IUser) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  }
})

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash)
}

export const User = mongoose.model<IUser>('User', UserSchema)
