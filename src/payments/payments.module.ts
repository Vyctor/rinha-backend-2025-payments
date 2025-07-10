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
import { CreatePaymentHandler } from './jobs/create-payment/create-payment.handler';

@Module({
  imports: [
    InfraModule,
    CqrsModule,
    BullModule.registerQueue({ name: 'payments' }),
    TypeOrmModule.forFeature([Payment]),
  ],
  providers: [PaymentsService, CreatePaymentHandler, ProcessPaymentHandler],
  controllers: [PaymentsController, PaymentsSummaryController],
})
export class PaymentsModule {}
