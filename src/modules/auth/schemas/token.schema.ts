import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  revoked: boolean;
}

export type TokenDocument = HydratedDocument<Token>;
export const TokenSchema = SchemaFactory.createForClass(Token);

// auto expires tokens past expiresAt
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
