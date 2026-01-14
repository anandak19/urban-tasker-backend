import { CHAT_TOKEN } from '@modules/chat/chat.token';
import { ChatResponseDto } from '@modules/chat/dto/chat-response.dto';
import type { IChatRepositories } from '@modules/chat/interfaces/chat-repositories.interface';
import type {
  IChatService,
  IMessageService,
} from '@modules/chat/interfaces/chat-services.interface';
import {
  IChat,
  IChatAggregationResult,
  ICreateChat,
} from '@modules/chat/interfaces/chat.interface';
import { ChatMapper } from '@modules/chat/mappers/chat.mapper';
import type { IUserService } from '@modules/users/interfaces/user-services.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(CHAT_TOKEN.CHAT_REPOSITORY) private _chatRepo: IChatRepositories,

    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,

    @Inject(CHAT_TOKEN.MESSAGE_SERVICE)
    private _messageService: IMessageService,
  ) {}

  //public methods
  async findOneById(id: string, myId: string): Promise<ChatResponseDto> {
    const result: IChatAggregationResult =
      await this._chatRepo.findOneByIdAndUserId(id, myId);

    if (result.partner.profileImage) {
      result.partner.profileImage = await this._userService.getUserImage(
        result.partner.profileImage,
      );
    }

    return ChatMapper.toListChatResponse(result);
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

  //http
  async getChatRoomId(
    senderId: string,
    receiverId: string,
  ): Promise<{ roomId: string }> {
    const participants = [senderId, receiverId]
      .sort()
      .map((id) => toObjectId(id));

    let roomId: string;

    const chatRoom =
      await this._chatRepo.findOneByParticipantsIds(participants);

    if (!chatRoom) {
      const newRoom = await this.create(senderId, receiverId);
      if (!newRoom) {
        throw new InternalServerErrorException(
          'Faild to create chat with user',
        );
      }
      roomId = newRoom.id;
    } else {
      roomId = ChatMapper.toChatResponse(chatRoom).id;
    }

    return { roomId };
  }

  async findAllUserChats(userId: string): Promise<ChatResponseDto[]> {
    console.log('service');
    const result: IChatAggregationResult[] =
      await this._chatRepo.findAllUserChats(userId);

    const response = await Promise.all(
      result.map(async (chat: IChatAggregationResult) => {
        if (chat.partner.profileImage) {
          chat.partner.profileImage = await this._userService.getUserImage(
            chat.partner.profileImage,
          );
        }

        chat.unReadMessageCount =
          await this._messageService.getUnreadmessageCount(
            chat._id.toString(),
            chat.partner._id.toString(),
          );

        return ChatMapper.toListChatResponse(chat);
      }),
    );

    console.log(response);

    return response;
  }

  //private methods
}
