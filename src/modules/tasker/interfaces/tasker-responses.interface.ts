import { ISuccessResponse } from '@shared/interfaces/http-response.interface';
import {
  ITaskerAbout,
  ITaskerCardData,
  IWorkCategories,
} from './tasker.interface';

export type ITaskerCardResponse = ISuccessResponse<ITaskerCardData>;
export type ITaskerAboutResponse = ISuccessResponse<ITaskerAbout>;
export type ITaskerWorkCategoriesResponse = ISuccessResponse<IWorkCategories>;
