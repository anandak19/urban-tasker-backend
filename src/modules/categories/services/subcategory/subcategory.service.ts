import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import type { ISubCategoryRepository } from '@modules/categories/interfaces/categories-repositories.interface';
import { ISubCategoryService } from '@modules/categories/interfaces/categories-services.interface';
import { IUpdateCategory } from '@modules/categories/interfaces/category.interface';
import {
  IFindAllSubCategoryResponse,
  ISubCategoryResponse,
} from '@modules/categories/interfaces/responses.interface';
import {
  ICreateSubCategory,
  ISubCategory,
  ISubCategoryCard,
} from '@modules/categories/interfaces/subcategory.interface';
import { SubCategoryMapper } from '@modules/categories/mappers/subcategory.mapper';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CATEGORY_ERROR_MESSAGES,
  CATEGORY_SUCCESS_MESSAGES,
  SUBCATEGORY_ERROR_MESSAGES,
  SUBCATEGORY_SUCCESS_MESSAGES,
} from '@shared/constants/messages/category-messages.constants';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { IFindAllQuery } from '@shared/interfaces/query.interface';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { IOptionData } from '@shared/interfaces/response-data.interface';
import { TObjectId } from '@shared/types/db-types';
import { Types } from 'mongoose';
import 'multer';

@Injectable()
export class SubcategoryService implements ISubCategoryService {
  constructor(
    @Inject(CATEGORY_TOKEN.SUBCATEGORY_REPOSITORY)
    private _subCategoryRepo: ISubCategoryRepository,

    @Inject(S3_SERVICE) private _s3: IS3Service,

    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
  ) {}

  async getActiveSubCategoriesOptions(
    categoryId: string,
  ): Promise<IOptionData[]> {
    return await this._subCategoryRepo.getActiveSubCategoriesOptions(
      categoryId,
    );
  }

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

  async changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<ISubCategory | null> {
    try {
      const updatedCategory = await this._subCategoryRepo.changeIsActive(
        id,
        isActive,
      );

      if (!updatedCategory) {
        throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
      }

      const categoryObject = SubCategoryMapper.toResponse(updatedCategory);

      return await this.decorateWithImageUrl(categoryObject);
    } catch (error) {
      this._logger.error('Faild to update is active status');
      this._logger.log(error as object);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async deleteById(id: string): Promise<IBaseResponse> {
    try {
      const deleted = await this._subCategoryRepo.deleteOneById(id);
      if (!deleted) {
        throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
      }

      return { message: CATEGORY_SUCCESS_MESSAGES.DELETE_ONE_SUCCESS };
    } catch (error) {
      this._logger.error('Faild to delete one category');
      this._logger.log(error as object);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async findById(id: string): Promise<ISubCategory | null> {
    try {
      const category = await this._subCategoryRepo.findById(id);
      if (!category) {
        throw new NotFoundException(CATEGORY_ERROR_MESSAGES.NOT_FOUND);
      }

      const categoryObject = SubCategoryMapper.toResponse(category);

      return await this.decorateWithImageUrl(categoryObject);
    } catch (error) {
      this._logger.error('Error in finding category by id');
      this._logger.log(error as object);

      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async isActiveCategoryIds(ids: TObjectId[]): Promise<void> {
    try {
      const category =
        await this._subCategoryRepo.findActiveCategoriesById(ids);

      if (!category || category.length !== ids.length) {
        throw new BadRequestException(
          SUBCATEGORY_ERROR_MESSAGES.ALL_CATEGORY_INVALID,
        );
      }
    } catch (err) {
      this._logger.error('Faild to check category exists or not');
      console.log(err);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  /**
   * To get a category by its name
   * @param categoryName
   * @returns
   */
  async getCategoryByName(categoryName: string): Promise<ISubCategory | null> {
    try {
      const category = await this._subCategoryRepo.findByName(categoryName);
      if (!category) return null;

      return SubCategoryMapper.toResponse(category);
    } catch (error) {
      this._logger.warn('Error in finding category by name');
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  /**
   * To find all categories (excluding deleted)
   * @param categoryQuery
   * @returns
   */
  async findAllCategories(
    parentCategoryId: string,
    categoryQuery?: GetDocsDto,
  ): Promise<IFindAllSubCategoryResponse> {
    const filterQuery: IFindAllQuery | undefined = categoryQuery
      ? {
          page: categoryQuery.page,
          limit: categoryQuery.limit,
          search: categoryQuery.search,
        }
      : undefined;

    const result = await this._subCategoryRepo.findAllSubCategories(
      parentCategoryId,
      filterQuery,
    );

    if (!result || !result.documents || !result.meta) {
      throw new InternalServerErrorException(
        CATEGORY_ERROR_MESSAGES.FIND_ALL_FAILD,
      );
    }

    // pupulate image url and map response
    const categories = await Promise.all(
      result.documents.map(async (c) => {
        const category = SubCategoryMapper.toResponse(c);
        return await this.decorateWithImageUrl(category);
      }),
    );

    return {
      documents: categories,
      meta: result.meta,
    };
  }

  /**
   * Update subcategory by id
   * @param id
   * @param update
   * @param imagFile
   */
  async updateCategoryById(
    id: string,
    update: IUpdateCategory,
    imagFile: Express.Multer.File | null = null,
  ): Promise<ISubCategoryResponse> {
    if (imagFile) {
      const imageKey = await this._s3.uploadSubCategoryImage(imagFile);
      update.image = imageKey;
    }

    try {
      const updatedCategory = await this._subCategoryRepo.updateById(
        id,
        update,
      );
      if (!updatedCategory) {
        this._logger.log('No update returned');
        throw new InternalServerErrorException(
          SUBCATEGORY_ERROR_MESSAGES.UPDATE_FAILD,
        );
      }
      const categoryData = SubCategoryMapper.toResponse(updatedCategory);
      return {
        subcategory: await this.decorateWithImageUrl(categoryData),
        message: SUBCATEGORY_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
    } catch (error) {
      this._logger.error('Faild to update category');
      this._logger.log(error as object);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  /**
   * Get all sub active subcategories
   */
  async getAllActiveSubCategories(): Promise<ISubCategory[]> {
    const options: IFindAllOptions = {
      limit: Number.MAX_SAFE_INTEGER,
      page: 1,
      sort: { name: 1 },
    };

    const filter = {
      isActive: true,
    };

    try {
      const categories = await this._subCategoryRepo.findAll(options, filter);
      if (!categories)
        throw new InternalServerErrorException(
          SUBCATEGORY_ERROR_MESSAGES.FIND_ALL_FAILD,
        );
      return categories.documents.map((c) => SubCategoryMapper.toResponse(c));
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async getActiveSubCategories(
    categoryId: string,
  ): Promise<ISubCategoryCard[]> {
    const subcategories =
      await this._subCategoryRepo.getActiveSubCategories(categoryId);
    const result = Promise.all(
      subcategories.map(async (item) => {
        const imageUrl = await this._s3.getImageUrl(item.image);
        return { ...item, image: imageUrl };
      }),
    );
    return result;
  }

  // PRIVATE METHODS
  /**
   * Takes raw category object with image key
   * returns category object with signed image URL
   * @param item
   * @returns {Promise<ISubCategory>} - object with signed image url
   */
  private async decorateWithImageUrl(
    item: ISubCategory,
  ): Promise<ISubCategory> {
    if (item.image) {
      item.image = await this._s3.getImageUrl(item.image);
    }
    return item;
  }
}
