import { BaseRepository } from '@shared/repository/base.repository';
import {
  SubCategory,
  SubCategoryDocument,
} from '../schemas/subcategories.schema';
import { ICreateSubCategory } from '../interfaces/subcategory.interface';
import { ISubCategoryRepository } from '../interfaces/categories-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, InferRawDocType, Model, Types } from 'mongoose';
import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { TObjectId } from '@shared/types/db-types';

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

  async findAllSubCategories(
    parentCategoryId: string,
    pagination?: IFindAllQuery,
  ): Promise<PaginatedResult<SubCategoryDocument>> {
    const options: IFindAllOptions = {
      page: pagination?.page,
      limit: pagination?.limit,
    };

    // filter by subcategories of parent category
    const filter: FilterQuery<InferRawDocType<SubCategoryDocument>> = {
      categoryId: new Types.ObjectId(parentCategoryId),
    };

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
}
