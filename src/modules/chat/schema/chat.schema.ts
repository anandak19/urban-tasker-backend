import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
    index: true,
  })
  participants: Types.ObjectId[];

  @Prop({ type: String, default: '' })
  lastMessage: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  lastMessageSender: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export type ChatDocument = HydratedDocument<Chat>;
export const ChatSchema = SchemaFactory.createForClass(Chat);
