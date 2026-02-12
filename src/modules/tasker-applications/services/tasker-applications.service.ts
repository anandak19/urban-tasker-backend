import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ITaskerApplicationService } from '../interfaces/tasker-applications-services.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import {
  IApplicationStatusInfo,
  ICreateTaskerApplication,
  ITaskerApplication,
} from '../interfaces/tasker-applications.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { type IS3Service } from '@core/lib/s3/s3.interface';
import { TASKER_APPLICATION_TOKENS } from '../tasker-applications.token';
import { type ITaskerApplicationRepository } from '../interfaces/tasker-applications-repositories.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import {
  TASKER_APPLICATION_ERROR_MESSAGES,
  TASKER_APPLICATION_SUCCESS_MESSAGES,
} from '@shared/constants/messages/tasker-application-messages.constants';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import { type ISubCategoryService } from '@modules/categories/interfaces/categories-services.interface';
import { TObjectId } from '@shared/types/db-types';
import { SUBCATEGORY_ERROR_MESSAGES } from '@shared/constants/messages/category-messages.constants';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import { type ILoggerService } from '@core/lib/logger/logger.interface';
import { IFindAllQuery } from '@shared/interfaces/query.interface';
import { IFindAllTaskerApplicationResponse } from '../interfaces/api-responses.interface';
import { TaskerApplicationMapper } from '../mappers/tasker-application.mapper';
import { TaskerApplicationStatus } from '@shared/constants/enums/status.enum';
import { USER_TOKENS } from '@modules/users/user-tokens';
import type { IAdminUserService } from '@modules/users/interfaces/user-services.interface';
import { UserRoles } from '@shared/constants/enums/user.enum';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import { type ITaskerService } from '@modules/tasker/interfaces/tasker-services.interface';
import { ICreateTasker } from '@modules/tasker/interfaces/tasker.interface';

@Injectable()
export class TaskerApplicationsService implements ITaskerApplicationService {
  constructor(
    @Inject(S3_SERVICE) private _s3: IS3Service,
    @Inject(TASKER_APPLICATION_TOKENS.REPOSITORY)
    private _taskerApplicationRepo: ITaskerApplicationRepository,

    @Inject(CATEGORY_TOKEN.SUBCATEGORY_SERVICE)
    private _subcategoryService: ISubCategoryService,

    @Inject(USER_TOKENS.ADMIN_USER_SERVICE)
    private _adminUserService: IAdminUserService,

    @Inject(TASKER_TOKEN.SERVICE) private _taskerService: ITaskerService,

    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
  ) {}

