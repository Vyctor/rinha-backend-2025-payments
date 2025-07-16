import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentGateway } from './payment.gateway';
import { AxiosError } from 'axios';
import { EnvironmentService } from 'src/config/environment.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FallbackPaymentGateway implements PaymentGateway {
  private readonly logger = new Logger(FallbackPaymentGateway.name);
  private _apiResponseTime: number = 0;

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

  @Cron(CronExpression.EVERY_5_SECONDS)
  private async verifyHealth(): Promise<void> {
    try {
      const healthResponse = await this.httpService.axiosRef.get<{
        failing: boolean;
        minResponseTime: number;
      }>(
        this.environmentService.PAYMENTS_FALLBACK_GATEWAY_URL +
          '/service-health',
      );

      if (healthResponse.data.failing) {
        this._apiResponseTime = 999_999_999;
      } else {
        this._apiResponseTime = healthResponse.data.minResponseTime;
      }
    } catch {
      this._apiResponseTime = 999_999_999;
    }
  }

  get apiResponseTime(): number {
    return this._apiResponseTime;
  }
}
