import QuickLRU from 'quick-lru'
import { keccak256, stringify } from 'viem'

type AsyncFunction<T extends any[]> = (...args: T) => Promise<any>

// Type definitions for the cache.
type CacheOptions<T extends AsyncFunction<any>> = {
  maxCacheSize?: number
  ttl: number
  persist?: {
    name: string
    version: string
    type: 'r2'
  }
  key?: (params: Parameters<T>) => any
}

function calcCacheKey(args: any[], epoch: number) {
  const json = stringify(args)
  const r = keccak256(`0x${json}@${epoch}`)
  return r
}

const identity = (args: any) => args

export const cacheByLRU = <T extends AsyncFunction<any>>(
  fn: T,
  { ttl, key, maxCacheSize, persist }: CacheOptions<T>,
) => {
  const cache = new QuickLRU<string, Promise<any>>({
    maxAge: ttl,
    maxSize: maxCacheSize || 1000,
  })
  const fetchR2Cache = persist
    ? cacheByLRU(_fetchR2Cache, {
        ttl,
      })
    : undefined

  function persistKey() {
    return `${persist?.name}-${persist?.version}`
  }

  async function ensurePersist(promise: Promise<any>) {
    if (fetchR2Cache && persist) {
      const t = Date.now()
      const r2Promise = fetchR2Cache(persistKey())
      const value = await Promise.race([r2Promise, promise])
      console.log('*****time usage****', Date.now() - t)
      return value ?? promise
    }
    return promise
  }

  const keyFunction = key || identity

  let startTime = 0
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Start Time
    if (!startTime) {
      startTime = Date.now()
    }
    const epoch = (Date.now() - startTime) / ttl
    const halfTTS = epoch % 1 > 0.5
    const epochId = Math.floor(epoch)

    // Setup next epoch cache if halfTTS passed
    if (halfTTS) {
      const nextKey = calcCacheKey(keyFunction(args), epochId + 1)
      if (!cache.has(nextKey)) {
        // @ts-ignore
        const nextPromise = fn(...args)
        cache.set(nextKey, nextPromise)
      }
    }

    const cacheKey = calcCacheKey(keyFunction(args), epochId)
    // logger(cacheKey, `exists=${cache.has(cacheKey)}`)
    if (cache.has(cacheKey)) {
      return ensurePersist(cache.get(cacheKey)!)
    }

    // @ts-ignore
    const promise = fn(...args)

    cache.set(cacheKey, promise)

    if (epochId > 0) {
      const prevKey = calcCacheKey(keyFunction(args), epochId - 1)
      if (cache.has(prevKey)) {
        return cache.get(prevKey)
      }
    }

    try {
      // Persist to R2 or other storage
      promise.then((result) => {
        const jsonResult = stringify(result)
        if (persist && result && jsonResult !== '{}' && jsonResult !== '[]') {
          uploadR2(persistKey(), result).catch((ex) => {
            console.error('Failed to persist cache', ex)
          })
        }
      })

      return ensurePersist(promise)
    } catch (error) {
      // logger('error', cacheKey, error)
      cache.delete(cacheKey)
      throw error
    }
  }
}

async function uploadR2(key: string, value: any) {
  console.info('update homepage cache', key)
  if (!process.env.OBJECT_CACHE_SECRET) {
    return
  }
  await fetch(`https://obj-cache.pancakeswap.com`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OBJECT_CACHE_SECRET}`,
    },
    body: JSON.stringify({ key, value }),
  })
}

async function _fetchR2Cache(key: string) {
  const resp = await fetch(`https://proofs.pancakeswap.com/cache/${key}`)
  if (resp.status === 200) {
    return resp.json()
  }
  console.warn(`Failed to fetch cache:https://proofs.pancakeswap.com/cache/${key}`)
  return undefined
}
