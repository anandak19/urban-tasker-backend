import { toTimeString } from '@shared/utility/time/convert-time.utitlity';
import { BookingDetailsResponseDto } from '../dtos/booking-details-response.dto';
import { BookingListingResponseDto } from '../dtos/booking-listing-response.dto';
import {
  IBookingDetailsRepoResult,
  IBookingListingRepoResult,
} from '../interfaces/bookings.interface';

export class BookingsMapper {
  // FindOne
  // Used for booking details fetched by all user roles
  static toResonseDetailed(
    data: IBookingDetailsRepoResult,
  ): BookingDetailsResponseDto {
    return {
      id: data.id,

      categoryName: data.categoryName,
      subcategoryId: data.subcategoryId,
      image: data.image || '',

      city: data.city,
      time: toTimeString(data.time), //conver mm to hh:mm
      date: data.date,
      location: data.location,

      description: data.description,

      taskerId: data.taskerId,
      taskerName: `${data.taskerFirstName} ${data.taskerLastName}`,

      userId: data.userId,
      userName: `${data.userFirstName} ${data.userLastName}`,

      taskSize: data.taskSize,
      taskStatus: data.taskStatus,
      isAccepted: data.isAccepted,

      taskTimes: data.taskTimes,
      isOnBreak:
        !!data.taskTimes?.currentBreakStartTime &&
        !data.taskTimes?.currentBreakEndTime,

      payment: data.payment,
    };
  }

  // Find All
  static toListingResponse(
    data: IBookingListingRepoResult,
  ): BookingListingResponseDto {
    return {
      id: data.id,

      subcategoryId: data.id,
      categoryName: data.categoryName,
      image: data.image ?? '',

      city: data.city,
      date: data.date,
      time: toTimeString(data.time),

      taskerName: `${data.taskerFirstName} ${data.taskerLastName}`,
      taskerId: data.taskerId,

      userId: data.userId,
      userName: `${data.userFirstName} ${data.userLastName}`,

      taskStatus: data.taskStatus,
      isAccepted: data.isAccepted,
    };
  }
}
