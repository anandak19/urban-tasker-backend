import { BaseRepository } from '@shared/repository/base.repository';
import { Chat, ChatDocument } from '../schema/chat.schema';
import { ICreateChat } from '../interfaces/chat.interface';
import { Model } from 'mongoose';
import { IChatRepositories } from '../interfaces/chat-repositories.interface';
import { TObjectId } from '@shared/types/db-types';
import { InjectModel } from '@nestjs/mongoose';

export class ChatRepository
  extends BaseRepository<ChatDocument, ICreateChat>
  implements IChatRepositories
{
  constructor(@InjectModel(Chat.name) private _chatModal: Model<ChatDocument>) {
    super(_chatModal);
  }

  //public methods
  async findOneByParticipantsIds(
    participants: TObjectId[],
  ): Promise<ChatDocument | null> {
    return await this.findOne({
      participants: { $all: participants, $size: 2 },
    });
  }

  //private methods
}
