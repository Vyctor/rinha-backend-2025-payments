import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DefaultPaymentGateway } from './gateways/payments/default-payment.gateway';
import { FallbackPaymentGateway } from './gateways/payments/fallback-payment.gateway';
import { ConfigModule } from '../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisService } from './cache/redis.service';
import http from 'http';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot(), HttpModule.register({
    httpAgent: new http.Agent(
      {
        keepAlive: true,
        maxSockets: 45,
        maxFreeSockets: 15
      }),
  })],
  providers: [DefaultPaymentGateway, FallbackPaymentGateway, RedisService],
  exports: [DefaultPaymentGateway, FallbackPaymentGateway, RedisService],
})
export class InfraModule { }
