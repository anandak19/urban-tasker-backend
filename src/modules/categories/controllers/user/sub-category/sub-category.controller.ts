import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import type { ISubCategoryService } from '@modules/categories/interfaces/categories-services.interface';
import { Controller, Get, Inject, Param } from '@nestjs/common';

@Controller('category/:id/subcategory')
export class SubCategoryController {
  constructor(
    @Inject(CATEGORY_TOKEN.SUBCATEGORY_SERVICE)
    private _subCategoryService: ISubCategoryService,
  ) {}

  @Get('options')
  getActiveSubcategoriesOptions(@Param('id') categoryId: string) {
    return this._subCategoryService.getActiveSubCategoriesOptions(categoryId);
  }
}
