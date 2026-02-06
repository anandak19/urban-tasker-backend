import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import {
  GENERAL_ERRORS,
  USER_ERRORS,
} from '@shared/constants/messages/error-messaes.constants';
import { TaskerMapper } from '../mappers/tasker.mapper';
import { GetAvailableTaskersQueryDto } from '../dtos/get-available-taskers.dto';
import { IAvailTaskerQuery } from '../interfaces/tasker-requests.interface';
import { getWeekDayNumberFromDate } from '@shared/utility/time/convert-time.utitlity';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { USER_TOKENS } from '@modules/users/user-tokens';
import type { IUserService } from '@modules/users/interfaces/user-services.interface';
import { UpdateAboutDto } from '../dtos/update-about.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { IOptionData } from '@shared/interfaces/response-data.interface';

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
      userId: toObjectId(taskerId),
    });

    if (!tasker) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }

    return { about: tasker?.about || '' };
  }

  async getTaskerWorkCategories(taskerId: string): Promise<IOptionData[]> {
    return await this._taskerRepo.getTaskerWorkCategories(taskerId);
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

  async updateTaskerAbout(
    taskerId: string,
    aboutData: UpdateAboutDto,
  ): Promise<IBaseResponse> {
    console.log('Reached service');
    console.log(aboutData);
    console.log(aboutData.about);

    const newAbout: ITaskerAbout = {
      about: aboutData.about,
    };

    console.log('new about on boad', newAbout);

    const updatedTasker = await this._taskerRepo.updateByTaskerId(
      taskerId,
      newAbout,
    );

    if (!updatedTasker) {
      throw new InternalServerErrorException('Faild to update the about');
    }

    return { message: 'Updated tasker about' };
  }

  async addTaskerWorkCategory(
    taskerId: string,
    categoryId: string,
  ): Promise<IBaseResponse> {
    const isAdded = await this._taskerRepo.addWorkCategoryByTaskerId(
      taskerId,
      categoryId,
    );

    if (!isAdded) {
      throw new NotFoundException('Tasker not found and no category added');
    }

    return { message: 'Added Category' };
  }

  async removeTaskerWorkCategory(
    taskerId: string,
    categoryId: string,
  ): Promise<IBaseResponse> {
    const isUpdated = await this._taskerRepo.removeTaskerWorkCategoryByTaskerId(
      taskerId,
      categoryId,
    );

    if (!isUpdated) {
      throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
    }

    return { message: 'Successfully removed category' };
  }

  async findByUserId(userId: string): Promise<ITasker> {
    const result = await this._taskerRepo.findOne({
      userId: toObjectId(userId),
    });
    if (!result) {
      throw new NotFoundException('Tasker not found');
    }
    return TaskerMapper.toResponse(result);
  }
}
