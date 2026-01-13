import { Prop, Schema } from '@nestjs/mongoose';
import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';

@Schema({ _id: false })
export class Payment {
  @Prop({ default: 0 })
  totalAmount: number; // service charge

  @Prop({ default: 0 })
  tipAmount: number;

  @Prop({ default: 0 })
  payableAmount: number; // final amount

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;
}
