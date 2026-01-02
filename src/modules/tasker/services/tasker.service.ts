import { Inject, InternalServerErrorException } from '@nestjs/common';
import type { ITaskerService } from '../interfaces/tasker-services.interface';
import {
  ICreateTasker,
  IListTaskers,
  ITasker,
  ITaskerAbout,
  ITaskerCardData,
} from '../interfaces/tasker.interface';
import { TASKER_TOKEN } from '../tasker.token';
import type { ITaskerRepository } from '../interfaces/tasker-repositories.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { TaskerMapper } from '../mappers/tasker.mapper';
import { GetAvailableTaskersQueryDto } from '../dtos/get-available-taskers.dto';
import { IAvailTaskerQuery } from '../interfaces/tasker-requests.interface';
import { getWeekDayNumberFromDate } from '@shared/utility/time/convert-time.utitlity';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { ITaskerWorkCategoriesResponse } from '../interfaces/tasker-responses.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { USER_TOKENS } from '@modules/users/user-tokens';
import type { IUserService } from '@modules/users/interfaces/user-services.interface';

export class TaskerService implements ITaskerService {
  constructor(
    @Inject(TASKER_TOKEN.REPOSITORY) private _taskerRepo: ITaskerRepository,

    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
  ) {}

  async getTaskerCardData(taskerId: string): Promise<ITaskerCardData> {
    const tasker = await this._userService.findOne(taskerId);

    const cardData: ITaskerCardData = {
      city: tasker.homeAddress?.city || '',
      firstName: tasker.firstName,
      lastName: tasker.lastName,
      profileImageUrl: tasker.profileImageUrl,
    };

    return cardData;
  }

  async getTaskerAbout(taskerId: string): Promise<ITaskerAbout> {
    const tasker = await this._taskerRepo.findOne({
      _id: toObjectId(taskerId),
    });

    return { about: tasker?.about || '' };
  }

  getTaskerWorkCategories(
    taskerId: string,
  ): Promise<ITaskerWorkCategoriesResponse> {
    console.log(taskerId);
    throw new Error('Method not implemented.');
  }

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
      day: getWeekDayNumberFromDate(availQuery.date),
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
