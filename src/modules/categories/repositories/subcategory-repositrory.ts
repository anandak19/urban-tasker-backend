import { BaseRepository } from '@shared/repository/base.repository';
import {
  SubCategory,
  SubCategoryDocument,
} from '../schemas/subcategories.schema';
import { ICreateSubCategory } from '../interfaces/subcategory.interface';
import { ISubCategoryRepository } from '../interfaces/categories-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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

  async findByName(name: string): Promise<SubCategoryDocument | null> {
    return await this.findOne({ name });
  }

  async changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<SubCategoryDocument | null> {
    return await this.updateById(id, { $set: { isActive } });
  }
}
