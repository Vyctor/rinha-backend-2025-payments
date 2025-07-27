import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payments')
@Index('idx_search', ['gateway', 'createdAt'])
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  correlationId: string;

  @Column()
  gateway: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @CreateDateColumn()
  @Index('idx_created_at', {
    unique: false,
  })
  createdAt: Date;
}
