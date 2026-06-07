// GlassCard.tsx — now re-exports from the Newsprint primitive.
// All existing imports of GlassCard, GlowBadge, ScoreGauge, ProgressBar,
// TypewriterText, and AnimatedCounter continue to work without changes.
export {
  NewsprintCard,
  NewsprintCard as GlassCard,
  EditorialBadge,
  EditorialBadge as GlowBadge,
  ScoreGauge,
  ProgressBar,
  TypewriterText,
  AnimatedCounter,
} from './NewsprintCard'
