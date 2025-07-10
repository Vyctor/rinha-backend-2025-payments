import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { DefaultPaymentGateway } from 'src/infra/gateways/payments/default-payment.gateway';
import { FallbackPaymentGateway } from 'src/infra/gateways/payments/fallback-payment.gateway';
import {
  Payment,
  PaymentGateway,
  PaymentStatus,
} from 'src/payments/entities/payments.entity';
import { ProcessPaymentDto } from './process.payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Processor('payments')
export class ProcessPaymentHandler {
  private readonly logger = new Logger(ProcessPaymentHandler.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly defaultPaymentsGateway: DefaultPaymentGateway,
    private readonly fallbackPaymentsGateway: FallbackPaymentGateway,
    @InjectQueue('payments') private readonly paymentsQueue: Queue,
  ) {}

  @Process('process-payment')
  async execute(job: Job<ProcessPaymentDto>): Promise<void> {
    let paymentGateway: PaymentGateway;

    try {
      if (
        this.defaultPaymentsGateway.apiResponseTime <=
        this.fallbackPaymentsGateway.apiResponseTime
      ) {
        await this.defaultPaymentsGateway.processPayment(job.data);
        paymentGateway = PaymentGateway.DEFAULT;
      } else {
        await this.fallbackPaymentsGateway.processPayment(job.data);
        paymentGateway = PaymentGateway.FALLBACK;
      }
    } catch {
      throw new Error('Erro ao processar pagamento');
    }

    await this.paymentRepository.save({
      ...job.data,
      status: PaymentStatus.PROCESSED,
      gateway: paymentGateway,
    });
  }
}
