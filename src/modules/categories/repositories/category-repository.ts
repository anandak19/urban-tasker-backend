import { BaseRepository } from '@shared/repository/base.repository';
import { Category, CategoryDocument } from '../schemas/categories.schema';
import {
  ICategoryCard,
  ICreateCategory,
} from '../interfaces/category.interface';
import { ICategoryRepository } from '../interfaces/categories-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { IOptionData } from '@shared/interfaces/response-data.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';

export class CategoryRepository
  extends BaseRepository<CategoryDocument, ICreateCategory>
  implements ICategoryRepository
{
  constructor(
    @InjectModel(Category.name) private _categoryModel: Model<CategoryDocument>,
  ) {
    super(_categoryModel);
  }

  async getActiveCategoriesOptions(): Promise<IOptionData[]> {
    return await this._categoryModel.aggregate([
      {
        $match: {
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          label: '$name',
        },
      },
    ]);
  }

  async changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<CategoryDocument | null> {
    return await this.updateById(id, { $set: { isActive } });
  }

  async findAllCategories(
    categoryQuery: GetDocsDto,
  ): Promise<PaginatedResult<CategoryDocument>> {
    const options: IFindAllOptions = {
      page: categoryQuery?.page || 1,
      limit: categoryQuery?.limit,
    };

    const filter: FilterQuery<Category> = {};
    if (categoryQuery?.search) {
      filter.name = { $regex: categoryQuery.search, $options: 'i' };
    }
    return await this.findAll(options, filter);
  }

  async findByName(name: string): Promise<CategoryDocument | null> {
    return await this.findOne({ name });
  }

  async getActiveCategories(): Promise<ICategoryCard[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: { isDeleted: false, isActive: true },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          name: 1,
          image: 1,
        },
      },
    ];

    return await this._categoryModel.aggregate<ICategoryCard>(pipeline);
  }
}
