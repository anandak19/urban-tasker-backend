import { TaskSize, TaskStatus } from '@shared/constants/enums/task.enum';
import { TObjectId } from '@shared/types/db-types';

/**
 * To create new booking by user
 */
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

// may gets removed
export interface IListBookingBasiczz {
  subcategoryId: string;
  categoryName: string;
  isAccepted: boolean;
  image: string;
  date: string;
  time: string;
  id: string;
}

// to list in find by id
export interface IBookingDetailsRepoResult extends IBookingListingRepoResult {
  location: {
    latitude: number;
    longitude: number;
  };

  description: string;

  taskSize: TaskSize;
}

// to list in find all
export interface IBookingListingRepoResult {
  id: string;

  //about category
  categoryName: string;
  subcategoryId: string;
  image?: string;

  //time place discription
  city: string;
  date: string;
  time: string;

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
