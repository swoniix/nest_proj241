import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly _redis: Redis | null;
  private readonly _ttl: number;

  constructor(private readonly _configService: ConfigService) {
    const cacheEnabled =
      this._configService.get<string>('CACHE_ENABLED') !== 'false';
    this._ttl = Number(this._configService.get<string>('CACHE_TTL') ?? 300);

    this._redis = cacheEnabled
      ? new Redis({
          host: this._configService.get<string>('REDIS_HOST') ?? 'localhost',
          port: Number(this._configService.get<string>('REDIS_PORT') ?? 6379),
        })
      : null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this._redis) {
      return null;
    }

    const value = await this._redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set(key: string, value: unknown): Promise<void> {
    if (this._redis) {
      await this._redis.set(key, JSON.stringify(value), 'EX', this._ttl);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this._redis) {
      await this._redis.quit();
    }
  }
}
