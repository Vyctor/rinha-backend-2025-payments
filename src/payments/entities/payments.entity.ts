import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'created',
  PROCESSED = 'processed',
}

export enum PaymentGateway {
  DEFAULT = 'default',
  FALLBACK = 'fallback',
}

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['correlationId'])
  correlationId: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column()
  status: PaymentStatus;

  @Column({
    nullable: true,
  })
  gateway: PaymentGateway;

  @CreateDateColumn()
  createdAt: Date;
}
