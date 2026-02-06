import { CATEGORY_TOKEN } from '@modules/categories/categories.token';
import type { ICategoryService } from '@modules/categories/interfaces/categories-services.interface';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CATEGORY_ERROR_MESSAGES } from '@shared/constants/messages/category-messages.constants';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import type { Request } from 'express';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class CategoryExistsGuard implements CanActivate {
  constructor(
    @Inject(CATEGORY_TOKEN.CATEGORY_SERVICE)
    private _categoryService: ICategoryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const id = request.params?.id;

    if (!id || !isValidObjectId(id)) {
      throw new BadRequestException(GENERAL_ERRORS.INVALID_ID);
    }

    const category = await this._categoryService.findById(id);
    if (!category) {
      throw new BadRequestException(CATEGORY_ERROR_MESSAGES.NOT_FOUND);
    }

    return true;
  }
}
