import { AvailabilityDocument } from '../schemas/availability.schema';

export class AvailabilityMapper {
  static toListResponse(availabilityDocs: AvailabilityDocument[]) {
    if (availabilityDocs.length === 0) return [];

    const mapped = {};

    availabilityDocs.forEach((item) => {
      mapped[item.day] = {
        day: item.day,
        slots: item.slots,
        id: item._id.toString(),
      };
    });

    return mapped;
  }
}
