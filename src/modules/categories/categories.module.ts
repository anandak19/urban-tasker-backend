import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/categories.schema';
import { SubCategory, SubCategorySchema } from './schemas/subcategories.schema';
import { CategoryRepository } from './repositories/category-repository';
import { CATEGORY_TOKEN } from './categories.token';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryAdminController } from './controllers/admin/category-admin.controller';
import { LoggerModule } from '@core/lib/logger/logger.module';
import { CategoryService } from './services/category/category.service';
import { S3Module } from '@core/lib/s3/s3.module';
import { CategoryExistsGuard } from './guards/category-exists/category-exists.guard';
import { SubCategoryRepository } from './repositories/subcategory-repositrory';
import { SubcategoryService } from './services/subcategory/subcategory.service';
import { SubCategoryAdminController } from './controllers/admin/sub-category-admin/sub-category-admin.controller';
import { CategoryController } from './controllers/user/category.controller';
import { SubCategoryController } from './controllers/user/sub-category/sub-category.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
    ]),
    LoggerModule,
    S3Module,
    // register multer module
    MulterModule.register(),
  ],
  controllers: [
    CategoryAdminController,
    SubCategoryAdminController,
    CategoryController,
    SubCategoryController,
  ],

  providers: [
    {
      provide: CATEGORY_TOKEN.CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
    {
      provide: CATEGORY_TOKEN.CATEGORY_SERVICE,
      useClass: CategoryService,
    },
    {
      provide: CATEGORY_TOKEN.SUBCATEGORY_REPOSITORY,
      useClass: SubCategoryRepository,
    },
    {
      provide: CATEGORY_TOKEN.SUBCATEGORY_SERVICE,
      useClass: SubcategoryService,
    },

    CategoryExistsGuard,
  ],
  exports: [
    CATEGORY_TOKEN.CATEGORY_SERVICE,
    CATEGORY_TOKEN.SUBCATEGORY_SERVICE,
  ],
})
export class CategoriesModule {}
