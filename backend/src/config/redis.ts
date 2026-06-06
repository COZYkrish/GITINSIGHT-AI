import IORedis from 'ioredis'
import { env } from './env'

let redisClient: IORedis | null = null

export function getRedisClient(): IORedis {
  if (!redisClient) {
    redisClient = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
    })
    let errorLogged = false
    redisClient.on('connect', () => {
      console.log('✅ Redis connected')
      errorLogged = false // Reset on successful connection
    })
    redisClient.on('error', (err) => {
      if (!errorLogged) {
        console.warn('⚠️  Redis error (jobs disabled):', err.message)
        errorLogged = true
      }
    })
  }
  return redisClient
}

export async function connectRedis(): Promise<boolean> {
  try {
    const client = getRedisClient()
    await client.connect()
    return true
  } catch {
    console.warn('⚠️  Redis unavailable — background jobs will run synchronously')
    return false
  }
}
