import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class GeoLocation {
  @Prop({
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true,
  })
  type: 'Point';

  @Prop({
    type: [Number],
    required: true,
  })
  coordinates: [number, number];
}
