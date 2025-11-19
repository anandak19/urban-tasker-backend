import { ImageValidationPipe } from '@core/pipes/image-validation.pipe';
import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import { ChangeIsActiveDto } from '@modules/categories/dtos/change-isactive.dto';
import { CreateSubCategoryDto } from '@modules/categories/dtos/create-subcategory.dto';
import { CategoryExistsGuard } from '@modules/categories/guards/category-exists/category-exists.guard';
import type { ISubCategoryService } from '@modules/categories/interfaces/categories-services.interface';
import { ICreateSubCategory } from '@modules/categories/interfaces/subcategory.interface';
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

@UseGuards(CategoryExistsGuard) // will check if the parent category exists or not
@Controller('admin/category/:id/subcategory')
export class SubCategoryAdminController {
  constructor(
    @Inject(CATEGORY_TOKEN.SUBCATEGORY_SERVICE)
    private _subCategoryService: ISubCategoryService,
  ) {}

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

  @Get()
  findAll(@Param('id') parentCategoryId: string, @Query() query: GetDocsDto) {
    return this._subCategoryService.findAllCategories(parentCategoryId, query);
  }

  @Get(':subCategoryId') // add aguard to check the is sub category exists
  findOne(@Param('subCategoryId') subCategoryId: string) {
    return this._subCategoryService.findById(subCategoryId);
  }

  @Patch(':subCategoryId/status') // add aguard to check the is sub category exists
  changeIsActive(
    @Param('subCategoryId') subCategoryId: string,
    @Body() isActiveDto: ChangeIsActiveDto,
  ) {
    return this._subCategoryService.changeIsActive(
      subCategoryId,
      isActiveDto.isActive,
    );
  }

  @Delete(':subCategoryId') // add aguard to check the is sub category exists
  deleteOne(@Param('subCategoryId') subCategoryId: string) {
    return this._subCategoryService.deleteById(subCategoryId);
  }
}
