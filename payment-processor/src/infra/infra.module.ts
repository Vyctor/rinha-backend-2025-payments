import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DefaultPaymentGateway } from './gateways/payments/default-payment.gateway';
import { FallbackPaymentGateway } from './gateways/payments/fallback-payment.gateway';
import { ConfigModule } from '../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisService } from './cache/redis.service';
import { GatewayCircuitBreakerService } from './gateways/payments/gateway-circuit-breaker.service';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot(), HttpModule.register({})],
  providers: [
    DefaultPaymentGateway,
    FallbackPaymentGateway,
    RedisService,
    GatewayCircuitBreakerService,
  ],
  exports: [
    DefaultPaymentGateway,
    FallbackPaymentGateway,
    RedisService,
    GatewayCircuitBreakerService,
  ],
})
export class InfraModule {}
