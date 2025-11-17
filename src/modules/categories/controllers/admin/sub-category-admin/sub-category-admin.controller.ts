import { ImageValidationPipe } from '@core/pipes/image-validation.pipe';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import { CreateSubCategoryDto } from '@modules/categories/dtos/create-subcategory.dto';
import { CategoryExistsGuard } from '@modules/categories/guards/category-exists/category-exists.guard';
import type { ISubCategoryService } from '@modules/categories/interfaces/categories-services.interface';
import { ICreateSubCategory } from '@modules/categories/interfaces/subcategory.interface';
import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(CategoryExistsGuard) // will check if the category exists or not
@Controller('admin/category/:id/subcategory')
export class SubCategoryAdminController {
  constructor(
    @Inject(CATEGORY_TOKEN.SUBCATEGORY_SERVICE)
    private _subCategoryService: ISubCategoryService,
  ) {}
  /**
   * TODOS
   * 1. Add route to add new subcategory under this category
   * 2. Add route to get all subcategories under this category
   * 3. Add route to change status of a subcategory
   * 4. Add route to delete a subcategory by its id
   */
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(ImageValidationPipe)
    image: Express.Multer.File,

    @Body() dto: CreateSubCategoryDto,
    @Param('id') categoryId: string,
  ) {
    const category: ICreateSubCategory = {
      categoryId,
      description: dto.description,
      name: dto.name,
    };
    return this._subCategoryService.create(image, category);
  }
}
