import { Injectable } from '@nestjs/common';
import { DefaultPaymentGateway } from '../../infra/gateways/payments/default-payment.gateway';
import { ProcessPaymentDto } from '../jobs/process-payment/process.payment.dto';
import { PaymentsRepositoryService } from '../repositories/payments.repository.service';
import { FallbackPaymentGateway } from 'src/infra/gateways/payments/fallback-payment.gateway';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly defaultPaymentsGateway: DefaultPaymentGateway,
    private readonly paymentsRepository: PaymentsRepositoryService,
    private readonly fallbackPaymentsGateway: FallbackPaymentGateway,
  ) {}

  public async execute(input: ProcessPaymentDto): Promise<void> {
    try {
      if (input.gateway === 'default') {
        await this.defaultPaymentsGateway.processPayment(input);
      } else {
        await this.fallbackPaymentsGateway.processPayment(input);
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
