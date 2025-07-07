import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  get APP_PORT(): string | undefined {
    return this.configService.get<string>('APP_PORT');
  }

  get DB_URL(): string | undefined {
    return this.configService.get<string>('DB_URL');
  }

  get DB_PORT(): string | undefined {
    return this.configService.get<string>('DB_PORT');
  }

  get DB_NAME(): string | undefined {
    return this.configService.get<string>('DB_NAME');
  }

  get DB_USER(): string | undefined {
    return this.configService.get<string>('DB_USER');
  }

  get DB_PASS(): string | undefined {
    return this.configService.get<string>('DB_PASS');
  }

  get REDIS_HOST(): string | undefined {
    return this.configService.get<string>('REDIS_HOST');
  }

  get REDIS_PORT(): string | undefined {
    return this.configService.get<string>('REDIS_PORT');
  }
}
