import { ImageUploadInterceptor } from '@core/interceptors/image-upload/image-upload.interceptor';
import { COMPLIANTS_TOKENS } from '@modules/complaints/complaints-token';
import { CreateComplaintDto } from '@modules/complaints/dtos/create-complaint.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { IComplaintService } from '@modules/complaints/interfaces/complaints-services.interface';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';
import { AuthGuard } from '@core/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('bookings/:taskId/complaints')
export class ComplaintsController {
  constructor(
    @Inject(COMPLIANTS_TOKENS.COMPLIANTS_SERVICE)
    private _complaintService: IComplaintService,
  ) {}
  //create complaint
  @UseInterceptors(ImageUploadInterceptor('images', 2))
  @Post()
  createComplaint(
    @Param('taskId') taskId: string,
    @Req() req: IAuthenticatedReqeust,
    @UploadedFiles() files: Express.Multer.File[] | undefined,
    @Body() body: CreateComplaintDto,
  ) {
    console.log(files);
    console.log(body.complaint);
    return this._complaintService.createComplaint(
      taskId,
      req.user.id,
      files ?? [],
      body,
    );
  }

  @Get()
  findCompliantByTaskId(@Param('taskId') taskId: string) {
    console.log(taskId);
    return this._complaintService.findComplaintByTaskId(taskId);
  }
}
