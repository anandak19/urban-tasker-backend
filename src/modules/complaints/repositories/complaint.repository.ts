import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Complaint, ComplaintDocument } from '../schema/complaints.schema';
import { Model, PipelineStage } from 'mongoose';
import { BaseRepository } from '@shared/repository/base.repository';
import {
  ICreateComplaint,
  IListComplaintRepoResult,
} from '../interfaces/complaints.interface';
import { IComplaintRepository } from '../interfaces/complaints-repositories.interfaces';
import { ChangeStatusDto } from '../dtos/change-status.dto';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import {
  IFindAllAggregationResult,
  IFindAllOptions,
} from '@shared/interfaces/repository.interface';

@Injectable()
export class ComplaintRepository
  extends BaseRepository<ComplaintDocument, ICreateComplaint>
  implements IComplaintRepository
{
  constructor(
    @InjectModel(Complaint.name)
    private _complaintModal: Model<ComplaintDocument>,
  ) {
    super(_complaintModal);
  }
  // public
  async changeComplaintStatus(
    complaintId: string,
    dto: ChangeStatusDto,
  ): Promise<boolean> {
    const updated = await this.updateById(complaintId, {
      $set: dto,
    });

    return updated ? true : false;
  }

  async findAllComplaints(
    options: IFindAllOptions,
  ): Promise<PaginatedResult<IListComplaintRepoResult>> {
    console.log(options);

    const { page = 1, limit = 5 } = options;
    const skip = (page - 1) * limit;

    // [Facet Pipeline]
    const facetPipeline: PipelineStage.FacetPipelineStage[] = [
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 1,
          cmpId: 1,
          text: 1,
          complaintStatus: 1,
          createdAt: 1,
          createdBy: {
            $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'],
          },
        },
      },
    ];

    // [Main Pipeline]
    const mainPipeline: PipelineStage[] = [
      {
        $match: { isDeleted: false },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $facet: {
          data: facetPipeline,
          total: [{ $count: 'count' }],
        },
      },
    ];

    const [result] =
      await this._complaintModal.aggregate<
        IFindAllAggregationResult<IListComplaintRepoResult>
      >(mainPipeline);

    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    return {
      documents: data,
      meta: {
        total,
        limit,
        page,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
