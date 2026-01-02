import { AuthGuard } from '@core/guards/auth/auth.guard';
import { AddWorkCategoryDto } from '@modules/tasker/dtos/add-work-category.dto';
import { UpdateAboutDto } from '@modules/tasker/dtos/update-about.dto';
import type { ITaskerService } from '@modules/tasker/interfaces/tasker-services.interface';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@UseGuards(AuthGuard)
@Controller('tasker/account')
export class TaskerProfileController {
  /**
   * TODOS
   * 3. To get get work categories
   */
  constructor(
    @Inject(TASKER_TOKEN.SERVICE) private _taskerService: ITaskerService,
  ) {}

  // To get tasker card data
  @Get('card')
  getTaskerCardData(@Req() req: IAuthenticatedReqeust) {
    return this._taskerService.getTaskerCardData(req.user.id);
  }

  // To get about
  @Get('about')
  getTaskerAbout(@Req() req: IAuthenticatedReqeust) {
    return this._taskerService.getTaskerAbout(req.user.id);
  }

  // To update about
  @Patch('about')
  updateTaskerAbout(
    @Req() req: IAuthenticatedReqeust,
    @Body() dto: UpdateAboutDto,
  ) {
    console.log('Dto', dto);
    return this._taskerService.updateTaskerAbout(req.user.id, dto);
  }

  // To get get work categories
  @Get('work-categories')
  getTaskerWorkCategories(@Req() req: IAuthenticatedReqeust) {
    return this._taskerService.getTaskerWorkCategories(req.user.id);
  }

  // To add work categories
  @Patch('work-categories')
  addTaskerWorkCateories(
    @Req() req: IAuthenticatedReqeust,
    @Body() dto: AddWorkCategoryDto,
  ) {
    return this._taskerService.addTaskerWorkCategory(
      req.user.id,
      dto.categoryId,
    );
  }
}
