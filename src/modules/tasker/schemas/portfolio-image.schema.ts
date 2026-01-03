import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class PortfolioImage {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Tasker',
  })
  taskerId?: Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  caption?: string;

  @Prop()
  publicId?: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export type PortfolioImageDocument = HydratedDocument<PortfolioImage>;
export const PortfolioImageSchema =
  SchemaFactory.createForClass(PortfolioImage);
