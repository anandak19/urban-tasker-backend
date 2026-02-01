import { AuthGuard } from '@core/guards/auth/auth.guard';
import { TaskerGuard } from '@core/guards/tasker-guard/tasker-guard.guard';
import { AddWorkCategoryDto } from '@modules/tasker/dtos/add-work-category.dto';
import { UpdateAboutDto } from '@modules/tasker/dtos/update-about.dto';
import type { ITaskerService } from '@modules/tasker/interfaces/tasker-services.interface';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@UseGuards(AuthGuard, TaskerGuard)
@Controller('tasker/account')
export class TaskerProfileController {
  /**
   * TODOS
   * 3. To Remove work category
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
  addTaskerWorkCategory(
    @Req() req: IAuthenticatedReqeust,
    @Body() dto: AddWorkCategoryDto,
  ) {
    return this._taskerService.addTaskerWorkCategory(
      req.user.id,
      dto.categoryId,
    );
  }

  // To Remove work category
  @Delete('work-categories/:categoryId')
  removeTaskerWorkCategory(
    @Req() req: IAuthenticatedReqeust,
    @Param('categoryId') categoryId: string,
  ) {
    console.log(categoryId);
    console.log(req.user.id);
    return this._taskerService.removeTaskerWorkCategory(
      req.user.id,
      categoryId,
    );
  }
}
