import { Body, Controller, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { MoreThan, Repository } from 'typeorm';

@Controller('payments')
export class PaymentsController {
  constructor(
    @InjectQueue('payments') private readonly paymentsQueue: Queue,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  @Post()
  receivePayment(@Body() payment: CreatePaymentDto): { message: string } {
    void this.paymentsQueue.add('process-payment', payment);
    return {
      message: 'Payment received',
    };
  }

  @Post('purge')
  async purgePayments(): Promise<{ message: string }> {
    await this.paymentsRepository.delete({
      amount: MoreThan(0),
    });

    return {
      message: 'Payments purged',
    };
  }
}
