import { PaginatedResult } from '@shared/interfaces/query.interface';
import { ListComplaintResponseDto } from '../dtos/list-complaints-response.dto';

export type IFindAllComplaintsResponse =
  PaginatedResult<ListComplaintResponseDto>;
