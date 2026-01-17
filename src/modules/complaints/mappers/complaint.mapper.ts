import { ComplaintDetailsResponseDto } from '../dtos/compliant-details-response.dto';
import { ListComplaintResponseDto } from '../dtos/list-complaints-response.dto';
import { IListComplaintRepoResult } from '../interfaces/complaints.interface';
import { ComplaintDocument } from '../schema/complaints.schema';

export class ComplaintMapper {
  static toComplaintDetailsResponse(
    complaintDoc: ComplaintDocument,
    imageUrls: string[],
  ): ComplaintDetailsResponseDto {
    return {
      complaint: complaintDoc.text,
      taskId: complaintDoc.taskId.toString(),
      imageUrls,
      adminFeedback: complaintDoc.adminFeedback,
      complaintStatus: complaintDoc.complaintStatus,
      id: complaintDoc._id.toString(),
      cmpId: complaintDoc.cmpId,
      // other fileds
    };
  }

  static toListResponse(
    data: IListComplaintRepoResult,
  ): ListComplaintResponseDto {
    const maxCharCount = 30;
    return {
      id: data._id.toString(),
      cmpId: data.cmpId,
      complaint:
        data.text.length > maxCharCount
          ? data.text.slice(0, maxCharCount) + '...'
          : data.text,
      complaintStatus: data.complaintStatus,
      createdBy: data.createdBy,
    };
  }
}
