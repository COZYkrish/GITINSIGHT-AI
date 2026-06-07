import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai'
import { env } from '../../config/env'
import { ZodSchema } from 'zod'

interface GenerationOptions {
  temperature?: number
  maxOutputTokens?: number
  retries?: number
}

class GeminiService {
  private client: GoogleGenerativeAI
  private model: GenerativeModel

  constructor() {
    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY)
    this.model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash' })
  }

  async generateStructured<T>(
    prompt: string,
    schema: ZodSchema<T>,
    fallback: T,
    options: GenerationOptions = {}
  ): Promise<{ data: T; tokens: { prompt: number; completion: number; total: number } }> {
    const config: GenerationConfig = {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 8192,
    }

    const fullPrompt = `${prompt}

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanation. Just pure JSON.`

    return this.retryWithBackoff(async () => {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: config,
      })

      const text = result.response.text()
      const usage = result.response.usageMetadata

      let raw: unknown
      try {
        // Strip any accidental markdown fences
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        raw = JSON.parse(cleaned)
      } catch {
        console.warn('⚠️  Gemini response not valid JSON, using fallback')
        return {
          data: fallback,
          tokens: { prompt: usage?.promptTokenCount ?? 0, completion: usage?.candidatesTokenCount ?? 0, total: usage?.totalTokenCount ?? 0 }
        }
      }

      const parsed = schema.safeParse(raw)
      const data = parsed.success ? parsed.data : fallback

      return {
        data,
        tokens: {
          prompt: usage?.promptTokenCount ?? 0,
          completion: usage?.candidatesTokenCount ?? 0,
          total: usage?.totalTokenCount ?? 0,
        }
      }
    }, options.retries ?? 3)
  }

  async generateText(prompt: string): Promise<string> {
    return this.retryWithBackoff(async () => {
      const result = await this.model.generateContent(prompt)
      return result.response.text()
    }, 3)
  }

  private async retryWithBackoff<T>(fn: () => Promise<T>, retries: number): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn()
      } catch (error: unknown) {
        if (attempt === retries) {
          console.error(`❌ Gemini failed after ${retries} attempts:`, error)
          throw error
        }
        const delay = Math.pow(2, attempt) * 1000
        console.warn(`⚠️  Gemini attempt ${attempt} failed, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error('Max retries exceeded')
  }
}

export const geminiService = new GeminiService()
