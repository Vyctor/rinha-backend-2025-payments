import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  correlationId: string;

  @IsNumber()
  amount: number;
}
