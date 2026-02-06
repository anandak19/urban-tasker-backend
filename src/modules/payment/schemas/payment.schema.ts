import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Task', index: true })
  taskId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  payerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  receiverId: Types.ObjectId;

  // amount in minor units (paise)
  @Prop({ type: Number, required: true, min: 0 })
  amountInPaise: number;

  // UPI | card | wallet | netbanking
  @Prop({ type: String })
  razorpayPaymentMethod?: string;

  @Prop({ type: String, index: true })
  razorpayPaymentId?: string;

  @Prop({ type: String, index: true })
  razorpayReceiptId?: string;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.CREATED,
  })
  paymentStatus: PaymentStatus;

  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;
}

export type PaymentDocument = HydratedDocument<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
