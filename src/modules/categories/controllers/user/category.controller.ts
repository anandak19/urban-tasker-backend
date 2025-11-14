import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import type { ICategoryService } from '@modules/categories/interfaces/categories-services.interface';
import { Controller, Inject } from '@nestjs/common';

@Controller('category')
export class CategoryController {
  constructor(
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
    @Inject(CATEGORY_TOKEN.CATEGORY_SERVICE)
    private _categoryService: ICategoryService,
  ) {}
}
