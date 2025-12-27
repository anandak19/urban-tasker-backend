import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Availability {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  taskerId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 7 })
  day: number; // 1 = Monday ... 7 = Sunday

  @Prop({ required: true, min: 0, max: 1410 })
  start: number; // minutes from midnight

  @Prop({ required: true, min: 30, max: 1440 })
  end: number; // must be > start

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export type AvailabilityDocument = HydratedDocument<Availability>;
export const AvailabilitySchema = SchemaFactory.createForClass(Availability);

// End must be greater than start time
AvailabilitySchema.pre('save', function (next) {
  if (this.end <= this.start) {
    return next(new Error('End time must be greater than start time'));
  }
  next();
});

// index
AvailabilitySchema.index({
  taskerId: 1,
  day: 1,
  start: 1,
  end: 1,
});
