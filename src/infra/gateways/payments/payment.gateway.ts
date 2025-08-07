export interface PaymentGateway {
  processPayment(payment: {
    correlationId: string;
    amount: number;
  }): Promise<void>;
}
