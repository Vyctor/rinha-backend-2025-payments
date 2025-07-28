import { Injectable } from '@nestjs/common';
import { RedisService } from '../../cache/redis.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GatewayCircuitBreakerService {
  private _bestGateway: string;

  constructor(private readonly redisService: RedisService) {}

  @Cron('*/5 * * * * *')
  async verify() {
    const bestGateway = await this.redisService.get('best-gateway');
    if (bestGateway) {
      this._bestGateway = bestGateway;
    } else {
      this._bestGateway = 'requeue';
    }
    console.info(`Using gateway: ${this._bestGateway}`);
  }

  set bestGateway(value: string) {
    this._bestGateway = value;
  }

  get bestGateway() {
    return this._bestGateway;
  }
}
