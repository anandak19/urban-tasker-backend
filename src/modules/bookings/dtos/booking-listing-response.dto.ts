import { TaskStatus } from '@shared/constants/enums/task.enum';

//used in booking listing for user, tasker and admin
export class BookingListingResponseDto {
  categoryName: string;
  subcategoryId: string;
  image: string;

  date: string;
  time: string;
  city: string;

  taskStatus: TaskStatus;
  isAccepted: boolean;

  taskerId: string;
  taskerName: string;

  userId: string;
  userName: string;

  id: string;
}
