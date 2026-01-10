import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class TaskTimes {
  @Prop({ type: Date, required: true })
  taskStartTime: Date;

  @Prop({ type: Date })
  taskEndTime?: Date;

  // transient field
  @Prop({ type: Date })
  currentBreakStartTime?: Date; // updates everytime when break is taken

  // transient field
  @Prop({ type: Date })
  currentBreakEndTime?: Date; // updates everytime when break is taken

  @Prop({ type: Number, default: 0 })
  totalBreakTime: number; // in sec
}
