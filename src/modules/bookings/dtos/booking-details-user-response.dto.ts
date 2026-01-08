import { BookingDetailsBasic } from './bookings-basic.dto';

export class BookingDetailsUserResponseDto extends BookingDetailsBasic {
  taskerId: string;
  taskerFirstName: string;
  taskerLastName: string;
}
