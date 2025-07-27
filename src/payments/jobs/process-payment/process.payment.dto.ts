export class ProcessPaymentDto {
  correlationId: string;
  amount: number;
  gateway: 'default' | 'fallback';
}
