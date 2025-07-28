import { Controller, Get, Inject, Query } from '@nestjs/common';
import { GetPaymentsUseCase } from './usecases/get-payments.usecase';

@Controller('payments-summary')
export class PaymentsSummaryController {
  constructor(
    @Inject(GetPaymentsUseCase)
    private readonly getPaymentsUseCase: GetPaymentsUseCase,
  ) {}

  @Get()
  async getPaymentsSummary(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.getPaymentsUseCase.execute({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }
}
