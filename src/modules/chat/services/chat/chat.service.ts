import { CHAT_TOKEN } from '@modules/chat/chat.token';
import type { IChatRepositories } from '@modules/chat/interfaces/chat-repositories.interface';
import { IChatService } from '@modules/chat/interfaces/chat-services.interface';
import { IChat, ICreateChat } from '@modules/chat/interfaces/chat.interface';
import { ChatMapper } from '@modules/chat/mappers/chat.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(CHAT_TOKEN.CHAT_REPOSITORY) private _chatRepo: IChatRepositories,
  ) {}

  //public methods
  findOneById(id: string): Promise<IChat> {
    console.log(id);
    throw new Error('Method not implemented.');
  }

  async create(senderId: string, receiverId: string): Promise<IChat> {
    // --check if the chat exists for this 2 users. if exists throw 'ChatAlreadyExistsError' domain error

    const newChat: ICreateChat = {
      participants: [senderId, receiverId].sort().map((id) => toObjectId(id)),
    };

    const savedChat = await this._chatRepo.create(newChat);
    // --if the chat is faild to save throw 'ChatCreateFailed' domain error
    if (!savedChat) {
      console.log(`[chat service]: faild to create chat`);
    }

    return ChatMapper.toChatResponse(savedChat);
  }

  async getChatRoomId(senderId: string, receiverId: string): Promise<string> {
    const participants = [senderId, receiverId]
      .sort()
      .map((id) => toObjectId(id));

    let roomId: string;

    const chatRoom =
      await this._chatRepo.findOneByParticipantsIds(participants);

    if (!chatRoom) {
      const newRoom = await this.create(senderId, receiverId);
      roomId = newRoom.id;
    } else {
      roomId = ChatMapper.toChatResponse(chatRoom).id;
    }

    return roomId;
  }

  //private methods
}
