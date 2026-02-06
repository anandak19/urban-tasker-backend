import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTaskerApplicationDto } from '../dtos/create-tasker-application.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ICreateTaskerApplication } from '../interfaces/tasker-applications.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { MultiImageValidatorPipe } from '@core/pipes/multi-image-validator/multi-image-validator.pipe';
import { TASKER_APPLICATION_TOKENS } from '../tasker-applications.token';
import { type ITaskerApplicationService } from '../interfaces/tasker-applications-services.interface';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { UserId } from '@core/decorators/param/user-id.decorator';
import { CookiePayload } from '@core/decorators/param/cookie-payload.decorator';
import { type IPayload } from '@modules/auth/interfaces/auth.interface';
import { TokenRevocationGuard } from '@core/guards/TokenRevocation/token-revocation-guard.guard';

@Controller('tasker-applications')
export class TaskerApplicationsController {
  constructor(
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
    @Inject(TASKER_APPLICATION_TOKENS.SERVICE)
    private _taskerApplicationService: ITaskerApplicationService,
  ) {}
  // to create tasker application
  @UseGuards(AuthGuard, TokenRevocationGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'frontImage',
        maxCount: 1,
      },
      {
        name: 'backImage',
        maxCount: 1,
      },
    ]),
  )
  async create(
    @CookiePayload() payload: IPayload,
    @Body() dto: CreateTaskerApplicationDto,
    @UploadedFiles()
    files: {
      frontImage?: Express.Multer.File[];
      backImage?: Express.Multer.File[];
    },
  ) {
    const validatedFront = await new MultiImageValidatorPipe().transform(
      files.frontImage,
    );

    const validatedBack = await new MultiImageValidatorPipe().transform(
      files.backImage,
    );

    const frontImage = validatedFront[0];
    const backImage = validatedBack[0];

    const newTaskerApplication: ICreateTaskerApplication = {
      userId: payload.id,
      email: payload.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      hourlyRate: dto.hourlyRate,
      city: dto.city,
      workCategories: dto.workCategories,
      idProof: {
        idProofType: dto.idProofType,
        frontImage: frontImage,
        backImage: backImage,
      },
    };

    return this._taskerApplicationService.create(newTaskerApplication);
  }

  @UseGuards(AuthGuard, TokenRevocationGuard)
  @Get()
  getTaskerApplication(@UserId() userId: string) {
    return this._taskerApplicationService.getLoggedInUsersApplication(userId);
  }
}
