import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { CreatePaymentDto } from './create-payment.dto';
import { Job, Queue } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from 'src/payments/entities/payments.entity';
import { Repository } from 'typeorm';

@Processor('payments')
export class CreatePaymentHandler {
  private readonly logger = new Logger(CreatePaymentHandler.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectQueue('payments') private readonly paymentsQueue: Queue,
  ) {}

  @Process('create-payment')
  async execute(job: Job<CreatePaymentDto>): Promise<void> {
    const payment = this.paymentRepository.create({
      status: PaymentStatus.PENDING,
      amount: job.data.amount,
      correlationId: job.data.correlationId,
    });

    try {
      const savedPayment = await this.paymentRepository.save(payment);

      await this.paymentsQueue.add('process-payment', {
        id: savedPayment.id,
        correlationId: job.data.correlationId,
        amount: job.data.amount,
      });
    } catch (error) {
      this.logger.error(
        `Error creating payment for job: ${JSON.stringify(job.data)}`,
        error,
      );
      throw error;
    }
  }
}
