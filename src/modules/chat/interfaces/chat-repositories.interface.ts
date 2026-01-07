import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { ChatDocument } from '../schema/chat.schema';
import { ICreateChat } from './chat.interface';
import { MessageDocument } from '../schema/message.schema';
import { ICreateMessage } from './message.interface';
import { TObjectId } from '@shared/types/db-types';

export interface IChatRepositories
  extends IBaseRepository<ChatDocument, ICreateChat> {
  //methods
  findOneByParticipantsIds(
    participants: TObjectId[],
  ): Promise<ChatDocument | null>;
}

export interface IMessageRepositories
  extends IBaseRepository<MessageDocument, ICreateMessage> {
  markMessagesAsRead(roomId: string, senderId: string): Promise<boolean>;
}
