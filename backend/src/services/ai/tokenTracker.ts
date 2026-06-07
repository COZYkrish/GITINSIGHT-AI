import { AIUsage } from '../../models/AIUsage'

interface TokenUsage {
  prompt: number
  completion: number
  total: number
}

export async function recordTokenUsage(
  userId: string,
  feature: string,
  usage: TokenUsage,
  success = true
): Promise<void> {
  try {
    await AIUsage.create({
      userId,
      feature,
      aiModel: 'gemini-2.5-flash',
      promptTokens: usage.prompt,
      completionTokens: usage.completion,
      totalTokens: usage.total,
      success,
    })
  } catch (error) {
    // Non-critical — don't fail main operation
    console.warn('⚠️  Failed to record token usage:', error)
  }
}

export async function getMonthlyUsage(userId: string) {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const usages = await AIUsage.find({ userId, timestamp: { $gte: startOfMonth } })
  
  const totalTokens = usages.reduce((sum, u) => sum + u.totalTokens, 0)
  const byFeature = usages.reduce((acc, u) => {
    acc[u.feature] = (acc[u.feature] || 0) + u.totalTokens
    return acc
  }, {} as Record<string, number>)

  return { totalTokens, byFeature, callCount: usages.length }
}
