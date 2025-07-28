import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class GetPaymentsUseCase {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  async execute(input: { from?: Date; to?: Date }) {
    const where = {};

    if (input.from && input.to) {
      where['createdAt'] = Between(new Date(input.from), new Date(input.to));
    }

    const [
      totalTransactionsFallback,
      totalAmountFallback,
      totalTransactionsDefault,
      totalAmountDefault,
    ] = await Promise.all([
      this.paymentsRepository.count({
        where: {
          ...where,
          gateway: 'fallback',
        },
      }),
      this.paymentsRepository.sum('amount', {
        ...where,
        gateway: 'fallback',
      }),
      this.paymentsRepository.count({
        where: {
          ...where,
          gateway: 'default',
        },
      }),
      this.paymentsRepository.sum('amount', {
        ...where,
        gateway: 'default',
      }),
    ]);

    return {
      default: {
        totalRequests: totalTransactionsDefault,
        totalAmount: totalAmountDefault ?? 0,
      },
      fallback: {
        totalRequests: totalTransactionsFallback,
        totalAmount: totalAmountFallback ?? 0,
      },
    };
  }
}
