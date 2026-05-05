import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateChatDto } from '../dto/create-chat.dto';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';
import { CHAT_TOKEN } from '../chat.token';
import type {
  IChatService,
  IMessageService,
} from '../interfaces/chat-services.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '@core/pipes/image-validation.pipe';
import 'multer';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    @Inject(CHAT_TOKEN.CHAT_SERVICE) private _chatService: IChatService,
    @Inject(CHAT_TOKEN.MESSAGE_SERVICE)
    private _messageService: IMessageService,
  ) {}

  @Post('room')
  createChat(
    @Body() dto: CreateChatDto,
    @Req() request: IAuthenticatedReqeust,
  ) {
    return this._chatService.getChatRoomId(request.user.id, dto.partnerId);
  }

  @Get()
  getChats(@Req() req: IAuthenticatedReqeust) {
    return this._chatService.findAllUserChats(req.user.id);
  }

  @Get(':roomId')
  getOneByRoom(
    @Req() req: IAuthenticatedReqeust,
    @Param('roomId') roomId: string,
  ) {
    return this._chatService.findOneById(roomId, req.user.id);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  saveMessageImage(
    @UploadedFile(ImageValidationPipe) imageFile: Express.Multer.File,
  ) {
    return this._messageService.uploadMessageImage(imageFile);
  }
}
