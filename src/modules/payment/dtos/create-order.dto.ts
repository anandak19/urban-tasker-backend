import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  taskId: string;

  @IsOptional()
  tipAmount?: number;
}
