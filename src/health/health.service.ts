import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { EnvironmentService } from '../config/environment.service';
import { AxiosResponse } from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HealthService {
  private readonly defaultGatewayUrl: string;
  private readonly fallbackGatewayUrl: string;
  public gateway: {
    gateway: string;
    responseTime: number;
    failing: boolean;
  } = {
    gateway: 'default',
    responseTime: 0,
    failing: false,
  };

  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly httpCheck: HttpHealthIndicator,
    private readonly environmentService: EnvironmentService,
    private readonly dbCheck: TypeOrmHealthIndicator,
    private readonly httpService: HttpService,
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
      () => this.dbCheck.pingCheck('database'),
    ]);
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private async checkBestGateway(): Promise<void> {
    const defaultGatewayResponse = await this.httpService.axiosRef.get<{
      failing: boolean;
      minResponseTime: number;
    }>(this.defaultGatewayUrl);

    const fallbackGatewayResponse = await this.httpService.axiosRef.get<{
      failing: boolean;
      minResponseTime: number;
    }>(this.fallbackGatewayUrl);

    const chosenGateway =
      defaultGatewayResponse.data.minResponseTime <=
      fallbackGatewayResponse.data.minResponseTime
        ? {
            gateway: 'default',
            responseTime: defaultGatewayResponse.data.minResponseTime,
            failing: defaultGatewayResponse.data.failing,
          }
        : {
            gateway: 'fallback',
            responseTime: fallbackGatewayResponse.data.minResponseTime,
            failing: fallbackGatewayResponse.data.failing,
          };

    this.gateway = {
      responseTime: chosenGateway.responseTime,
      gateway: chosenGateway.gateway,
      failing: chosenGateway.failing,
    };

    console.log(chosenGateway);
  }
}
