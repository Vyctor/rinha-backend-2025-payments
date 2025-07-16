import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { InfraModule } from 'src/infra/infra.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payments.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bull';
import { ProcessPaymentHandler } from './jobs/process-payment/process.payment.handler';
import { PaymentsSummaryController } from './payments-summary.controller';
import { ProcessPaymentUseCase } from './usecases/process-payment.usecase';

@Module({
  imports: [
    InfraModule,
    CqrsModule,
    TypeOrmModule.forFeature([Payment]),
    BullModule.registerQueue({
      name: 'payments',
    }),
  ],
  providers: [PaymentsService, ProcessPaymentHandler, ProcessPaymentUseCase],
  controllers: [PaymentsController, PaymentsSummaryController],
})
export class PaymentsModule {}
