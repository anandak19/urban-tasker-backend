import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import {
  ICreateComplaint,
  IListComplaintRepoResult,
} from './complaints.interface';
import { ComplaintDocument } from '../schema/complaints.schema';
import { ChangeStatusDto } from '../dtos/change-status.dto';
import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';

export interface IComplaintRepository
  extends IBaseRepository<ComplaintDocument, ICreateComplaint> {
  changeComplaintStatus(
    complaintId: string,
    dto: ChangeStatusDto,
  ): Promise<boolean>;

  findAllComplaints(
    query: IFindAllQuery,
  ): Promise<PaginatedResult<IListComplaintRepoResult>>;
}
