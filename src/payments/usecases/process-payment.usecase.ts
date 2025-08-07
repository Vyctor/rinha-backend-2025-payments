import { Injectable } from '@nestjs/common';
import { DefaultPaymentGateway } from '../../infra/gateways/payments/default-payment.gateway';
import { ProcessPaymentDto } from '../jobs/process-payment/process.payment.dto';
import { PaymentsRepositoryService } from '../repositories/payments.repository.service';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly defaultPaymentsGateway: DefaultPaymentGateway,
    private readonly paymentsRepository: PaymentsRepositoryService,
  ) {}

  public async execute(input: ProcessPaymentDto): Promise<void> {
    try {
      await this.defaultPaymentsGateway.processPayment(input);
      const payment = this.paymentsRepository.create({
        ...input,
      });
      await this.paymentsRepository.save(payment);
    } catch {
      throw new Error('Erro ao processar pagamento');
    }
  }
}
