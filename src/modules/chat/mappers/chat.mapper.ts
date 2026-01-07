import { IChat } from '../interfaces/chat.interface';
import { ChatDocument } from '../schema/chat.schema';

export class ChatMapper {
  static toChatResponse(chatDoc: ChatDocument): IChat {
    return {
      id: chatDoc._id.toString(),
      lastMessage: chatDoc.lastMessage,
      participants: chatDoc.participants.map((id) => id.toString()),
    };
  }
}
