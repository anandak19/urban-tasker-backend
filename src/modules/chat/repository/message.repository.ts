import { BaseRepository } from '@shared/repository/base.repository';
import { Message, MessageDocument } from '../schema/message.schema';
import { Model } from 'mongoose';
import { ICreateMessage } from '../interfaces/message.interface';
import { InjectModel } from '@nestjs/mongoose';
import { IMessageRepositories } from '../interfaces/chat-repositories.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

export class MessageRepository
  extends BaseRepository<MessageDocument, ICreateMessage>
  implements IMessageRepositories
{
  constructor(
    @InjectModel(Message.name) private _messageModal: Model<MessageDocument>,
  ) {
    super(_messageModal);
  }

  //public methods
  async markMessagesAsRead(roomId: string, senderId: string): Promise<boolean> {
    return await this.updateMany(
      { roomId, senderId: toObjectId(senderId), isRead: false },
      { $set: { isRead: true } },
    );
  }

  async getUnreadMessageCount(
    roomId: string,
    senderId: string,
  ): Promise<number> {
    const count = await this._messageModal.countDocuments({
      roomId,
      senderId: toObjectId(senderId),
      isRead: false,
    });

    return count || 0;
  }

  //private methods
}
