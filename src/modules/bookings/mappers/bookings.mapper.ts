import { BookingDetailsResponseDto } from '../dtos/booking-details-response.dto';
import { IBookingDetailsRepoResult } from '../interfaces/bookings.interface';

export class BookingsMapper {
  static toResonseDetailed(
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

      taskerId: data.taskerId,
      taskerName: `${data.taskerFirstName} ${data.taskerLastName}`,

      userId: data.userId,
      userName: `${data.userFirstName} ${data.userLastName}`,

      taskSize: data.taskSize,
      taskStatus: data.taskStatus,
      isAccepted: data.isAccepted,
      time: data.time,
    };
  }
}
