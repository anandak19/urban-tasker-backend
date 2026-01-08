import { TaskSize } from '@shared/constants/enums/task.enum';
import { BookingDetailsBasic } from './bookings-basic.dto';

export class BookingDetailsResponseDto extends BookingDetailsBasic {
  city: string;
  description: string;

  taskSize: TaskSize;

  taskerId: string;
  taskerFirstName: string;
  taskerLastName: string;
}
