import { TObjectId } from '@shared/types/db-types';

export interface ICreatePortfolioImage {
  userId: TObjectId;
  taskerId?: TObjectId;
  publicId: string;
  caption?: string;
}

export interface IPortfolioImageAggregationResult
  extends Pick<ICreatePortfolioImage, 'publicId' | 'caption'> {
  id: string;
}
