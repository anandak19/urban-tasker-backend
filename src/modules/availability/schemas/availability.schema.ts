import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { WeekDays } from '../constants/week-days.constant';
import { Slot } from './slot.schema';

@Schema({ timestamps: true })
export class Availability {
  @Prop({ required: true, type: Types.ObjectId })
  taskerId: Types.ObjectId;

  @Prop({ required: true })
  day: WeekDays;

  @Prop({ required: true })
  slots: Slot[];
}
