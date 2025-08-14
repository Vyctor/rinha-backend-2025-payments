import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payments')
@Index('idx_search', ['createdAt', 'gateway'])
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  correlationId: string;

  @Column()
  gateway: string;

  @Column({})
  amount: number;

  @CreateDateColumn()
  @Index('idx_created_at', {
    unique: false,
  })
  createdAt: Date;
}
