import { AdminGuard } from '@core/guards/admin.guard';
import { UpdateApplicationStatusDto } from '@modules/tasker-applications/dtos/update-application-status.dto';
import { type ITaskerApplicationService } from '@modules/tasker-applications/interfaces/tasker-applications-services.interface';
import { TASKER_APPLICATION_TOKENS } from '@modules/tasker-applications/tasker-applications.token';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

@UseGuards(AuthGuard, AdminGuard)
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

  @Get(':applicationId')
  findOne(@Param('applicationId') applicationId: string) {
    return this._taskerApplicationService.findById(applicationId);
  }

  @Patch(':applicationId/status')
  updateStatus(
    @Param('applicationId') applicationId: string,
    @Body() statusInfo: UpdateApplicationStatusDto,
  ) {
    console.log(statusInfo);

    return this._taskerApplicationService.updateStatus(
      applicationId,
      statusInfo,
    );
  }

  @Patch(':applicationId/approve')
  approveApplication(@Param('applicationId') applicationId: string) {
    return this._taskerApplicationService.approveApplication(applicationId);
  }
}
