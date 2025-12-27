import { getDay } from '@shared/utility/time/convert-day.utitlity';
import {
  IGroupedSlots,
  IMappedAvailability,
} from '../interfaces/availability.interface';
import { toTimeString } from '@shared/utility/time/convert-time.utitlity';

export class AvailabilityMapper {
  static toMappedResponse(
    availabilityDocs: IGroupedSlots[],
  ): IMappedAvailability {
    const mapped: IMappedAvailability = {};

    availabilityDocs.forEach((item) => {
      mapped[getDay(item._id)] = {
        day: item._id,

        slots: item.slots.map((slot) => {
          return {
            day: slot.day,
            start: toTimeString(slot.start),
            end: toTimeString(slot.end),
            id: slot._id.toString(),
            isActive: slot.isActive,
          };
        }),
      };
    });

    return mapped;
  }
}
