import { IBasicResponseData } from '@shared/interfaces/base-response.interface';
import { IMappedAvailability } from './availability.interface';

export type IAvailabilitiesResponse = IBasicResponseData<
  IMappedAvailability,
  'availabilities'
>;
