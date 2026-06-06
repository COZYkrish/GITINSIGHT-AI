import mongoose, { Schema, Document } from 'mongoose'

export interface IPublicProfile extends Document {
  userId: mongoose.Types.ObjectId
  username: string
  slug: string
  isPublic: boolean
  visibleSections: {
    developerDNA: boolean
    portfolioScore: boolean
    careerReadiness: boolean
    topProjects: boolean
    wrappedHighlights: boolean
    publicResume: boolean
  }
  viewCount: number
  lastUpdated: Date
}

const PublicProfileSchema = new Schema<IPublicProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  isPublic: { type: Boolean, default: false },
  visibleSections: {
    developerDNA: { type: Boolean, default: true },
    portfolioScore: { type: Boolean, default: true },
    careerReadiness: { type: Boolean, default: true },
    topProjects: { type: Boolean, default: true },
    wrappedHighlights: { type: Boolean, default: false },
    publicResume: { type: Boolean, default: false },
  },
  viewCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true })

export const PublicProfile = mongoose.model<IPublicProfile>('PublicProfile', PublicProfileSchema)
