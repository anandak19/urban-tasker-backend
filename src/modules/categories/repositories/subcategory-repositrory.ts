import { BaseRepository } from '@shared/repository/base.repository';
import {
  SubCategory,
  SubCategoryDocument,
} from '../schemas/subcategories.schema';
import { ICreateSubCategory } from '../interfaces/subcategory.interface';
import { ISubCategoryRepository } from '../interfaces/categories-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDocument } from '../schemas/categories.schema';

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

  changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<CategoryDocument | null> {
    console.log(id);
    console.log(isActive);
    throw new Error('Method not implemented.');
  }
}