  /**
   * To create tasker application
   * @param taskerApplication
   * @returns
   */
  async create(
    taskerApplication: ICreateTaskerApplication,
  ): Promise<IBaseResponse> {
    const frontImage = taskerApplication.idProof
      .frontImage as Express.Multer.File;
    const backImage = taskerApplication.idProof
      .backImage as Express.Multer.File;

    const userObjectId = toObjectId(taskerApplication.userId as string);
    if (!userObjectId) {
      throw new BadRequestException(GENERAL_ERRORS.INVALID_ID);
    }

    // convert the array of string ids to object ids in workcategories
    const validatedCategoryIds = await this.validateAndConvertWorkCategories(
      taskerApplication.workCategories as string[],
    );

    try {
      const [frontImageKey, backImageKey] = await Promise.all([
        this._s3.uploadIdProofImage(frontImage),
        this._s3.uploadIdProofImage(backImage),
      ]);

      const payload: ICreateTaskerApplication = {
        ...taskerApplication,
        userId: userObjectId,
        workCategories: validatedCategoryIds,
        idProof: {
          idProofType: taskerApplication.idProof.idProofType,
          backImage: backImageKey,
          frontImage: frontImageKey,
        },
      };

      await this._taskerApplicationRepo.create(payload);

      return { message: TASKER_APPLICATION_SUCCESS_MESSAGES.CREATE_SUCCESS };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  /**
   * Returns the tasker application of logged in user
   * @param userId
   * @returns
   */
  async getLoggedInUsersApplication(
    userId: string,
  ): Promise<ITaskerApplication> {
    try {
      const userObjectId = toObjectId(userId);
      if (!userObjectId) {
        throw new BadRequestException(GENERAL_ERRORS.ERROR);
      }

      const taskerApplication: ITaskerApplication | null =
        await this._taskerApplicationRepo.findOneTaskerApplication({
          userId: userObjectId,
          isDeleted: false,
        });

      if (!taskerApplication) {
        throw new NotFoundException(
          TASKER_APPLICATION_ERROR_MESSAGES.NOT_FOUND,
        );
      }

      return await this.populateImages(taskerApplication);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async findById(id: string): Promise<ITaskerApplication> {
    try {
      const objectId = toObjectId(id);
      if (!objectId) {
        throw new BadRequestException(GENERAL_ERRORS.INVALID_ID);
      }
      const application =
        await this._taskerApplicationRepo.findOneTaskerApplication({
          _id: objectId,
        });

      if (!application) {
        throw new NotFoundException(
          TASKER_APPLICATION_ERROR_MESSAGES.NOT_FOUND,
        );
      }

      return await this.populateImages(application);
    } catch {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  /**
   * Returns all tasker applications
   * @param query
   */
  async findAll(
    query: IFindAllQuery,
  ): Promise<IFindAllTaskerApplicationResponse> {
    try {
      const result =
        await this._taskerApplicationRepo.findAllApplications(query);

      if (!result) {
        throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
      }

      const applications = result.documents.map((a) => {
        return TaskerApplicationMapper.toListingResponse(a);
      });

      return {
        documents: applications,
        meta: result.meta,
      };
    } catch {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  /**
   * Update status with feedback(optional)
   * @param statusInfo
   */
  async updateStatus(
    applicationId: string,
    statusInfo: IApplicationStatusInfo,
  ): Promise<IBaseResponse> {
    try {
      // if the status is aprove in request, throw error
      if (statusInfo.applicationStatus === TaskerApplicationStatus.APPROVED) {
        throw new BadRequestException(
          TASKER_APPLICATION_ERROR_MESSAGES.INVALID_REQUEST,
        );
      }

      // checks if the status is already approved
      const isApproved = await this.isApplicationApproved(applicationId);
      if (isApproved) {
        throw new BadRequestException(
          TASKER_APPLICATION_ERROR_MESSAGES.ALREADY_APPROVED,
        );
      }

      // update status
      const updated = await this._taskerApplicationRepo.updateById(
        applicationId,
        statusInfo,
      );

      if (!updated) {
        throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
      }

      return { message: 'Update success' };
    } catch (err) {
      this._logger.error('Error in update');
      console.log(err);

      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async approveApplication(applicationId: string): Promise<IBaseResponse> {
    try {
      // checks if already approved, so stop repeating further process
      const isApproved = await this.isApplicationApproved(applicationId);
      if (isApproved) {
        throw new BadRequestException(
          TASKER_APPLICATION_ERROR_MESSAGES.ALREADY_APPROVED,
        );
      }

      // approve application
      const approvedApplication = await this._taskerApplicationRepo.updateById(
        applicationId,
        {
          applicationStatus: TaskerApplicationStatus.APPROVED,
          adminFeedback: '',
        },
      );

      if (!approvedApplication) {
        throw new InternalServerErrorException(
          TASKER_APPLICATION_ERROR_MESSAGES.APPROVE_FAILD,
        );
      }

      // change role to tasker
      await this._adminUserService.changeUserRoleById(
        approvedApplication.userId,
        UserRoles.TASKER,
      );

      // create tasker doc in db
      const newTaker: ICreateTasker = {
        userId: approvedApplication.userId,
        city: approvedApplication.city,
        hourlyRate: approvedApplication.hourlyRate,
        workCategories: approvedApplication.workCategories,
      };
      await this._taskerService.create(newTaker);

      return { message: TASKER_APPLICATION_SUCCESS_MESSAGES.APPROVE_SUCCESS };
    } catch (error) {
      this._logger.error('Error in aproving');
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  private async isApplicationApproved(applicationId: string): Promise<boolean> {
    try {
      const application =
        await this._taskerApplicationRepo.findById(applicationId);

      if (!application) {
        throw new NotFoundException(
          TASKER_APPLICATION_ERROR_MESSAGES.NOT_FOUND,
        );
      }

      return application.applicationStatus === TaskerApplicationStatus.APPROVED;
    } catch {
      this._logger.error('Error in checking application is approved');
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  /**
   * Converts each ids to object ids
   * Validate each work categories with db
   * @param ids
   * @returns array of validated category object ids
   */
  private async validateAndConvertWorkCategories(ids: string[]) {
    // if the ids is emtpy of not array throw error
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException(
        SUBCATEGORY_ERROR_MESSAGES.CATEGOY_MIN_REQUIRED,
      );
    }

    // convert all string ids to object after validating id type
    const objectIds: TObjectId[] = [];
    for (const id of ids) {
      const objectId = toObjectId(id);
      if (!objectId) {
        throw new BadRequestException(GENERAL_ERRORS.INVALID_ID);
      }
      objectIds.push(objectId);
    }

    // call the method to check all ids are exists in db
    await this._subcategoryService.isActiveCategoryIds(objectIds);

    return objectIds;
  }

  /**
   * Populate the doc with actual signed image url of front and back id proofs
   * @param taskerApplication
   * @returns {Promise<taskerApplication>}
   */
  private async populateImages(
    taskerApplication: ITaskerApplication,
  ): Promise<ITaskerApplication> {
    try {
      const frontImageUrl = await this._s3.getImageUrl(
        taskerApplication.idProof.frontImage as string,
      );

      const backImageUrl = await this._s3.getImageUrl(
        taskerApplication.idProof.backImage as string,
      );

      return {
        ...taskerApplication,
        idProof: {
          idProofType: taskerApplication.idProof.idProofType,
          frontImage: frontImageUrl,
          backImage: backImageUrl,
        },
      };
    } catch {
      this._logger.verbose('Error occured while fetching url');
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }
}
