import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import { ImageValidationPipe } from '@core/pipes/image-validation.pipe';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import { CreateCategoryDto } from '@modules/categories/dtos/create-category.dto';
import type { ICategoryService } from '@modules/categories/interfaces/categories-services.interface';
import { ICreateCategory } from '@modules/categories/interfaces/category.interface';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { type Express } from 'express';

@Controller('admin/category')
export class CategoryAdminController {
  constructor(
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,

    @Inject(CATEGORY_TOKEN.CATEGORY_SERVICE)
    private _categoryService: ICategoryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createCategory(
    @UploadedFile(ImageValidationPipe)
    image: Express.Multer.File,
    @Body() body: CreateCategoryDto,
  ) {
    this._logger.verbose('[Category iamge] file uploaded');
    this._logger.log(image);
    this._logger.log(body);

    const createCategory: ICreateCategory = {
      name: body.name,
    };

    return this._categoryService.create(image, createCategory);
  }

  @Get()
  getCategories(@Query() categoryQuery: GetDocsDto) {
    console.log('The query is', categoryQuery);
    return this._categoryService.findAllCategories(categoryQuery);
  }
}
