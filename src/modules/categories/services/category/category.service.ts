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
  NotFoundException,
} from '@nestjs/common';
import {
  CATEGORY_ERROR_MESSAGES,
  CATEGORY_SUCCESS_MESSAGES,
} from '@shared/constants/messages/category-messages.constants';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { type Express } from 'express';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject(CATEGORY_TOKEN.CATEGORY_REPOSITORY)
    private _categoryRepo: ICategoryRepository,

    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,

    @Inject(S3_SERVICE) private _s3: IS3Service,
  ) {}

  /**
   * To create new category
   * @param file
   * @param categoryData
   * @returns
   */
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

  /**
   * To get a category by its name
   * @param categoryName
   * @returns
   */
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

  /**
   * To find all categories (excluding deleted)
   * @param categoryQuery
   * @returns
   */
  async findAllCategories(
    categoryQuery?: GetDocsDto,
  ): Promise<IFindAllCategoryResponse> {
    const options: IFindAllOptions = {
      page: categoryQuery?.page || 1,
      limit: categoryQuery?.limit,
    };

    const result = await this._categoryRepo.findAll(options); // fix it
    if (!result || !result.documents || !result.meta) {
      throw new InternalServerErrorException(
        CATEGORY_ERROR_MESSAGES.FIND_ALL_FAILD,
      );
    }

    // pupulate image url and map response
    const categories = await Promise.all(
      result.documents.map(async (c) => {
        const category = CategoryMapper.toResponse(c);
        return await this.decorateWithImageUrl(category);
      }),
    );

    return {
      documents: categories,
      meta: result.meta,
    };
  }

  /**
   * Finds category by its id
   * @param id
   * @returns {Promise<ICategory | null>}
   */
  async findById(id: string): Promise<ICategory | null> {
    try {
      const category = await this._categoryRepo.findById(id);
      if (!category) {
        throw new NotFoundException(CATEGORY_ERROR_MESSAGES.NOT_FOUND);
      }

      const categoryObject = CategoryMapper.toResponse(category);

      return await this.decorateWithImageUrl(categoryObject);
    } catch (error) {
      this._logger.error('Error in finding category by id');
      this._logger.log(error as object);

      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  /**
   * Change is active status of category
   * @param id
   * @param isActive
   */
  async changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<ICategory | null> {
    try {
      const updatedCategory = await this._categoryRepo.changeIsActive(
        id,
        isActive,
      );

      if (!updatedCategory) {
        throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
      }
      this._logger.log(updatedCategory as object);

      const categoryObject = CategoryMapper.toResponse(updatedCategory);

      return await this.decorateWithImageUrl(categoryObject);
    } catch (error) {
      this._logger.error('Faild to update is active status');
      this._logger.log(error as object);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  /**
   * Delete a category by id
   * @param id
   * @returns - success message
   */
  async deleteById(id: string): Promise<IBaseResponse> {
    try {
      const deleted = await this._categoryRepo.deleteOneById(id);

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

  // PRIVATE METHODS
  /**
   * Takes raw category object with image key
   * returns category object with signed image URL
   * @param item
   * @returns {Promise<ICategory>} - object with signed image url
   */
  private async decorateWithImageUrl(item: ICategory): Promise<ICategory> {
    if (item.image) {
      item.image = await this._s3.getImageUrl(item.image);
    }
    return item;
  }
}
