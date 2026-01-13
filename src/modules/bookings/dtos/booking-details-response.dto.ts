import { TaskSize } from '@shared/constants/enums/task.enum';
import { BookingListingResponseDto } from './booking-listing-response.dto';
import { LocationDto } from './location.dto';
import { IPayment, ITaskTimes } from '../interfaces/bookings.interface';

// used in booking details fetch by user, tasker, admin
export class BookingDetailsResponseDto extends BookingListingResponseDto {
  description: string;
  location: LocationDto;

  taskSize: TaskSize;

  //rest of the field that get added later
  taskTimes?: ITaskTimes;
  isOnBreak?: boolean;
  payment?: IPayment;
}
