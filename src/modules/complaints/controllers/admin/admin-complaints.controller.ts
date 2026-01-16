import { COMPLIANTS_TOKENS } from '@modules/complaints/complaints-token';
import { ChangeStatusDto } from '@modules/complaints/dtos/change-status.dto';
import type {
  IAdminComplaintService,
  IComplaintService,
} from '@modules/complaints/interfaces/complaints-services.interface';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

@Controller('admin/complaints')
export class AdminComplaintsController {
  constructor(
    @Inject(COMPLIANTS_TOKENS.COMPLIANTS_SERVICE)
    private _complaintService: IComplaintService,

    @Inject(COMPLIANTS_TOKENS.ADMIN_COMPLIANTS_SERVICE)
    private _adminComplaintService: IAdminComplaintService,
  ) {}

  @Get()
  findAll(@Query() query: GetDocsDto) {
    return this._adminComplaintService.findAll(query);
  }

  @Get(':complaintId')
  findCompliantById(@Param('complaintId') complaintId: string) {
    return this._complaintService.findOneById(complaintId);
  }

  @Patch(':complaintId/status')
  changeCompliantStatus(
    @Param('complaintId') complaintId: string,
    @Body() dto: ChangeStatusDto,
  ) {
    return this._adminComplaintService.changeStatus(complaintId, dto);
  }
}
