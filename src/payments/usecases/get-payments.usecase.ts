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

    const [defaultGateway, defaultAmount, fallbackGateway, fallbackAmount] =
      await Promise.all([
        this.paymentsRepository.count({
          where: {
            gateway: 'default',
            ...where,
          },
        }),
        this.paymentsRepository.sum('amount', {
          gateway: 'default',
          ...where,
        }),
        this.paymentsRepository.count({
          where: {
            gateway: 'fallback',
            ...where,
          },
        }),
        this.paymentsRepository.sum('amount', {
          gateway: 'fallback',
          ...where,
        }),
      ]);

    return {
      default: {
        totalRequests: defaultGateway,
        totalAmount: defaultAmount ?? 0,
      },
      fallback: {
        totalRequests: fallbackGateway,
        totalAmount: fallbackAmount ?? 0,
      },
    };
  }
}
