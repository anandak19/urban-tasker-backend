import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageType } from '../schema/message.schema';

export class SendMessageDto {
  /**
   * Common payload
   */
  @IsString()
  roomId: string;

  /**
   * Message type
   */
  @IsEnum(MessageType)
  type: MessageType;

  /**
   * Text message (required when type = TEXT)
   */
  @IsOptional()
  @IsString()
  message?: string;

  /**
   * S3 object key (required when type = IMAGE)
   */
  @IsOptional()
  @IsString()
  publicKey?: string;
}
