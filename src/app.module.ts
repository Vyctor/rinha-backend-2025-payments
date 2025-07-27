import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PaymentsModule } from './payments/payments.module';
import { InfraModule } from './infra/infra.module';
import { HealthModule } from './health/health.module';
import { EnvironmentService } from './config/environment.service';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    PaymentsModule,
    InfraModule,
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => {
        return {
          type: 'mysql',
          host: environmentService.MYSQL_HOST,
          port: parseInt(environmentService.MYSQL_PORT),
          username: environmentService.MYSQL_USER,
          password: environmentService.MYSQL_PASSWORD,
          database: environmentService.MYSQL_DATABASE,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
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
            attempts: 2,
            backoff: {
              type: 'fixed',
              delay: 2000,
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
