// src/common/cache/cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class GlobalCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  getKey(prefix: string, params?: any) {
    const paramString = params ? JSON.stringify(params) : '';
    return `${prefix}:${paramString}`;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const value = await (this.cacheManager as any).get(key);
    if (value) console.log(`🟢 CACHE HIT: ${key}`);
    else console.log(`⚪ CACHE MISS: ${key}`);
    return value as T | undefined;
  }

  async set<T>(key: string, value: T, ttl = 300) {
    console.log(`🔵 CACHE SET: ${key} (ttl: ${ttl}s)`);
    await (this.cacheManager as any).set(key, value, { ttl });
  }

  async clear(pattern = '*') {
    const store = (this.cacheManager as any).store;
    if (!store.keys) return;
    const keys: string[] = await store.keys(pattern);
    for (const key of keys) {
      await store.del(key);
      console.log(`❌ CACHE DEL: ${key}`);
    }
  }
}
