import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';

export class ListPaymentDto {
  paymentId: string;

  sender: string;
  receiver: string;

  amount: number;

  tskId: string;

  status: PaymentStatus;

  receiptId: string;

  paidAt?: Date;
  id: string;
}
