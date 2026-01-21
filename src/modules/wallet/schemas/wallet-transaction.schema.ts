import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  WalletTransactionSource,
  WalletTransactionType,
} from '../constants/wallet.enums';

@Schema({ timestamps: true })
export class WalletTransaction {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  walletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, index: true })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: WalletTransactionType,
    required: true,
  })
  type: WalletTransactionType;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Number })
  balanceAfter?: number;

  @Prop({
    type: String,
    enum: WalletTransactionSource,
    required: true,
  })
  source: WalletTransactionSource;

  // Razorpay / Stripe / Order / Reference ID
  @Prop({ type: String })
  referenceId: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Boolean, default: true })
  isSuccess: boolean;
}

export type WalletTransactionDocument = HydratedDocument<WalletTransaction>;
export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);
