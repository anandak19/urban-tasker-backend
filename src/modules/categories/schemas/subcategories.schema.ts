import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './categories.schema';
import slugify from 'slugify';

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, ref: Category.name, type: Types.ObjectId })
  categoryId: Types.ObjectId;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ trim: true })
  slug: string;

  @Prop({ required: false, default: false })
  isDeleted: boolean;
}

export type SubCategoryDocument = HydratedDocument<SubCategory>;
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

SubCategorySchema.pre<SubCategoryDocument>('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});
