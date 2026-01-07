import { IMessage } from '../interfaces/message.interface';
import { MessageDocument } from '../schema/message.schema';

export class MessageMapper {
  static toMessageResponse(messageDoc: MessageDocument): IMessage {
    return {
      id: messageDoc._id.toString(),
      roomId: messageDoc.roomId,
      senderId: messageDoc.senderId.toString(),
      isRead: messageDoc.isRead,
      text: messageDoc.text,
    };
  }
}
