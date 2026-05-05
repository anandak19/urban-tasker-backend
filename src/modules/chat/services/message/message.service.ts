import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import { CHAT_TOKEN } from '@modules/chat/chat.token';
import type { IMessageRepositories } from '@modules/chat/interfaces/chat-repositories.interface';
import type { IMessageService } from '@modules/chat/interfaces/chat-services.interface';
import {
  ICreateMessage,
  IMessage,
  ImessagePayload,
} from '@modules/chat/interfaces/message.interface';
import { MessageMapper } from '@modules/chat/mappers/message.mapper';
import {
  MessageDocument,
  MessageType,
} from '@modules/chat/schema/message.schema';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import 'multer';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @Inject(CHAT_TOKEN.MESSAGE_REPOSITORY)
    private _messageRepo: IMessageRepositories,

    @Inject(S3_SERVICE) private _s3Service: IS3Service,
  ) {}

  //public methods
  async create(
    senderId: string,
    roomId: string,
    type: MessageType,
    payload: ImessagePayload,
  ): Promise<IMessage> {
    if (type === MessageType.TEXT && !payload.text) {
      throw new Error('Text message must contain text');
    }

    if (type === MessageType.IMAGE && !payload.publicKey) {
      throw new Error('Image message must contain public key');
    }

    const newMessage: ICreateMessage = {
      senderId: toObjectId(senderId),
      roomId,
      type,
      ...(payload.text && { text: payload.text }),
      ...(payload.publicKey && { publicKey: payload.publicKey }),
    };

    const savedMessage = await this._messageRepo.create(newMessage);
    if (!savedMessage) {
      console.log(`[Message Service]: Massage faild to save`);
    }

    if (savedMessage.type === MessageType.IMAGE && savedMessage.publicKey) {
      const signedUrl = await this._s3Service.getImageUrl(
        savedMessage.publicKey,
      );
      return MessageMapper.toMessageResponse(savedMessage, signedUrl);
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

    const mappedMessages = await Promise.all(
      result.documents.map(async (message: MessageDocument) => {
        // Image message → attach signed URL
        if (message.type === MessageType.IMAGE && message.publicKey) {
          const signedUrl = await this._s3Service.getImageUrl(
            message.publicKey,
          );

          return MessageMapper.toMessageResponse(message, signedUrl);
        }

        // Text message
        return MessageMapper.toMessageResponse(message);
      }),
    );

    return mappedMessages;
  }

  //http
  async uploadMessageImage(
    imageFile: Express.Multer.File,
  ): Promise<{ publicKey: string }> {
    const imageKey = await this._s3Service.uploadMessageImage(imageFile);

    if (!imageKey) {
      throw new InternalServerErrorException('Faild to upload image');
    }

    return { publicKey: imageKey };
  }

  async markMessagesAsRead(roomId: string, senderId: string): Promise<boolean> {
    return await this._messageRepo.markMessagesAsRead(roomId, senderId);
  }

  async getUnreadmessageCount(
    roomId: string,
    senderId: string,
  ): Promise<number> {
    return await this._messageRepo.getUnreadMessageCount(roomId, senderId);
  }

  //private methods
}
