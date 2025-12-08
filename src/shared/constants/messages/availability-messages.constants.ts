export const AVAILABILITY_SUCCESS = {
  CREATE_DEFAULT_SUCCESS: 'Successfully created default time slots',

  REMOVE_SLOT_SUCCESS: 'Successfully removed time slot',
  ADD_SLOT_SUCCESS: 'Successfully added new slot',
  UPDATE_SLOT_SUCCESS: 'Successfully updated the slot',
};

export const AVAILABILITY_ERROR = {
  CREATE_DEFAULT_FAILD: 'Faild to create default time slots',
  ADD_SLOT_FAILD: 'Error in adding slot',
  UPDATE_SLOT_FAILD: 'Faild to update time slot',
  CREATE_FAILD: 'Faild to create availability',
  REMOVE_SLOT_FAILD: 'Faild to remove time slot',

  VALIDATION_FAILD: 'Invalid availabilty',
  NOT_FOUND: 'Availability not found',

  SLOT_MAX_ERROR: 'You can only add upto 3 slot',

  TIME_OVERLAP_ERROR: 'Start or end time is overlapping with other slots!',
  TIME_INVALID: 'End time should be greater than start',
};
