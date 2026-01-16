import { OmitType } from '@nestjs/mapped-types';
import { ComplaintDetailsResponseDto } from './compliant-details-response.dto';

export class ListComplaintResponseDto extends OmitType(
  ComplaintDetailsResponseDto,
  ['imageUrls', 'adminFeedback', 'taskId'] as const,
) {
  createdBy: string;
}
