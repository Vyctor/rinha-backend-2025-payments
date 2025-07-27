import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { ProcessPaymentDto } from './process.payment.dto';
import { ProcessPaymentUseCase } from '../../usecases/process-payment.usecase';
import { HealthService } from 'src/health/health.service';

@Processor('payments')
export class ProcessPaymentHandler {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly healthService: HealthService,
  ) {}

  @Process('process-payment')
  async execute(job: Job<ProcessPaymentDto>): Promise<void> {
    try {
      if (
        this.healthService.gateway.failing ||
        (this.healthService.gateway.responseTime > 1000 &&
          this.healthService.gateway.gateway === 'fallback')
      ) {
        throw new Error('Gateway is failing');
      }

      await this.processPaymentUseCase.execute({
        ...job.data,
        gateway: this.healthService.gateway.gateway as 'default' | 'fallback',
      });
    } catch {
      throw new Error(`Failed to process payment:${job.data.correlationId}`);
    }
  }
}
