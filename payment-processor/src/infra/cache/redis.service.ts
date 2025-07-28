import { EnvironmentService } from '../../config/environment.service';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(private readonly environmentService: EnvironmentService) {
    this.redis = new Redis({
      host: this.environmentService.REDIS_HOST,
      port: parseInt(this.environmentService.REDIS_PORT),
    });
  }

  async setEx(key: string, value: string, ttl: number) {
    await this.redis.setex(key, ttl, value);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }
}
