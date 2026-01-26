import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';

export class PaymentInfoResponseDto {
  totalWorkHours: number | string;
  hourlyRate: number;
  serviceFee: number;
  tipAmount: number;

  platFormFee: number;
  subTotal: number;

  totalPayable: number;
  paymentStatus: PaymentStatus;
}
