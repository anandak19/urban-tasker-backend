import { Prop, Schema } from '@nestjs/mongoose';
import { ImageSource } from '@shared/constants/enums/image-source.enum';

@Schema({ _id: false })
export class ProfileImage {
  @Prop({ required: true })
  value: string;

  @Prop({
    required: true,
    enum: ImageSource,
    default: ImageSource.S3,
  })
  source: ImageSource;
}
