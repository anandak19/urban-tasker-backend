import { ComplaintStatus } from '@shared/constants/enums/complaint-status.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChangeStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(ComplaintStatus, {
    message: 'Status must be a valid complaint status',
  })
  complaintStatus: ComplaintStatus;

  @IsOptional()
  @IsString()
  adminFeedback: string = '';
}
