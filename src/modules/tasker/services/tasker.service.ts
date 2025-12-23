import { Inject, InternalServerErrorException } from '@nestjs/common';
import type { ITaskerService } from '../interfaces/tasker-services.interface';
import {
  ICreateTasker,
  IListTaskers,
  ITasker,
} from '../interfaces/tasker.interface';
import { TASKER_TOKEN } from '../tasker.token';
import type { ITaskerRepository } from '../interfaces/tasker-repositories.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { TaskerMapper } from '../mappers/tasker.mapper';
import { GetAvailableTaskersQueryDto } from '../dtos/get-available-taskers.dto';
import { IAvailTaskerQuery } from '../interfaces/tasker-requests.interface';
import { getDayFromDate } from '@shared/utility/time/convert-time.utitlity';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';

export class TaskerService implements ITaskerService {
  constructor(
    @Inject(TASKER_TOKEN.REPOSITORY) private _taskerRepo: ITaskerRepository,
  ) {}

  async getAvailbleTaskers(
    availQuery: GetAvailableTaskersQueryDto,
  ): Promise<PaginatedResult<IListTaskers>> {
    const query: IAvailTaskerQuery = {
      ...availQuery,
      city: availQuery.city,
      date: availQuery.date,
      latitude: availQuery.latitude,
      longitude: availQuery.longitude,
      subcategoryId: availQuery.subcategoryId,
      time: availQuery.time,
      day: getDayFromDate(availQuery.date),
    };

    const paginationQuery: IFindAllOptions = {
      limit: availQuery.limit,
      page: availQuery.page,
    };

    const result = await this._taskerRepo.getAvailbleTaskers(
      query,
      paginationQuery,
    );
    console.log(result);
    return result;
  }

  async create(taskerData: ICreateTasker): Promise<ITasker> {
    const newTasker = await this._taskerRepo.create(taskerData);

    if (!newTasker) {
      throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
    }

    return TaskerMapper.toResponse(newTasker);
  }
}
