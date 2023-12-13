import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Newspaper extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  lang: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: Date })
  lastUpdate: Date;

  @Prop({ type: Date })
  created: Date;
}

export const NewspaperSchema = SchemaFactory.createForClass(Newspaper);
