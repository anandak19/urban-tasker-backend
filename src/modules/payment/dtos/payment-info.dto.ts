import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';

export class PaymentInfoResponseDto {
  totalWorkHours: number | string;
  hourlyRate: number;
  serviceFee: number;
  tipAmount: number;
  totalPayable: number;
  paymentStatus: PaymentStatus;
}
