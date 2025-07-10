import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PaymentsModule } from './payments/payments.module';
import { InfraModule } from './infra/infra.module';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentService } from './config/environment.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule,
    PaymentsModule,
    InfraModule,
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        type: 'postgres',
        host: environmentService.DB_URL,
        port: parseInt(environmentService.DB_PORT),
        username: environmentService.DB_USER,
        password: environmentService.DB_PASS,
        database: environmentService.DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        connection: {
          host: environmentService.REDIS_HOST,
          port: parseInt(environmentService.REDIS_PORT),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 5,
          backoff: {
            type: 'fixed',
            delay: 1000,
          },
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
