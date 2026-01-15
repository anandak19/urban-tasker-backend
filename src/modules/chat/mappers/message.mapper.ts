import { IMessage } from '../interfaces/message.interface';
import { MessageDocument } from '../schema/message.schema';

export class MessageMapper {
  static toMessageResponse(
    messageDoc: MessageDocument,
    imageUrl?: string,
  ): IMessage {
    return {
      id: messageDoc._id.toString(),
      roomId: messageDoc.roomId,
      senderId: messageDoc.senderId.toString(),
      isRead: messageDoc.isRead,
      text: messageDoc.text,
      time: messageDoc.createdAt.toISOString(),
      type: messageDoc.type,
      imageUrl: imageUrl ?? '',
    };
  }
}
