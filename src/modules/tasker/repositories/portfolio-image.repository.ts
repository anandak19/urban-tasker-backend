import { BaseRepository } from '@shared/repository/base.repository';
import {
  PortfolioImage,
  PortfolioImageDocument,
} from '../schemas/portfolio-image.schema';
import { ICreatePortfolioImage } from '../interfaces/portfolio-image.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProfileImageRepository } from '../interfaces/tasker-repositories.interface';

export class PortfolioImageRepository
  extends BaseRepository<PortfolioImageDocument, ICreatePortfolioImage>
  implements IProfileImageRepository
{
  constructor(
    @InjectModel(PortfolioImage.name)
    private _profileImageModal: Model<PortfolioImageDocument>,
  ) {
    super(_profileImageModal);
  }
  findAllImage() {
    throw new Error('Method not implemented.');
  }
}
