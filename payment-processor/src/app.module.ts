import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PaymentsModule } from './payments/payments.module';
import { InfraModule } from './infra/infra.module';
import { EnvironmentService } from './config/environment.service';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    PaymentsModule,
    InfraModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => {
        return {
          type: 'postgres',
          host: environmentService.POSTGRES_HOST,
          port: parseInt(environmentService.POSTGRES_PORT),
          username: environmentService.POSTGRES_USER,
          password: environmentService.POSTGRES_PASSWORD,
          database: environmentService.POSTGRES_DATABASE,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
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
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 1500,
          },
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
