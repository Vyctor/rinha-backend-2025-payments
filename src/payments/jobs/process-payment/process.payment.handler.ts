import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { ProcessPaymentDto } from './process.payment.dto';
import { ProcessPaymentUseCase } from '../../usecases/process-payment.usecase';

@Processor('payments', {
  concurrency: 1,
  limiter: {
    max: 3000,
    duration: 400,
  },
})
export class ProcessPaymentHandler extends WorkerHost {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    @InjectQueue('payments') private readonly paymentsQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<ProcessPaymentDto>): Promise<void> {
    try {
      await this.processPaymentUseCase.execute({
        ...job.data,
        gateway: 'default',
      });
    } catch {
      void this.paymentsQueue.add('process-payment', job.data);
      return;
    }
  }
}
