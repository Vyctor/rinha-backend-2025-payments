import { Injectable } from '@nestjs/common';
import { DefaultPaymentGateway } from '../../infra/gateways/payments/default-payment.gateway';
import { ProcessPaymentDto } from '../jobs/process-payment/process.payment.dto';
import { PaymentsRepositoryService } from '../repositories/payments.repository.service';
import { FallbackPaymentGateway } from 'src/infra/gateways/payments/fallback-payment.gateway';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly defaultPaymentsGateway: DefaultPaymentGateway,
    private readonly fallbackPaymentsGateway: FallbackPaymentGateway,
    private readonly paymentsRepository: PaymentsRepositoryService,
  ) {}

  public async execute(input: ProcessPaymentDto): Promise<void> {
    try {
      switch (input.gateway) {
        case 'default':
          await this.defaultPaymentsGateway.processPayment(input);
          break;
        case 'fallback':
          await this.fallbackPaymentsGateway.processPayment(input);
          break;
      }
      await this.paymentsRepository.save(this.paymentsRepository.create(input));
    } catch {
      throw new Error('Erro ao processar pagamento');
    }
  }
}
