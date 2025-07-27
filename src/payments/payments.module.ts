import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { InfraModule } from 'src/infra/infra.module';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bull';
import { ProcessPaymentHandler } from './jobs/process-payment/process.payment.handler';
import { PaymentsSummaryController } from './payments-summary.controller';
import { ProcessPaymentUseCase } from './usecases/process-payment.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { GetPaymentsUseCase } from './usecases/get-payments.usecase';
import { HealthModule } from 'src/health/health.module';

@Module({
  imports: [
    InfraModule,
    CqrsModule,
    HealthModule,
    BullModule.registerQueue({
      name: 'payments',
    }),
    TypeOrmModule.forFeature([Payment]),
  ],
  providers: [ProcessPaymentHandler, ProcessPaymentUseCase, GetPaymentsUseCase],
  controllers: [PaymentsController, PaymentsSummaryController],
})
export class PaymentsModule {}
