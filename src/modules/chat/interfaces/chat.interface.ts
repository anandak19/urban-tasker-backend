import { TObjectId } from '@shared/types/db-types';

export interface ICreateChat {
  participants: TObjectId[];
}

export interface IChat extends Omit<ICreateChat, 'participants'> {
  participants: string[];
  id: string;
  lastMessage: string;
}
