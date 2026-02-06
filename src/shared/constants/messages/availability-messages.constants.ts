export const AVAILABILITY_SUCCESS = {
  CREATE_DEFAULT_SUCCESS: 'Successfully created default time slots',

  REMOVE_SLOT_SUCCESS: 'Successfully removed time slot',
  ADD_SLOT_SUCCESS: 'Successfully added new slot',
  UPDATE_SLOT_SUCCESS: 'Successfully updated the slot',
  REMOVE_ALL_SLOTS_SUCCESS: 'Successfully removed all slots',
  CHANGE_STATUS_SUCCESS: 'Successfully updated the visibility status',
};

export const AVAILABILITY_ERROR = {
  CREATE_DEFAULT_FAILD: 'Faild to create default time slots',
  ADD_SLOT_FAILD: 'Error in adding slot',
  UPDATE_SLOT_FAILD: 'Faild to update time slot',
  CREATE_FAILD: 'Faild to create availability',
  REMOVE_SLOT_FAILD: 'Faild to remove time slot',
  REMOVE_SLOTS_FAILED: 'Failed to remove slots',

  VALIDATION_FAILD: 'Invalid availabilty',
  NOT_FOUND: 'Availability not found',

  SLOT_MAX_ERROR: 'You can only add upto 3 slot',

  TIME_OVERLAP_ERROR: 'Start or end time is overlapping with other slots!',
  TIME_INVALID: 'End time should be greater than start',

  CHANGE_STATUS_FAILD: 'Faild to change the visibility status',
  REMOVE_CURRENT_SLOTS_FOR_DEFAULT:
    'Please remove current slots to add new default slots',
};
