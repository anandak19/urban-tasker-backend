import { AuthGuard } from '@core/guards/auth/auth.guard';
import type { ITaskerService } from '@modules/tasker/interfaces/tasker-services.interface';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
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

  // To get get work categories
  @Get('work-categories')
  getTaskerWorkCategories() {}
}
