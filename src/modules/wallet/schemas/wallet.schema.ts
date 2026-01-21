import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { WalletStatus } from '../constants/wallet.enums';

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  currentBalance: number;

  @Prop({ type: Number, default: 0 })
  totalEarnings: number;

  @Prop({ type: Number, default: 0 })
  totalWithdrawn: number;

  @Prop({ type: Number, default: 0 })
  lastCreditAmount: number;

  @Prop({ type: Number, default: 0 })
  lastDebitAmount: number;

  @Prop({
    type: String,
    enum: WalletStatus,
    default: WalletStatus.ACTIVE,
  })
  status: WalletStatus;
}

export type WalletDocument = HydratedDocument<Wallet>;
export const WalletSchema = SchemaFactory.createForClass(Wallet);
