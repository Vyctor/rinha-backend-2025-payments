import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { ProcessPaymentDto } from './process.payment.dto';
import { ProcessPaymentUseCase } from '../../usecases/process-payment.usecase';
import { GatewayCircuitBreakerService } from '../../../infra/gateways/payments/gateway-circuit-breaker.service';

@Processor('payments', {
  concurrency: 1,
  limiter: {
    max: 5000,
    duration: 1000,
  },
})
export class ProcessPaymentHandler extends WorkerHost {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly gatewayCircuitBreakerService: GatewayCircuitBreakerService,
    @InjectQueue('payments') private readonly paymentsQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<ProcessPaymentDto>): Promise<void> {
    const gateway = this.gatewayCircuitBreakerService.bestGateway;

    if (gateway === 'requeue' || gateway === 'fallback') {
      await this.paymentsQueue.add('process-payment', job.data);
      return;
    }

    try {
      await this.processPaymentUseCase.execute({
        ...job.data,
        gateway: gateway as 'default' | 'fallback',
      });
    } catch {
      throw new Error(`Failed to process payment:${job.data.correlationId}`);
    }
  }
}
