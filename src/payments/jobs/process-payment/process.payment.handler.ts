import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
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
      await this.processPaymentUseCase
        .execute({
          ...job.data,
          gateway: 'fallback',
        })
        .catch(() => {
          throw new Error('Erro ao processar pagamento');
        });
    }
  }
}
