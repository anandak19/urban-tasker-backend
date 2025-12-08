import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { type Request as TRequest } from 'express';
import type { IAvailabilityService } from '../interfaces/availability-services.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { IPayload } from '@modules/auth/interfaces/auth.interface';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { AVAILABILITY_TOKEN } from '../availability.token';
import type { WeekDayKeys } from '../constants/week-days.constant';
import { CreateSlotDto } from '../dtos/create-slot.dto';

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

  @Get()
  findAllTaskerAvailabilities(@Request() req: TRequest) {
    // call method to get all availability of the tasker
    return this._availabilityService.findAllTaskerAvailabilities(
      req.user as IPayload,
    );
  }

  // route to delete one slot
  @Delete(':availabilityId/:slotId')
  deleteOneTimeSlot(
    @Param('availabilityId') availabilityId: string,
    @Param('slotId') slotId: string,
  ) {
    return this._availabilityService.deleteOneTimeSlot(availabilityId, slotId);
  }

  // route to update one slot
  @Patch(':availabilityId/:slotId')
  updateSlot(
    @Param('availabilityId') availabilityId: string,
    @Param('slotId') slotId: string,
    @Body() dto: CreateSlotDto, // --- use update slot dto later
  ) {
    return this._availabilityService.updateSlot(availabilityId, slotId, dto);
  }

  // route to add new slot
  @Post('day/:day')
  createSlot(
    @Request() req: TRequest,
    @Param('day') day: WeekDayKeys,
    @Body() dto: CreateSlotDto,
  ) {
    return this._availabilityService.createSlot(req.user as IPayload, day, dto);
  }
}
