import { Injectable } from '@nestjs/common';
import { DefaultPaymentGateway } from '../../infra/gateways/payments/default-payment.gateway';
import { ProcessPaymentDto } from '../jobs/process-payment/process.payment.dto';
import { PaymentsRepositoryService } from '../repositories/payments.repository.service';
import { FallbackPaymentGateway } from '../../infra/gateways/payments/fallback-payment.gateway';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly defaultPaymentsGateway: DefaultPaymentGateway,
    private readonly fallbackPaymentsGateway: FallbackPaymentGateway,
    private readonly paymentsRepository: PaymentsRepositoryService,
  ) {}

  public async execute(input: ProcessPaymentDto): Promise<void> {
    try {
      if (input.gateway === 'default') {
        await this.defaultPaymentsGateway.processPayment(input);
      } else if (input.gateway === 'fallback') {
        await this.fallbackPaymentsGateway.processPayment(input);
      } else {
        throw new Error('Requeue payment');
      }
      const payment = this.paymentsRepository.create({
        ...input,
      });
      await this.paymentsRepository.save(payment);
    } catch {
      throw new Error('Erro ao processar pagamento');
    }
  }
}
