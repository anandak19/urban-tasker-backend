import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import { CreatePortfolioImageDto } from '@modules/tasker/dtos/create-portfolio-image.dto';
import { GetPortfolioFilterDto } from '@modules/tasker/dtos/get-portfolio-filter.dto';
import { PortfolioResponseDto } from '@modules/tasker/dtos/portfolio-response.dto';
import { ICreatePortfolioImage } from '@modules/tasker/interfaces/portfolio-image.interface';
import type { IProfileImageRepository } from '@modules/tasker/interfaces/tasker-repositories.interface';
import { IPortfolioImageService } from '@modules/tasker/interfaces/tasker-services.interface';
import { PortfolioImageMapper } from '@modules/tasker/mappers/portfolio.mapper';
import { TASKER_TOKEN } from '@modules/tasker/tasker.token';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class PortfolioService implements IPortfolioImageService {
  constructor(
    @Inject(TASKER_TOKEN.PORTFOLIO_REPOSITORY)
    private _portfolioImageRepo: IProfileImageRepository,

    @Inject(S3_SERVICE) private _s3Service: IS3Service,
  ) {}

  async findAllByTaskerId(
    taskerId: string,
    filter: GetPortfolioFilterDto,
  ): Promise<PaginatedResult<PortfolioResponseDto>> {
    const result = await this._portfolioImageRepo.findAllImage(
      taskerId,
      filter,
    );

    const responseDocs = await Promise.all(
      result.documents.map(async (doc) => {
        const imageUrl = await this._s3Service.getImageUrl(doc.publicId);
        return PortfolioImageMapper.toResponse(doc, imageUrl);
      }),
    );

    return {
      documents: responseDocs,
      meta: result.meta,
    };
  }

  async create(
    file: Express.Multer.File,
    dto: CreatePortfolioImageDto,
    userId: string,
  ): Promise<IBaseResponse> {
    const imageKey = await this._s3Service.uploadPortfolioImage(file);

    const payload: ICreatePortfolioImage = {
      publicId: imageKey,
      userId: toObjectId(userId),
      caption: dto?.caption || '',
    };

    const savedData = await this._portfolioImageRepo.create(payload);

    if (!savedData) {
      throw new InternalServerErrorException('Faild to save image');
    }

    return { message: 'Successfully uploaded image' };
  }

  async delete(portfolioId: string): Promise<IBaseResponse> {
    const deleted = await this._portfolioImageRepo.deleteOneById(portfolioId);

    if (!deleted) {
      throw new BadRequestException('Faild to delete image');
    }

    return { message: 'Image deleted successfully' };
  }
}
