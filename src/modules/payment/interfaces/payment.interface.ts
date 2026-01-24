import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';
import { Types } from 'mongoose';

export interface ICreatePayment {
  amountInPaise: number;
  taskId: Types.ObjectId;
  tskId: string;
  payerId: Types.ObjectId;
  receiverId: Types.ObjectId;
  razorpayPaymentId?: string;
  razorpayReceiptId?: string;
}

export interface IPaymentListItemRepoResult {
  amountInPaise: number;

  razorpayPaymentId: string;
  razorpayReceiptId: string;

  paymentStatus: PaymentStatus;

  senderName: string;
  receiverName: string;

  createdAt: Date;
  tskId: string;
  id: string;
}
