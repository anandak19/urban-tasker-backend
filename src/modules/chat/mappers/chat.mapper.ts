import { ChatResponseDto } from '../dto/chat-response.dto';
import { IChat, IChatAggregationResult } from '../interfaces/chat.interface';
import { ChatDocument } from '../schema/chat.schema';

export class ChatMapper {
  static toChatResponse(chatDoc: ChatDocument): IChat {
    return {
      id: chatDoc._id.toString(),
      lastMessage: chatDoc.lastMessage,
      participants: chatDoc.participants.map((id) => id.toString()),
    };
  }

  static toListChatResponse(chatData: IChatAggregationResult): ChatResponseDto {
    return {
      id: chatData._id.toString(),
      partner: {
        id: chatData._id.toString(),
        name: chatData.partner.firstName + ' ' + chatData.partner.lastName,
        image: chatData.partner.profileImage?.value || '',
      },
    };
  }
}
