import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DefaultPaymentGateway } from './gateways/payments/default-payment.gateway';
import { FallbackPaymentGateway } from './gateways/payments/fallback-payment.gateway';
import { ConfigModule } from '../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot(), HttpModule.register({})],
  providers: [DefaultPaymentGateway, FallbackPaymentGateway],
  exports: [DefaultPaymentGateway, FallbackPaymentGateway],
})
export class InfraModule {}
