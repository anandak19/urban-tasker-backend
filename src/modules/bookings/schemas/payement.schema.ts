import { Prop, Schema } from '@nestjs/mongoose';
import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';

@Schema({ _id: false })
export class Payment {
  @Prop({ default: 0 })
  totalAmount: number; // service charge

  @Prop({ default: 0 })
  platFormFee: number; // platfrom earning

  @Prop({ default: 0 })
  subTotal: number; // service + platform fee

  @Prop({ default: 0 })
  tipAmount: number; // tip

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;
}
