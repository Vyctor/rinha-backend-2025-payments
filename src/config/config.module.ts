import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        PAYMENTS_DEFAULT_GATEWAY_URL: Joi.string().required(),
        PAYMENTS_FALLBACK_GATEWAY_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class ConfigModule {}
