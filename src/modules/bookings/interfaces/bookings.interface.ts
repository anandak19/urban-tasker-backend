import { TaskSize } from '@shared/constants/enums/task.enum';
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
  image: string;
  date: string;
  time: string;
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
