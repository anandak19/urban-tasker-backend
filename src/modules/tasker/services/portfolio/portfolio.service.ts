import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import { CreatePortfolioImageDto } from '@modules/tasker/dtos/create-portfolio-image.dto';
import { ICreatePortfolioImage } from '@modules/tasker/interfaces/portfolio-image.interface';
import type { IProfileImageRepository } from '@modules/tasker/interfaces/tasker-repositories.interface';
import { IPortfolioImageService } from '@modules/tasker/interfaces/tasker-services.interface';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

@Injectable()
export class PortfolioService implements IPortfolioImageService {
  constructor(
    @Inject(TASKER_TOKEN.PORTFOLIO_REPOSITORY)
    private _portfolioImageRepo: IProfileImageRepository,

    @Inject(S3_SERVICE) private _s3Service: IS3Service,
  ) {}

  findByTaskerId(taskerId: string) {
    console.log(taskerId);
    throw new Error('Method not implemented.');
  }

  async create(
    file: Express.Multer.File,
    dto: CreatePortfolioImageDto,
    userId: string,
  ): Promise<IBaseResponse> {
    const imageKey = await this._s3Service.uploadPortfolioImage(file);

    const payload: ICreatePortfolioImage = {
      publicId: imageKey,
      userId,
      caption: dto?.caption || '',
    };

    const savedData = await this._portfolioImageRepo.create(payload);

    if (!savedData) {
      throw new InternalServerErrorException('Faild to save image');
    }

    return { message: 'Successfully uploaded image' };
  }
}
