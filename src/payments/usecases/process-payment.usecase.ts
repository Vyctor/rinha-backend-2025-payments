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
      await this.paymentsRepository.save(this.paymentsRepository.create(input));
    } catch {
      throw new Error('Erro ao processar pagamento');
    }
  }
}
