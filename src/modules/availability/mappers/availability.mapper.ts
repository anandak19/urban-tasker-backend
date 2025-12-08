import { IMappedAvailability } from '../interfaces/availability.interface';
import { AvailabilityDocument } from '../schemas/availability.schema';

export class AvailabilityMapper {
  static toListResponse(
    availabilityDocs: AvailabilityDocument[],
  ): IMappedAvailability {
    const mapped = {};

    availabilityDocs.forEach((item) => {
      mapped[item.day] = {
        day: item.day,
        slots: item.slots.map((slot) => ({
          start: slot.start,
          end: slot.end,
          id: slot._id.toString(),
        })),
        id: item._id.toString(),
      };
    });

    return mapped;
  }
}
