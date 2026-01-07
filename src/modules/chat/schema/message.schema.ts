import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  senderId: Types.ObjectId;

  @Prop({ required: true, type: String, index: true })
  roomId: string;

  @Prop({ required: true, type: String })
  text: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
