import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { CreateComplaintDto } from '../dtos/create-complaint.dto';
import { ComplaintDetailsResponseDto } from '../dtos/compliant-details-response.dto';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { ChangeStatusDto } from '../dtos/change-status.dto';
import { IFindAllComplaintsResponse } from './responses.interface';

export interface IComplaintService {
  findOneById(complaintId: string): Promise<ComplaintDetailsResponseDto>;

  findComplaintByTaskId(taskId: string): Promise<ComplaintDetailsResponseDto>;

  createComplaint(
    taskId: string,
    userId: string,
    imageFiles: Express.Multer.File[],
    complaint: CreateComplaintDto,
  ): Promise<IBaseResponse>;
}

export interface IAdminComplaintService {
  findAll(query: GetDocsDto): Promise<IFindAllComplaintsResponse>;

  changeStatus(
    complaintId: string,
    dto: ChangeStatusDto,
  ): Promise<IBaseResponse>;
}
