import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

import { Newspaper } from './newspaper.entity';

@Schema()
export class Article extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer', required: true })
  newspaper: Newspaper | Types.ObjectId;

  @Prop({ type: String, required: true })
  subtitle: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  date: Date;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: Date })
  lastUpdate: Date;

  @Prop({ type: Date })
  created: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
