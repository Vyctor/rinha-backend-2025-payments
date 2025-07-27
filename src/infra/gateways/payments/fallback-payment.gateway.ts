import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentGateway } from './payment.gateway';
import { AxiosError } from 'axios';
import { EnvironmentService } from 'src/config/environment.service';

@Injectable()
export class FallbackPaymentGateway implements PaymentGateway {
  constructor(
    private readonly httpService: HttpService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async processPayment(payment: any): Promise<void> {
    await this.httpService.axiosRef
      .post(this.environmentService.PAYMENTS_FALLBACK_GATEWAY_URL, payment)
      .catch((error: AxiosError) => {
        throw new Error(
          `Erro ao processar pagamento. Detalhes: ${error.message}  - ${error.code}`,
        );
      });
  }
}
