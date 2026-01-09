import { TaskSize, TaskStatus } from '@shared/constants/enums/task.enum';
import { TObjectId } from '@shared/types/db-types';

export interface ICreateBooking {
  categoryId: string | TObjectId;
  subcategoryId: string | TObjectId;
  description: string;
  taskSize: TaskSize;
  date: string;
  time: string;
  city: string;
  // address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  userId: string | TObjectId;
  taskerId: string | TObjectId;
}

export interface IListBookingBasic {
  subcategoryId: string;
  categoryName: string;
  isAccepted: boolean;
  image: string;
  date: string;
  time: string;
  id: string;
}

export interface IListUsersBooking extends IListBookingBasic {
  taskerId: string | TObjectId;
  taskerFirstName: string;
  taskerLastName: string;
}

export interface IListTaskersBooking extends IListBookingBasic {
  userId: string | TObjectId;
  userFirstName: string;
  userLastName: string;
}

//vibee/using
export interface IBookingDetailsRepoResult {
  id: string;

  //about category
  categoryName: string;
  subcategoryId: string;
  image?: string;

  //time place discription
  city: string;
  date: string;
  time: string;
  description: string;

  // status
  taskSize: TaskSize;
  taskStatus: TaskStatus;
  isAccepted: boolean;

  //tasker
  taskerId: string;
  taskerFirstName: string;
  taskerLastName: string;

  //user
  userId: string;
  userFirstName: string;
  userLastName: string;
}

export interface IBookingMatchArgs {
  userId?: string;
  taskerId?: string;
  taskStatus?: TaskStatus;
  subcategoryId?: string;
}
