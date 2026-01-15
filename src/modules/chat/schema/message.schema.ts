import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  senderId: Types.ObjectId;

  @Prop({ required: true, type: String, index: true })
  roomId: string;

  @Prop({
    type: String,
    enum: Object.values(MessageType),
    required: true,
    index: true,
  })
  type: MessageType;

  @Prop({ type: String })
  text?: string;

  @Prop({ type: String })
  publicKey?: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export type MessageDocument = HydratedDocument<Message> & {
  createdAt: Date;
  updatedAt: Date;
};

export const MessageSchema = SchemaFactory.createForClass(Message);
