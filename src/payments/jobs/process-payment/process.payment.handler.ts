import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ProcessPaymentDto } from './process.payment.dto';
import { ProcessPaymentUseCase } from '../../usecases/process-payment.usecase';

@Processor('payments', {})
export class ProcessPaymentHandler extends WorkerHost {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {
    super();
  }

  async process(job: Job<ProcessPaymentDto>): Promise<void> {
    try {
      await this.processPaymentUseCase.execute({
        ...job.data,
        gateway: 'default',
      });
    } catch {
      throw new Error(`Failed to process payment:${job.data.correlationId}`);
    }
  }
}
