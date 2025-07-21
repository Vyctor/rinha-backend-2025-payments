import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultPaymentGateway } from 'src/infra/gateways/payments/default-payment.gateway';
import { FallbackPaymentGateway } from 'src/infra/gateways/payments/fallback-payment.gateway';
import { ProcessPaymentDto } from '../jobs/process-payment/process.payment.dto';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly defaultPaymentsGateway: DefaultPaymentGateway,
    private readonly fallbackPaymentsGateway: FallbackPaymentGateway,
  ) {}

  public async execute(input: ProcessPaymentDto): Promise<void> {
    try {
      if (
        this.defaultPaymentsGateway.apiResponseTime <=
        this.fallbackPaymentsGateway.apiResponseTime
      ) {
        await this.defaultPaymentsGateway.processPayment(input);
      } else {
        await this.fallbackPaymentsGateway.processPayment(input);
      }
    } catch {
      throw new Error('Erro ao processar pagamento');
    }

    console.log('Payment processed: ', input.correlationId);
    return;
  }
}
