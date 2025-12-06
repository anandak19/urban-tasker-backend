import { Inject, InternalServerErrorException } from '@nestjs/common';
import type { ITaskerService } from '../interfaces/tasker-services.interface';
import { ICreateTasker, ITasker } from '../interfaces/tasker.interface';
import { TASKER_TOKEN } from '../tasker.token';
import type { ITaskerRepository } from '../interfaces/tasker-repositories.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { TaskerMapper } from '../mappers/tasker.mapper';

export class TaskerService implements ITaskerService {
  constructor(
    @Inject(TASKER_TOKEN.REPOSITORY) private _taskerRepo: ITaskerRepository,
  ) {}

  async create(taskerData: ICreateTasker): Promise<ITasker> {
    const newTasker = await this._taskerRepo.create(taskerData);

    if (!newTasker) {
      throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
    }

    return TaskerMapper.toResponse(newTasker);
  }
}
