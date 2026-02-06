import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class LocationCordinates {
  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;
}
