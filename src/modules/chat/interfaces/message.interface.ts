import { TObjectId } from '@shared/types/db-types';
import { MessageType } from '../schema/message.schema';

export interface ICreateMessage {
  senderId: TObjectId;
  roomId: string;
  text?: string;
  publicKey?: string;
  type: MessageType;
}

export interface IMessage
  extends Omit<ICreateMessage, 'senderId' | 'publicKey'> {
  senderId: string;
  isRead: boolean;
  id: string;
  time: string;
  imageUrl?: string;
}

export interface ImessagePayload {
  text?: string;
  publicKey?: string;
}
