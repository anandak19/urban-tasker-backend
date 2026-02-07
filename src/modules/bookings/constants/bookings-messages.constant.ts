export const BOOKING_MESSAGES = {
  BOOKING_FAILED: 'Failed to complete booking',
  BOOKING_SUCCESS: 'Booking successful',
  CANCELL_SUCCESS: 'Cancelled booking',
  CANCELL_FAILD: 'Faild to cancelled',
  CANCELL_CONFLICT: 'Cannot cancel booking at this moment',

  BOOKING_NOT_FOUND: 'Booking details not found',

  BOOKING_DATE_IN_PAST: 'Booking date cannot be in the past',
  BOOKING_TIME_IN_PAST: 'Booking time cannot be in the past',
} as const;
