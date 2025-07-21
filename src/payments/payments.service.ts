import { Injectable } from '@nestjs/common';
import { Between } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor() {}

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
    await new Promise((resolve) => setTimeout(resolve, 0));
    const response = {
      default: {
        totalRequests: 0,
        totalAmount: 0,
      },
      fallback: {
        totalRequests: 0,
        totalAmount: 0,
      },
    };

    return response;
  }
}
