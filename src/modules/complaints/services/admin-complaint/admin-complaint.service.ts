import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import { COMPLIANTS_TOKENS } from '@modules/complaints/complaints-token';
import { ChangeStatusDto } from '@modules/complaints/dtos/change-status.dto';
import type { IComplaintRepository } from '@modules/complaints/interfaces/complaints-repositories.interfaces';
import { IAdminComplaintService } from '@modules/complaints/interfaces/complaints-services.interface';
import { IFindAllComplaintsResponse } from '@modules/complaints/interfaces/responses.interface';
import { ComplaintMapper } from '@modules/complaints/mappers/complaint.mapper';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

@Injectable()
export class AdminComplaintService implements IAdminComplaintService {
  constructor(
    @Inject(COMPLIANTS_TOKENS.COMPLIANTS_REPOSITORY)
    private _complaintRepo: IComplaintRepository,

    @Inject(S3_SERVICE)
    private _s3Service: IS3Service,
  ) {}

  async changeStatus(
    complaintId: string,
    dto: ChangeStatusDto,
  ): Promise<IBaseResponse> {
    // return
    const updated = await this._complaintRepo.changeComplaintStatus(
      complaintId,
      dto,
    );

    if (!updated) {
      throw new InternalServerErrorException('Faild to update status');
    }

    return { message: 'Status updated' };
  }

  async findAll(query: GetDocsDto): Promise<IFindAllComplaintsResponse> {
    const result = await this._complaintRepo.findAllComplaints(query);
    const documents = result.documents.map((complaint) =>
      ComplaintMapper.toListResponse(complaint),
    );

    return { documents, meta: result.meta };
  }
}
