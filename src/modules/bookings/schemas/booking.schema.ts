import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskSize, TaskStatus } from '@shared/constants/enums/task.enum';
import { HydratedDocument, Types } from 'mongoose';
import { TaskTimes } from './task-times.schema';
import { LocationCordinates } from './location.schema';
import { Payment } from './payement.schema';

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subcategory', required: true })
  subcategoryId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ enum: TaskSize, required: true })
  taskSize: TaskSize;

  // Store as ISO string (YYYY-MM-DD)
  @Prop({ required: true })
  date: string;

  // in minutes
  @Prop({ required: true, min: 0, max: 1410 })
  time: number;

  @Prop({ required: true, lowercase: true, trim: true })
  city: string;

  @Prop({ type: LocationCordinates, required: true })
  location: LocationCordinates;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  taskerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: TaskStatus, default: TaskStatus.PENDING })
  taskStatus: TaskStatus;

  @Prop({ type: Boolean, default: false })
  isAccepted: boolean;

  @Prop({ type: TaskTimes, required: false })
  taskTimes?: TaskTimes;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Payment })
  payment: Payment;
}

export type BookingDocument = HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);
