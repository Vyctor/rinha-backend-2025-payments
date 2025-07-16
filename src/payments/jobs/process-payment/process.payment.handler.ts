import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { ProcessPaymentDto } from './process.payment.dto';
import { ProcessPaymentUseCase } from '../../usecases/process-payment.usecase';

@Processor('payments')
export class ProcessPaymentHandler {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  @Process('process-payment')
  async execute(job: Job<ProcessPaymentDto>): Promise<void> {
    try {
      await this.processPaymentUseCase.execute(job.data);
    } catch {
      throw new Error(`Failed to process payment:${job.data.correlationId}`);
    }
  }
}
