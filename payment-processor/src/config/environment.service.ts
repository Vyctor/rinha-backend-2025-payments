import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  get APP_PORT(): string {
    return this.configService.get<string>('APP_PORT')!;
  }

  get REDIS_HOST(): string {
    return this.configService.get<string>('REDIS_HOST')!;
  }

  get REDIS_PORT(): string {
    return this.configService.get<string>('REDIS_PORT')!;
  }

  get PAYMENTS_DEFAULT_GATEWAY_URL(): string {
    return this.configService.get<string>('PAYMENTS_DEFAULT_GATEWAY_URL')!;
  }

  get PAYMENTS_FALLBACK_GATEWAY_URL(): string {
    return this.configService.get<string>('PAYMENTS_FALLBACK_GATEWAY_URL')!;
  }

  get POSTGRES_HOST(): string {
    return this.configService.get<string>('POSTGRES_HOST')!;
  }

  get POSTGRES_PORT(): string {
    return this.configService.get<string>('POSTGRES_PORT')!;
  }

  get POSTGRES_DATABASE(): string {
    return this.configService.get<string>('POSTGRES_DATABASE')!;
  }

  get POSTGRES_USER(): string {
    return this.configService.get<string>('POSTGRES_USER')!;
  }

  get POSTGRES_PASSWORD(): string {
    return this.configService.get<string>('POSTGRES_PASSWORD')!;
  }
}
