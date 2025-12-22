import { PaginatedResult } from '@shared/interfaces/query.interface';
import { IListBooking } from './bookings.interface';

export type IFindAllBookingsResponse = PaginatedResult<IListBooking>;
