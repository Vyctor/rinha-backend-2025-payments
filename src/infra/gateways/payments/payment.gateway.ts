export interface PaymentGateway {
  processPayment(payment: any): Promise<void>;
}
