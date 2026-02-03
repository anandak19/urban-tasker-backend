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
  userId: Types.ObjectId; // user id of tasker

  @Prop({
    type: Types.ObjectId,
    ref: 'Tasker',
  })
  taskerId?: Types.ObjectId;

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
