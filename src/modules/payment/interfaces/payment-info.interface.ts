import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';

export interface IPaymentInformation {
  totalWorkHours: number;
  hourlyRate: number;
  serviceFee: number;
  tipAmount: number;
  totalPayable: number;
  paymentStatus: PaymentStatus;
}
