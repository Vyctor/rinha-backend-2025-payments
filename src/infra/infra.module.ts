import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DefaultPaymentGateway } from './gateways/payments/default-payment.gateway';
import { FallbackPaymentGateway } from './gateways/payments/fallback-payment.gateway';
import { ConfigModule } from '../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisService } from './cache/redis.service';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot(), HttpModule],
  providers: [DefaultPaymentGateway, FallbackPaymentGateway, RedisService],
  exports: [DefaultPaymentGateway, FallbackPaymentGateway, RedisService],
})
export class InfraModule {}
