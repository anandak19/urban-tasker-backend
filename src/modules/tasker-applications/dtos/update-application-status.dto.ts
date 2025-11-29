import { TaskerApplicationStatus } from '@shared/constants/enums/status.enum';
import { IsString } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsString()
  applicationStatus: TaskerApplicationStatus;

  @IsString()
  adminFeedback: string;
}
