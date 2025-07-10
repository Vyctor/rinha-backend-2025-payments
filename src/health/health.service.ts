import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { EnvironmentService } from '../config/environment.service';
import { AxiosResponse } from 'axios';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly defaultGatewayUrl: string;
  private readonly fallbackGatewayUrl: string;

  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly httpCheck: HttpHealthIndicator,
    private readonly environmentService: EnvironmentService,
  ) {
    this.defaultGatewayUrl =
      this.environmentService.PAYMENTS_DEFAULT_GATEWAY_URL + '/service-health';
    this.fallbackGatewayUrl =
      this.environmentService.PAYMENTS_FALLBACK_GATEWAY_URL + '/service-health';
  }

  private verifyGatewayResponse(response: AxiosResponse) {
    const status = response.status;
    const body = response.data as {
      failing: boolean;
      minResponseTime: number;
    };
    if (body.failing) return false;
    if (status !== 200) return false;
    return true;
  }

  verifyHealth() {
    return this.healthCheckService.check([
      () =>
        this.httpCheck.responseCheck(
          'payments-default-gateway',
          this.defaultGatewayUrl,
          (response) => this.verifyGatewayResponse(response),
        ),
      () =>
        this.httpCheck.pingCheck(
          'payments-fallback-gateway',
          this.fallbackGatewayUrl,
        ),
    ]);
  }
}
