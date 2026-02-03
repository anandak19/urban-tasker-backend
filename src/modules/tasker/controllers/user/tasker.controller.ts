import { GetAvailableTaskersQueryDto } from '@modules/tasker/dtos/get-available-taskers.dto';
import { GetPortfolioFilterDto } from '@modules/tasker/dtos/get-portfolio-filter.dto';
import type {
  IPortfolioImageService,
  ITaskerService,
} from '@modules/tasker/interfaces/tasker-services.interface';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Request,
} from '@nestjs/common';

@Controller('tasker')
export class TaskerController {
  constructor(
    @Inject(TASKER_TOKEN.SERVICE) private _taskerService: ITaskerService,
    @Inject(TASKER_TOKEN.PORTFOLIO_SERVICE)
    private _portfolioService: IPortfolioImageService,
  ) {}

  @Get('booking/available')
  getAvailableTaskers(@Query() query: GetAvailableTaskersQueryDto) {
    console.log(query.limit);
    return this._taskerService.getAvailbleTaskers(query);
  }

  @Get(':taskerId/card')
  getTaskerCardData(@Param('taskerId') taskerId: string) {
    return this._taskerService.getTaskerCardData(taskerId);
  }

  @Get(':taskerId/about')
  getTaskerAbout(@Param('taskerId') taskerId: string) {
    return this._taskerService.getTaskerAbout(taskerId);
  }

  @Get(':taskerId/work-categories')
  getTaskerWorkCategories(@Param('taskerId') taskerId: string) {
    return this._taskerService.getTaskerWorkCategories(taskerId);
  }

  @Get(':taskerId/portfolio')
  findAllPortfolioImages(
    @Param('taskerId') taskerId: string,
    @Query() query: GetPortfolioFilterDto,
  ) {
    return this._portfolioService.findAllByTaskerId(taskerId, query);
  }

  /**
   * TODOS
   * method to get taser portfolio
   */
}
