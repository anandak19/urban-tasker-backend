import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import type {
  ICategoryService,
  ISubCategoryService,
} from '@modules/categories/interfaces/categories-services.interface';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('category')
export class CategoryController {
  constructor(
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
    @Inject(CATEGORY_TOKEN.CATEGORY_SERVICE)
    private _categoryService: ICategoryService,
    @Inject(CATEGORY_TOKEN.SUBCATEGORY_SERVICE)
    private _subcategoryService: ISubCategoryService,
  ) {}

  @Get()
  getActiveCategories() {
    return this._subcategoryService.getAllActiveSubCategories();
  }
}
