import { TObjectId } from '@shared/types/db-types';

export interface ICreateReview {
  userId: TObjectId;
  taskerId: TObjectId;
  rating: number;
  comment?: string;
}
