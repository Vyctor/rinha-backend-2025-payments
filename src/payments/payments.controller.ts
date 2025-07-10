import { Body, Controller, Logger, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreatePaymentDto } from './dtos/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(@InjectQueue('payments') private readonly paymentsQueue: Queue) {}

  @Post()
  async receivePayment(
    @Body() payment: CreatePaymentDto,
  ): Promise<{ message: string }> {
    await this.paymentsQueue.add('process-payment', payment);
    return {
      message: 'Payment received',
    };
  }
}
