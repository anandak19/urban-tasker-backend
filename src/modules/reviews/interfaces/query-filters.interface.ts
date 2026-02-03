import { IFindAllQuery } from '@shared/interfaces/query.interface';

export interface IFindAllReviewsFilter extends Omit<IFindAllQuery, 'search'> {
  taskerId: string;
}
