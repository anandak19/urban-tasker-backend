import { type ITaskerApplicationService } from '@modules/tasker-applications/interfaces/tasker-applications-services.interface';
import { TASKER_APPLICATION_TOKENS } from '@modules/tasker-applications/tasker-applications.token';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

@Controller('admin/tasker-applications')
export class TaskerApplicationsAdminController {
  constructor(
    @Inject(TASKER_APPLICATION_TOKENS.SERVICE)
    private _taskerApplicationService: ITaskerApplicationService,
  ) {}

  @Get()
  findAll(@Query() query: GetDocsDto) {
    return this._taskerApplicationService.findAll(query);
  }
}
