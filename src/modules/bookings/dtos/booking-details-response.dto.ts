import { TaskSize } from '@shared/constants/enums/task.enum';
import { BookingDetailsBasic } from './bookings-basic.dto';

// used for user/taskr/admin
export class BookingDetailsResponseDto extends BookingDetailsBasic {
  city: string;
  description: string;

  taskSize: TaskSize;

  taskerId: string;
  taskerName: string;

  userId: string;
  userName: string;
}
