import { BookingDetailsResponseDto } from '../dtos/booking-details-response.dto';
import { IBookingDetailsRepoResult } from '../interfaces/bookings.interface';

export class BookingsMapper {
  static toUserResonseDetail(
    data: IBookingDetailsRepoResult,
  ): BookingDetailsResponseDto {
    return {
      categoryName: data.categoryName,
      city: data.city,
      date: data.date,
      description: data.description,
      id: data.id,
      image: data.image || '',
      subcategoryId: data.subcategoryId,
      taskerFirstName: data.taskerFirstName,
      taskerLastName: data.taskerLastName,
      taskerId: data.taskerId,
      taskSize: data.taskSize,
      taskStatus: data.taskStatus,
      time: data.time,
    };
  }
}
