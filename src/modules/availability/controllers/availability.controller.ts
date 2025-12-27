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
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { IAvailabilityService } from '../interfaces/availability-services.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { AVAILABILITY_TOKEN } from '../availability.token';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';
import { IMappedAvailability } from '../interfaces/availability.interface';
import { SlotDataDto } from '../dtos/slot-data.dto';
import { ChangeSlotStatusDto } from '../dtos/change-slot-status.dto';

@Controller('availability')
@UseGuards(AuthGuard)
export class AvailabilityController {
  constructor(
    @Inject(AVAILABILITY_TOKEN.AVAILABILITY_SERVICE)
    private _availabilityService: IAvailabilityService,
  ) {}

  @Patch('default')
  createDefault(@Request() req: IAuthenticatedReqeust) {
    if (!req.user) {
      throw new BadRequestException(GENERAL_ERRORS.LOGIN_REQUIRED);
    }

    return this._availabilityService.createDefaultAvailability(req.user.id);
  }

  @Delete('default')
  deleteAllSlots(@Request() req: IAuthenticatedReqeust) {
    return this._availabilityService.deleteAllTaskerSlots(req.user.id);
  }

  @Get()
  findAllTaskerAvailabilities(
    @Request() req: IAuthenticatedReqeust,
  ): Promise<IMappedAvailability> {
    return this._availabilityService.findAllTaskerAvailabilities(req.user.id);
  }

  @Patch(':availabilityId/status')
  changeStatus(
    @Param('availabilityId') availabilityId: string,
    @Body() dto: ChangeSlotStatusDto,
  ) {
    return this._availabilityService.changeStatus(availabilityId, dto.isActive);
  }

  // route to delete one slot
  @Delete(':availabilityId')
  deleteOneTimeSlot(@Param('availabilityId') availabilityId: string) {
    return this._availabilityService.deleteOneTimeSlot(availabilityId);
  }

  // route to update one slot
  @Patch(':availabilityId')
  updateSlot(
    @Req() req: IAuthenticatedReqeust,
    @Param('availabilityId') availabilityId: string,
    @Body() dto: SlotDataDto,
  ) {
    return this._availabilityService.updateSlot(
      availabilityId,
      dto,
      req.user.id,
    );
  }

  // route to add new slot
  @Post()
  createSlot(@Request() req: IAuthenticatedReqeust, @Body() dto: SlotDataDto) {
    return this._availabilityService.createSlot(req.user.id, dto);
  }
}
