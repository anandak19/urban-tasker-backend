import mongoose from 'mongoose';

export type IworkCategories = string[] | mongoose.Types.ObjectId[];

export interface IIdProof {
  idProofType: string;
  frontImage: Express.Multer.File | string;
  backImage: Express.Multer.File | string;
}

export interface ICreateTaskerApplication {
  firstName: string;
  lastName: string;
  city: string;
  hourlyRate: string | number;
  workCategories: IworkCategories;
  idProof: IIdProof;
}
