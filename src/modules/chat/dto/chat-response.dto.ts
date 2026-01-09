import { ChatUserDto } from './chat-user.dto';

export class ChatResponseDto {
  id: string;
  partner: ChatUserDto;
}
