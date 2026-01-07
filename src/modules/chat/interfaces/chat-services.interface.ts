import { IChat } from './chat.interface';
import { IMessage } from './message.interface';

export interface IChatService {
  /**
   * Find the chat data from db by id
   * @param id
   */
  findOneById(id: string): Promise<IChat>;

  // findAllByParticipant();
  create(senderId: string, receiverId: string): Promise<IChat>;

  getChatRoomId(senderId: string, receiverId: string): Promise<string>;
}

export interface IMessageService {
  findAllByRoomId(roomId: string): Promise<IMessage[]>;

  create(senderId: string, roomId: string, text: string): Promise<IMessage>;

  markMessagesAsRead(senderId: string, roomId: string): Promise<boolean>;
}
