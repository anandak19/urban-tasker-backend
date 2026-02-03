import { AdminGuard } from '@core/guards/admin.guard';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import {
  ImageValidationPipe,
  OptionalImageValidationPipe,
} from '@core/pipes/image-validation.pipe';
import { ValidateIdPipe } from '@core/pipes/validate-id/validate-id.pipe';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import { ChangeIsActiveDto } from '@modules/categories/dtos/change-isactive.dto';
import { CreateCategoryDto } from '@modules/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from '@modules/categories/dtos/update-category.dto';
import { CategoryExistsGuard } from '@modules/categories/guards/category-exists/category-exists.guard';
import type { ICategoryService } from '@modules/categories/interfaces/categories-services.interface';
import { ICreateCategory } from '@modules/categories/interfaces/category.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { type Express } from 'express';

@UseGuards(AuthGuard, AdminGuard)
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
    @Body() dto: CreateCategoryDto,
  ) {
    this._logger.verbose('[Category iamge] file uploaded');
    this._logger.log(image);
    this._logger.log(dto);

    const createCategory: ICreateCategory = {
      name: dto.name,
    };

    return this._categoryService.create(image, createCategory);
  }

  @Get()
  getCategories(@Query() categoryQuery: GetDocsDto) {
    console.log('The query is', categoryQuery);
    return this._categoryService.findAllCategories(categoryQuery);
  }

  @Get(':id')
  findById(@Param('id', ValidateIdPipe) id: string) {
    this._logger.verbose('Id of category is');
    this._logger.log(id);
    return this._categoryService.findById(id);
  }

  @Patch(':id')
  @UseGuards(CategoryExistsGuard)
  @UseInterceptors(FileInterceptor('image'))
  updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile(OptionalImageValidationPipe) imgFile?: Express.Multer.File,
  ) {
    return this._categoryService.updateCategoryById(id, dto, imgFile ?? null);
  }

  @Patch(':id/status')
  @UseGuards(CategoryExistsGuard)
  changeIsActive(
    @Param('id') id: string,
    @Body() isActiveDto: ChangeIsActiveDto,
  ) {
    this._logger.log(`Id to update status: ${id}`);
    return this._categoryService.changeIsActive(id, isActiveDto.isActive);
  }

  @Delete(':id')
  @UseGuards(CategoryExistsGuard)
  delete(@Param('id') id: string) {
    return this._categoryService.deleteById(id);
  }
}
