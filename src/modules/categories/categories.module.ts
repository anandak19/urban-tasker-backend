import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/categories.schema';
import { SubCategory, SubCategorySchema } from './schemas/subcategories.schema';
import { CategoryRepository } from './repositories/category-repository';
import { CATEGORY_TOKEN } from './categories.token';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: CATEGORY_TOKEN.CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
  ],
  exports: [],
})
export class CategoriesModule {}
