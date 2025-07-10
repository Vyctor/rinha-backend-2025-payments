import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [TerminusModule, ConfigModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
