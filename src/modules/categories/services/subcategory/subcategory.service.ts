import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import type { ISubCategoryRepository } from '@modules/categories/interfaces/categories-repositories.interface';
import { ISubCategoryService } from '@modules/categories/interfaces/categories-services.interface';
import { ISubCategoryResponse } from '@modules/categories/interfaces/responses.interface';
import { ICreateSubCategory } from '@modules/categories/interfaces/subcategory.interface';
import { SubCategoryMapper } from '@modules/categories/mappers/subcategory.mapper';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  SUBCATEGORY_ERROR_MESSAGES,
  SUBCATEGORY_SUCCESS_MESSAGES,
} from '@shared/constants/messages/category-messages.constants';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { Types } from 'mongoose';

@Injectable()
export class SubcategoryService implements ISubCategoryService {
  constructor(
    @Inject(CATEGORY_TOKEN.SUBCATEGORY_REPOSITORY)
    private _subCategoryRepo: ISubCategoryRepository,

    @Inject(S3_SERVICE) private _s3: IS3Service,

    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
  ) {}

  async create(
    file: Express.Multer.File,
    categoryData: ICreateSubCategory,
  ): Promise<ISubCategoryResponse> {
    const existingSubCategory = await this._subCategoryRepo.findByName(
      categoryData.name,
    );
    if (existingSubCategory) {
      throw new ConflictException(SUBCATEGORY_ERROR_MESSAGES.NAME_CONFLICT);
    }

    const imageKey = await this._s3.uploadSubCategoryImage(file);
    categoryData.image = imageKey;
    categoryData.categoryId = new Types.ObjectId(categoryData.categoryId);

    try {
      const savedSubCategory = await this._subCategoryRepo.create(categoryData);

      if (!savedSubCategory) {
        throw new InternalServerErrorException(
          SUBCATEGORY_ERROR_MESSAGES.CREATE_FAILD,
        );
      }

      return {
        message: SUBCATEGORY_SUCCESS_MESSAGES.CREATE_SUCCESS,
        subcategory: SubCategoryMapper.toResponse(savedSubCategory),
      };
    } catch (error) {
      this._logger.error('Error in creating new category');
      this._logger.log(error as object);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }
}
