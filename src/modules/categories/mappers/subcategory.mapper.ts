import { ISubCategory } from '../interfaces/subcategory.interface';
import { SubCategoryDocument } from '../schemas/subcategories.schema';

export class SubCategoryMapper {
  static toResponse(categoryDoc: SubCategoryDocument): ISubCategory {
    return {
      id: categoryDoc._id.toString(),
      name: categoryDoc.name,
      description: categoryDoc.description,
      image: categoryDoc.image,
      isActive: categoryDoc.isActive,
      slug: categoryDoc.slug,
      isDeleted: categoryDoc.isDeleted,
    };
  }
}
