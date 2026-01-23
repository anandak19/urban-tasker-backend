import { Types } from 'mongoose';

export interface ICreatePayment {
  amountInPaise: number;
  taskId: Types.ObjectId;
  payerId: Types.ObjectId;
  receiverId: Types.ObjectId;
  razorpayPaymentId?: string;
  razorpayReceiptId?: string;
}
