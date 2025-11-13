import { IBasicResponseData } from '@shared/interfaces/base-response.interface';
import { ICategory } from './category.interface';

export type ICategoryResponse = IBasicResponseData<ICategory, 'category'>;
