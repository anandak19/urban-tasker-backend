import { BaseRepository } from '@shared/repository/base.repository';
import {
  TaskerApplication,
  TaskerApplicationDocument,
} from '../schemas/tasker-application.schema';
import {
  ICreateTaskerApplication,
  ITaskerApplication,
} from '../interfaces/tasker-applications.interface';
import { ITaskerApplicationRepository } from '../interfaces/tasker-applications-repositories.interface';
import { Model, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TFilter } from '@shared/types/db-types';

export class TaskerApplicationRepository
  extends BaseRepository<TaskerApplicationDocument, ICreateTaskerApplication>
  implements ITaskerApplicationRepository
{
  constructor(
    @InjectModel(TaskerApplication.name)
    private _taskerApplicationModel: Model<TaskerApplicationDocument>,
  ) {
    super(_taskerApplicationModel);
  }

  changeStatus(id: string) {
    console.log(id);
    throw new Error('Method not implemented.');
  }

  async findOneTaskerApplication(
    filter: TFilter<TaskerApplicationDocument>,
  ): Promise<ITaskerApplication | null> {
    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'workCategories',
          foreignField: '_id',
          as: 'workCategories',
        },
      },
      // project
      {
        $project: {
          _id: 0,
          firstName: 1,
          lastName: 1,
          city: 1,
          hourlyRate: 1,

          applicationStatus: 1,
          adminFeedback: 1,

          idProof: {
            idProofType: '$idProof.idProofType',
            frontImage: '$idProof.frontImage',
            backImage: '$idProof.backImage',
          },

          workCategories: {
            $map: {
              input: '$workCategories',
              as: 'c',
              in: {
                id: '$$c._id',
                name: '$$c.name',
              },
            },
          },
        },
      },
    ];

    const result = await this._taskerApplicationModel.aggregate(pipeline);

    return result.length ? (result[0] as ITaskerApplication) : null;
  }
}
