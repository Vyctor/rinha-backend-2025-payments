import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentGateway } from './payment.gateway';
import { EnvironmentService } from '../../../config/environment.service';
import { AxiosError } from 'axios';

@Injectable()
export class FallbackPaymentGateway implements PaymentGateway {
  constructor(
    private readonly httpService: HttpService,
    private readonly environmentService: EnvironmentService,
  ) {
    this.httpService.axiosRef.defaults.timeout = 1000;
  }

  async processPayment(payment: {
    correlationId: string;
    amount: number;
  }): Promise<void> {
    try {
      await this.httpService.axiosRef.post(
        this.environmentService.PAYMENTS_FALLBACK_GATEWAY_URL,
        payment,
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 422) {
        return;
      }
      throw new Error(`Erro ao processar pagamento.`);
    }
  }
}
