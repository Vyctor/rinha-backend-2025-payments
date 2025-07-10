import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentGateway } from './payment.gateway';
import { EnvironmentService } from 'src/config/environment.service';
import { AxiosError } from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DefaultPaymentGateway implements PaymentGateway {
  private readonly logger = new Logger(DefaultPaymentGateway.name);
  private _apiResponseTime: number = 0;

  constructor(
    private readonly httpService: HttpService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async processPayment(payment: any): Promise<void> {
    await this.httpService.axiosRef
      .post(this.environmentService.PAYMENTS_DEFAULT_GATEWAY_URL, payment)
      .catch((error: AxiosError) => {
        this.logger.error(
          'Um erro ocorreu ao processar o pagamento: ',
          error.response?.data,
        );
        throw new Error('Erro ao processar pagamento');
      });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private async verifyHealth(): Promise<void> {
    try {
      const healthResponse = await this.httpService.axiosRef.get<{
        failing: boolean;
        minResponseTime: number;
      }>(
        this.environmentService.PAYMENTS_DEFAULT_GATEWAY_URL +
          '/service-health',
      );

      if (healthResponse.data.failing) {
        this._apiResponseTime = 999_999_999;
      } else {
        this._apiResponseTime = healthResponse.data.minResponseTime;
      }
    } catch {
      this.logger.error('Erro ao verificar saúde do gateway de pagamento');
      this._apiResponseTime = 999_999_999;
    } finally {
      this.logger.log(
        `Tempo de resposta do gateway de pagamento: ${this._apiResponseTime}`,
      );
    }
  }

  get apiResponseTime(): number {
    return this._apiResponseTime;
  }
}
