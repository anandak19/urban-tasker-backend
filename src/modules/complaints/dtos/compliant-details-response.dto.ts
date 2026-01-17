import { ComplaintStatus } from '@shared/constants/enums/complaint-status.enum';

export class ComplaintDetailsResponseDto {
  cmpId: string;
  id: string;
  complaint: string;
  taskId: string;
  imageUrls: string[];
  complaintStatus?: ComplaintStatus;
  adminFeedback?: string;
  // other fields
}
