import { ChatResponseDto } from '../dto/chat-response.dto';
import { IChat } from './chat.interface';
import { IMessage } from './message.interface';

export interface IChatService {
  /**
   * Find the chat data from db by id
   * @param id - room id
   * @param myId - id of the loggedin user
   */
  findOneById(id: string, myId: string): Promise<ChatResponseDto>;

  // findAllByParticipant();
  create(senderId: string, receiverId: string): Promise<IChat>;

  //http
  getChatRoomId(
    senderId: string,
    receiverId: string,
  ): Promise<{ roomId: string }>;

  findAllUserChats(userId: string): Promise<ChatResponseDto[]>;
}

export interface IMessageService {
  findAllByRoomId(roomId: string): Promise<IMessage[]>;

  create(senderId: string, roomId: string, text: string): Promise<IMessage>;

  markMessagesAsRead(roomId: string, senderId: string): Promise<boolean>;

  getUnreadmessageCount(roomId: string, senderId: string): Promise<number>;

  uploadMessageImage(
    imageFile: Express.Multer.File,
  ): Promise<{ publicKey: string }>;
}
