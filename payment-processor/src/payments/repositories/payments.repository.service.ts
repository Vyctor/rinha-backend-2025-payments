import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class PaymentsRepositoryService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  create(input: {
    correlationId: string;
    amount: number;
    gateway: string;
  }): Payment {
    return this.paymentRepository.create(input);
  }

  async save(payment: Payment): Promise<void> {
    await this.paymentRepository.save(payment).catch((error) => {
      if (
        error instanceof QueryFailedError &&
        (error.message.includes('ER_DUP_ENTRY') ||
          error.message.includes('Duplicate entry'))
      ) {
        return;
      }
      throw error;
    });
  }
}
