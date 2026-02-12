import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import slugify from 'slugify';

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ trim: true })
  slug: string;

  @Prop({ required: false, default: false })
  isDeleted: boolean;
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ name: 'text' });

// presave methods
CategorySchema.pre<CategoryDocument>('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});
