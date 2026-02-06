import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schema/chat.schema';
import { Message, MessageSchema } from './schema/message.schema';
import { CHAT_TOKEN } from './chat.token';
import { ChatRepository } from './repository/chat.repository';
import { ChatService } from './services/chat/chat.service';
import { MessageRepository } from './repository/message.repository';
import { MessageService } from './services/message/message.service';
import { ChatController } from './controllers/chat.controller';
import { UsersModule } from '@modules/users/users.module';
import { S3Module } from '@core/lib/s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    UsersModule,
    S3Module,
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    { provide: CHAT_TOKEN.CHAT_REPOSITORY, useClass: ChatRepository },
    { provide: CHAT_TOKEN.CHAT_SERVICE, useClass: ChatService },
    { provide: CHAT_TOKEN.MESSAGE_REPOSITORY, useClass: MessageRepository },
    { provide: CHAT_TOKEN.MESSAGE_SERVICE, useClass: MessageService },
  ],
})
export class ChatModule {}
