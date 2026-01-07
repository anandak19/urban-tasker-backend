import { CHAT_TOKEN } from '@modules/chat/chat.token';
import type { IMessageRepositories } from '@modules/chat/interfaces/chat-repositories.interface';
import type { IMessageService } from '@modules/chat/interfaces/chat-services.interface';
import {
  ICreateMessage,
  IMessage,
} from '@modules/chat/interfaces/message.interface';
import { MessageMapper } from '@modules/chat/mappers/message.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @Inject(CHAT_TOKEN.MESSAGE_REPOSITORY)
    private _messageRepo: IMessageRepositories,
  ) {}

  //public methods
  async create(
    senderId: string,
    roomId: string,
    text: string,
  ): Promise<IMessage> {
    const newMessage: ICreateMessage = {
      senderId: toObjectId(senderId),
      roomId,
      text,
    };

    const savedMessage = await this._messageRepo.create(newMessage);
    if (!savedMessage) {
      console.log(`[Message Service]: Massage faild to save`);
    }

    return MessageMapper.toMessageResponse(savedMessage);
  }

  async findAllByRoomId(roomId: string): Promise<IMessage[]> {
    const options: IFindAllOptions = {
      limit: 30,
      page: 1,
      sort: { createdAt: 1 },
    };

    const filter = {
      roomId,
    };

    const result = await this._messageRepo.findAll(options, filter);
    console.log('res');
    console.log(result);

    return result.documents.length
      ? result.documents.map((message) =>
          MessageMapper.toMessageResponse(message),
        )
      : [];
  }

  async markMessagesAsRead(senderId: string, roomId: string): Promise<boolean> {
    return await this._messageRepo.markMessagesAsRead(roomId, senderId);
  }

  //private methods
}
