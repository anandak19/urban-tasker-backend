import { TObjectId } from '@shared/types/db-types';

export interface ICreateMessage {
  senderId: TObjectId;
  roomId: string;
  text: string;
}

export interface IMessage extends Omit<ICreateMessage, 'senderId'> {
  senderId: string;
  isRead: boolean;
  id: string;
  time: string;
}
