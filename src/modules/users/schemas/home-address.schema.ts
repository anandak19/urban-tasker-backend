import { Prop, Schema } from '@nestjs/mongoose';
import { GeoLocation } from './location.schema';

@Schema({ _id: false })
export class HomeAddress {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ type: GeoLocation, required: true })
  location: GeoLocation;
}
