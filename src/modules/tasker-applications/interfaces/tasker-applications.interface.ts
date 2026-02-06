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
  email: string;
  workCategories: IworkCategories;
}

export interface IWorkCategoriesObject {
  name: string;
  id: string;
}

export interface IApplicationStatusInfo {
  applicationStatus: TaskerApplicationStatus;
  adminFeedback?: string;
}

// TaskerApplication - RETURN
export interface ITaskerApplication
  extends IBaseTaskerApplication,
    IApplicationStatusInfo {
  workCategories: IWorkCategoriesObject[];
  id: string;
}

export interface ITaskerApplicationListItem
  extends Omit<IBaseTaskerApplication, 'idProof'> {
  id: string;
  email: string;
  applicationStatus: TaskerApplicationStatus;
}
