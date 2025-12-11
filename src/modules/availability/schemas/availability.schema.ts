import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { WeekDays } from '../constants/week-days.constant';
import { SlotDocument, SlotSchema } from './slot.schema';

@Schema({ timestamps: true })
export class Availability {
  @Prop({ required: true, type: Types.ObjectId })
  taskerId: Types.ObjectId;

  @Prop({ required: true })
  day: WeekDays;

  @Prop({ required: true, type: [SlotSchema] })
  slots: SlotDocument[];
}

export type AvailabilityDocument = HydratedDocument<Availability>;
export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
