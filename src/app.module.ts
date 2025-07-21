import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PaymentsModule } from './payments/payments.module';
import { InfraModule } from './infra/infra.module';
import { HealthModule } from './health/health.module';
import { EnvironmentService } from './config/environment.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule,
    PaymentsModule,
    InfraModule,
    HealthModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => {
        return {
          redis: {
            host: environmentService.REDIS_HOST,
            port: parseInt(environmentService.REDIS_PORT),
          },
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true,
            attempts: 5,
            backoff: {
              type: 'fixed',
              delay: 1500,
            },
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
