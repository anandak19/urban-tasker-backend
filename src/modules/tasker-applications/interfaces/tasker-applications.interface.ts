import { TaskerApplicationStatus } from '@shared/constants/enums/status.enum';
import mongoose from 'mongoose';

export type IworkCategories = string[] | mongoose.Types.ObjectId[];

export interface IIdProof {
  idProofType: string;
  frontImage: Express.Multer.File | string;
  backImage: Express.Multer.File | string;
}

// TaskerApplication - BASE
export interface IBaseTaskerApplication {
  firstName: string;
  lastName: string;
  city: string;
  hourlyRate: string | number;
  idProof: IIdProof;
}

// TaskerApplication - CREATE
export interface ICreateTaskerApplication extends IBaseTaskerApplication {
  userId: string | mongoose.Types.ObjectId;
  workCategories: IworkCategories;
}

export interface IWorkCategoriesObject {
  name: string;
  id: string;
}

// TaskerApplication - RETURN
export interface ITaskerApplication extends IBaseTaskerApplication {
  workCategories: IWorkCategoriesObject[];
  applicationStatus: TaskerApplicationStatus;
  adminFeedback: string;
}
