import { SubCategory } from '@modules/categories/schemas/subcategories.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Tasker {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, trim: true })
  about: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: SubCategory.name }],
    default: [],
  })
  workCategories: Types.ObjectId[];

  @Prop({ type: Number, required: true, min: 0 })
  hourlyRate: number;

  @Prop({ required: true })
  city: string;

  @Prop({
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  })
  rating: number;
}

export type TaskerDocument = HydratedDocument<Tasker>;
export const TaskerSchema = SchemaFactory.createForClass(Tasker);
