import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentGateway } from './payment.gateway';
import { EnvironmentService } from '../../../config/environment.service';

@Injectable()
export class DefaultPaymentGateway implements PaymentGateway {
  constructor(
    private readonly httpService: HttpService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async processPayment(payment: {
    correlationId: string;
    amount: number;
  }): Promise<void> {
    await this.httpService.axiosRef
      .post(this.environmentService.PAYMENTS_DEFAULT_GATEWAY_URL, payment)
      .catch((error) => {
        if (error.response?.status === 422 || error.status === 422) {
          return;
        }
        throw new Error(`Erro ao processar pagamento.`);
      });
  }
}
