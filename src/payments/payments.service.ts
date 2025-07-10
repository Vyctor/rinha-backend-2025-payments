import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Payment,
  PaymentGateway,
  PaymentStatus,
} from './entities/payments.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async paymentSummary(input: { from?: Date; to?: Date }): Promise<{
    default: {
      totalRequests: number;
      totalAmount: number;
    };
    fallback: {
      totalRequests: number;
      totalAmount: number;
    };
  }> {
    const interval =
      input.from && input.to ? Between(input.from, input.to) : undefined;

    const defaultGatewayTotalRequests = await this.paymentRepository.count({
      where: {
        gateway: PaymentGateway.DEFAULT,
        status: PaymentStatus.PROCESSED,
        createdAt: interval,
        ...(interval && { createdAt: interval }),
      },
    });

    const defaultGatewayTotalAmount = await this.paymentRepository.sum(
      'amount',
      {
        gateway: PaymentGateway.DEFAULT,
        status: PaymentStatus.PROCESSED,
        ...(interval && { createdAt: interval }),
      },
    );

    const fallbackGatewayTotalRequests = await this.paymentRepository.count({
      where: {
        gateway: PaymentGateway.FALLBACK,
        status: PaymentStatus.PROCESSED,
        ...(interval && { createdAt: interval }),
      },
    });

    const fallbackGatewayTotalAmount = await this.paymentRepository.sum(
      'amount',
      {
        gateway: PaymentGateway.FALLBACK,
        status: PaymentStatus.PROCESSED,
        ...(interval && { createdAt: interval }),
      },
    );

    const response = {
      default: {
        totalRequests: defaultGatewayTotalRequests,
        totalAmount: defaultGatewayTotalAmount ?? 0,
      },
      fallback: {
        totalRequests: fallbackGatewayTotalRequests,
        totalAmount: fallbackGatewayTotalAmount ?? 0,
      },
    };

    return response;
  }
}
