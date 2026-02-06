import { ITaskerApplicationListItem } from '../interfaces/tasker-applications.interface';
import { TaskerApplicationDocument } from '../schemas/tasker-application.schema';

export class TaskerApplicationMapper {
  static toListingResponse(
    taskerApplication: TaskerApplicationDocument,
  ): ITaskerApplicationListItem {
    return {
      firstName: taskerApplication.firstName,
      lastName: taskerApplication.lastName,
      hourlyRate: taskerApplication.hourlyRate,
      applicationStatus: taskerApplication.applicationStatus,
      city: taskerApplication.city,
      id: taskerApplication._id.toString(),
      email: taskerApplication.email,
    };
  }
}
