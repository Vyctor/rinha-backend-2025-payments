import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultPaymentGateway } from 'src/infra/gateways/payments/default-payment.gateway';
import { FallbackPaymentGateway } from 'src/infra/gateways/payments/fallback-payment.gateway';
import { ProcessPaymentDto } from '../jobs/process-payment/process.payment.dto';
import { Payment } from '../entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly defaultPaymentsGateway: DefaultPaymentGateway,
    private readonly fallbackPaymentsGateway: FallbackPaymentGateway,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  public async execute(input: ProcessPaymentDto): Promise<void> {
    try {
      if (input.gateway === 'default') {
        await this.defaultPaymentsGateway.processPayment(input);
      } else {
        await this.fallbackPaymentsGateway.processPayment(input);
      }

      await this.paymentRepository.save({
        correlationId: input.correlationId,
        amount: input.amount,
        gateway: input.gateway,
      });
    } catch {
      throw new Error('Erro ao processar pagamento');
    }
  }
}
