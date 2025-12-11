import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: true })
export class Slot {
  @Prop({ required: true })
  start: string;

  @Prop({ required: true })
  end: string;

  @Prop({ type: Boolean, default: false })
  isDisabled: boolean;
}

export type SlotDocument = HydratedDocument<Slot>;
export const SlotSchema = SchemaFactory.createForClass(Slot);
