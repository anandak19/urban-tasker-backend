import { ICategory } from '../interfaces/category.interface';
import { CategoryDocument } from '../schemas/categories.schema';

export class CategoryMapper {
  static toResponse(category: CategoryDocument): ICategory {
    return {
      id: category._id.toString(),
      name: category.name,
      image: category.image,
      isActive: category.isActive,
      slug: category.slug,
    };
  }
}
