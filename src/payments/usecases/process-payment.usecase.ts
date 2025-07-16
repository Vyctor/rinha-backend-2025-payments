import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultPaymentGateway } from 'src/infra/gateways/payments/default-payment.gateway';
import { FallbackPaymentGateway } from 'src/infra/gateways/payments/fallback-payment.gateway';
import { Repository } from 'typeorm';
import {
  Payment,
  PaymentGateway,
  PaymentStatus,
} from '../entities/payments.entity';
import { ProcessPaymentDto } from '../jobs/process-payment/process.payment.dto';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly defaultPaymentsGateway: DefaultPaymentGateway,
    private readonly fallbackPaymentsGateway: FallbackPaymentGateway,
  ) {}

  public async execute(input: ProcessPaymentDto): Promise<void> {
    let paymentGateway: PaymentGateway;

    try {
      if (
        this.defaultPaymentsGateway.apiResponseTime <=
        this.fallbackPaymentsGateway.apiResponseTime
      ) {
        await this.defaultPaymentsGateway.processPayment(input);
        paymentGateway = PaymentGateway.DEFAULT;
      } else {
        await this.fallbackPaymentsGateway.processPayment(input);
        paymentGateway = PaymentGateway.FALLBACK;
      }
    } catch {
      throw new Error('Erro ao processar pagamento');
    }

    await this.paymentRepository.save({
      ...input,
      status: PaymentStatus.PROCESSED,
      gateway: paymentGateway,
    });
    console.log('Payment processed: ', input.correlationId);
    return;
  }
}
