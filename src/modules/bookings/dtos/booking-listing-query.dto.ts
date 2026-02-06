import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '@shared/constants/enums/task.enum';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

export class GetBookingsDto extends GetDocsDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  taskStatus?: TaskStatus;
}
