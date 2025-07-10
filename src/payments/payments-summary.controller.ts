import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments-summary')
export class PaymentsSummaryController {
  constructor(@Inject() private readonly paymentsService: PaymentsService) {}

  @Get()
  async getPaymentsSummary(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.paymentsService.paymentSummary({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }
}
