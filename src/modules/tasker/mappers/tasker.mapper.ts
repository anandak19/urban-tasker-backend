import { ITasker } from '../interfaces/tasker.interface';
import { TaskerDocument } from '../schemas/tasker.schema';

export class TaskerMapper {
  static toResponse(taskerDoc: TaskerDocument): ITasker {
    return {
      userId: taskerDoc.userId,
      workCategories: taskerDoc.workCategories, // update this later
      hourlyRate: taskerDoc.hourlyRate,
      about: taskerDoc.about,
      city: taskerDoc.city,
      rating: taskerDoc.rating,
    };
  }
}
