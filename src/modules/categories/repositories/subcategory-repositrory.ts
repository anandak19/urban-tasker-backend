import { BaseRepository } from '@shared/repository/base.repository';
import {
  SubCategory,
  SubCategoryDocument,
} from '../schemas/subcategories.schema';
import {
  ICreateSubCategory,
  ISubCategoryCard,
} from '../interfaces/subcategory.interface';
import { ISubCategoryRepository } from '../interfaces/categories-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  InferRawDocType,
  Model,
  PipelineStage,
  Types,
} from 'mongoose';
import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { TObjectId } from '@shared/types/db-types';
import { IOptionData } from '@shared/interfaces/response-data.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

export class SubCategoryRepository
  extends BaseRepository<SubCategoryDocument, ICreateSubCategory>
  implements ISubCategoryRepository
{
  constructor(
    @InjectModel(SubCategory.name)
    private _subCategoryModel: Model<SubCategoryDocument>,
  ) {
    super(_subCategoryModel);
  }

  async getActiveSubCategoriesOptions(
    categoryId: string,
  ): Promise<IOptionData[]> {
    const categoryObjectId = toObjectId(categoryId);
    return await this._subCategoryModel.aggregate([
      {
        $match: {
          categoryId: categoryObjectId,
          isDeleted: false,
          isActive: true,
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

  async findAllSubCategories(
    parentCategoryId: string,
    filterQuery?: IFindAllQuery,
  ): Promise<PaginatedResult<SubCategoryDocument>> {
    const options: IFindAllOptions = {
      page: filterQuery?.page,
      limit: filterQuery?.limit,
    };

    // filter by subcategories of parent category
    const filter: FilterQuery<InferRawDocType<SubCategoryDocument>> = {
      categoryId: new Types.ObjectId(parentCategoryId),
    };

    if (filterQuery?.search) {
      filter.name = { $regex: filterQuery.search, $options: 'i' };
    }

    return await this.findAll(options, filter);
  }

  async findByName(name: string): Promise<SubCategoryDocument | null> {
    return await this.findOne({ name });
  }

  async changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<SubCategoryDocument | null> {
    return await this.updateById(id, { $set: { isActive } });
  }

  async findActiveCategoriesById(
    ids: TObjectId[],
  ): Promise<SubCategoryDocument[] | null> {
    return this.find({
      _id: { $in: ids },
      isActive: true,
      isDeleted: false,
    });
  }

  getActiveSubCategories(categoryId: string): Promise<ISubCategoryCard[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          categoryId: toObjectId(categoryId),
          isDeleted: false,
          isActive: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          name: 1,
          image: 1,
          description: 1,
        },
      },
    ];

    return this._subCategoryModel.aggregate<ISubCategoryCard>(pipeline);
  }
}
