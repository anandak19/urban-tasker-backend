import { GetAvailableTaskersQueryDto } from '@modules/tasker/dtos/get-available-taskers.dto';
import type { ITaskerService } from '@modules/tasker/interfaces/tasker-services.interface';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import { Body, Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('tasker')
export class TaskerController {
  constructor(
    @Inject(TASKER_TOKEN.SERVICE) private _taskerService: ITaskerService,
  ) {}

  @Get('booking/available')
  getAvailableTaskers(@Query() query: GetAvailableTaskersQueryDto) {
    console.log(query.limit);

    return this._taskerService.getAvailbleTaskers(query);
  }
}
