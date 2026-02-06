import { PaginatedResult } from '@shared/interfaces/query.interface';
import { ListPaymentDto } from '../dtos/list-payments.dto';

export type IFindAllPaymentsResponse = PaginatedResult<ListPaymentDto>;
