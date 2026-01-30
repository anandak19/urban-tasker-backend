import { AuthGuard } from '@core/guards/auth/auth.guard';
import { TaskerGuard } from '@core/guards/tasker-guard/tasker-guard.guard';
import { ImageValidationPipe } from '@core/pipes/image-validation.pipe';
import { CreatePortfolioImageDto } from '@modules/tasker/dtos/create-portfolio-image.dto';
import type { IPortfolioImageService } from '@modules/tasker/interfaces/tasker-services.interface';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@UseGuards(AuthGuard, TaskerGuard)
@Controller('tasker/account/portfolio')
export class PortfolioImageController {
  constructor(
    @Inject(TASKER_TOKEN.PORTFOLIO_SERVICE)
    private _portfolioService: IPortfolioImageService,
  ) {}
  /**
   * TODOS
   * 2. List all images of a tasker
   * 3. Remove a image
   */

  // Add image-- Not tested
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(ImageValidationPipe) file: Express.Multer.File,
    @Body() dto: CreatePortfolioImageDto,
    @Req() req: IAuthenticatedReqeust,
  ) {
    return this._portfolioService.create(file, dto, req.user.id);
  }
}
