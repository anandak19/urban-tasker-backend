import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class Slot {
  @Prop({ required: true })
  start: string;

  @Prop({ required: true })
  end: string;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
