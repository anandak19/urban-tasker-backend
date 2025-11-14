import { type ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import { type ICategoryRepository } from '@modules/categories/interfaces/categories-repositories.interface';
import { ICategoryService } from '@modules/categories/interfaces/categories-services.interface';
import type {
  ICategory,
  ICreateCategory,
} from '@modules/categories/interfaces/category.interface';
import {
  ICategoryResponse,
  IFindAllCategoryResponse,
} from '@modules/categories/interfaces/responses.interface';
import { CategoryMapper } from '@modules/categories/mappers/category.mapper';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CATEGORY_ERROR_MESSAGES,
  CATEGORY_SUCCESS_MESSAGES,
} from '@shared/constants/messages/category-messages.constants';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IPaginationQuery } from '@shared/interfaces/query.interface';
import { type Express } from 'express';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject(CATEGORY_TOKEN.CATEGORY_REPOSITORY)
    private _categoryRepo: ICategoryRepository,

    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,

    @Inject(S3_SERVICE) private _s3: IS3Service,
  ) {}

  async create(
    file: Express.Multer.File,
    categoryData: ICreateCategory,
  ): Promise<ICategoryResponse> {
    // Check if the category with same name exists, if exists throw error
    const existingCategory = await this.getCategoryByName(categoryData.name);
    if (existingCategory) {
      this._logger.warn('Category with same name exists');
      throw new ConflictException(CATEGORY_ERROR_MESSAGES.NAME_CONFLICT);
    }
    console.log(categoryData);

    // Upload image to s3 and get image key
    const imageKey = await this._s3.uploadCategoryImage(file);
    this._logger.verbose(`Uploaded image key is: ${imageKey}`);

    // Create new createCategory object with imageUrl and name
    const newCategory: ICreateCategory = {
      name: categoryData.name,
      image: imageKey,
    };

    try {
      //Call the method to create category from repo
      const savedCategory = await this._categoryRepo.create(newCategory);
      if (!savedCategory) {
        throw new InternalServerErrorException(
          CATEGORY_ERROR_MESSAGES.CREATE_FAILD,
        );
      }

      return {
        message: CATEGORY_SUCCESS_MESSAGES.CREATE_SUCCESS,
        category: CategoryMapper.toResponse(savedCategory),
      };
    } catch {
      this._logger.error('Error in adding new category');
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async getCategoryByName(categoryName: string): Promise<ICategory | null> {
    try {
      const category = await this._categoryRepo.findByName(categoryName);
      if (!category) return null;

      return CategoryMapper.toResponse(category);
    } catch (error) {
      this._logger.warn('Error in finding category by name');
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async findAllCategories(
    categoryQuery?: GetDocsDto,
  ): Promise<IFindAllCategoryResponse> {
    const pagination: IPaginationQuery | undefined = categoryQuery
      ? {
          page: categoryQuery.page,
          limit: categoryQuery.limit,
        }
      : undefined;

    const result = await this._categoryRepo.findAll(pagination);
    if (!result || !result.documents || !result.meta) {
      throw new InternalServerErrorException(
        CATEGORY_ERROR_MESSAGES.FIND_ALL_FAILD,
      );
    }

    // pupulate image url and map response
    const categories = await Promise.all(
      result.documents.map(async (c) => {
        const category = CategoryMapper.toResponse(c);
        if (category.image) {
          category.image = await this._s3.getImageUrl(c.image);
        }
        return category;
      }),
    );

    return {
      documents: categories,
      meta: result.meta,
    };
  }
}
