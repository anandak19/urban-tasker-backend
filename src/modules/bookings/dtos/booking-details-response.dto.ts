import { TaskSize, TaskStatus } from '@shared/constants/enums/task.enum';

export class BookingDetailsResponseDto {
  id: string;

  categoryName: string;
  subcategoryId: string;
  image: string;

  city: string;
  date: string;
  time: string;
  description: string;

  taskSize: TaskSize;
  taskStatus: TaskStatus;

  taskerId: string;
  taskerFirstName: string;
  taskerLastName: string;
}
