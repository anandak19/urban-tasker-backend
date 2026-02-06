import { BaseRepository } from '@shared/repository/base.repository';
import { Category, CategoryDocument } from '../schemas/categories.schema';
import { ICreateCategory } from '../interfaces/category.interface';
import { ICategoryRepository } from '../interfaces/categories-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOptionData } from '@shared/interfaces/response-data.interface';

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

  async findByName(name: string): Promise<CategoryDocument | null> {
    return await this.findOne({ name });
  }
}
