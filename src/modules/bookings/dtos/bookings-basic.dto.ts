import { TaskStatus } from '@shared/constants/enums/task.enum';

//using
export class BookingDetailsBasic {
  id: string;

  categoryName: string;
  subcategoryId: string;
  image: string;

  date: string;
  time: string;

  taskStatus: TaskStatus;
  isAccepted: boolean;
}
