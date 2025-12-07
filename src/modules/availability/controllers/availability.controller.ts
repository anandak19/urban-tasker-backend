import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { type Request as TRequest } from 'express';
import type { IAvailabilityService } from '../interfaces/availability-services.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { IPayload } from '@modules/auth/interfaces/auth.interface';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { AVAILABILITY_TOKEN } from '../availability.token';

@Controller('availability')
@UseGuards(AuthGuard)
export class AvailabilityController {
  constructor(
    @Inject(AVAILABILITY_TOKEN.AVAILABILITY_SERVICE)
    private _availabilityService: IAvailabilityService,
  ) {}

  // rote to create default availability slots
  @Patch('default')
  createDefault(@Request() req: TRequest) {
    console.log('Chek');
    if (!req.user) {
      throw new BadRequestException(GENERAL_ERRORS.LOGIN_REQUIRED);
    }

    return this._availabilityService.createDefaultAvailability(
      req.user as IPayload,
    );
  }

  // route to delete one slot
  @Get()
  findAllTaskerAvailabilities(@Request() req: TRequest) {
    // call method to get all availability of the tasker
    return this._availabilityService.findAllTaskerAvailabilities(
      req.user as IPayload,
    );
  }
  // route to update one slot
  // route to add new slot
}
