import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';

export interface IPaymentStatusGraphAggregationResult {
  _id: PaymentStatus;
  total: number;
}
