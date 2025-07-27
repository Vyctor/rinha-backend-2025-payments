import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentGateway } from './payment.gateway';
import { EnvironmentService } from 'src/config/environment.service';
import { AxiosError } from 'axios';

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
      .catch((error: AxiosError) => {
        throw new Error(
          `Erro ao processar pagamento. Detalhes: ${error.message}  - ${error.code}`,
        );
      });
  }
}
