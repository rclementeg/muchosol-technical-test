import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { Newspaper } from './newspaper.entity';

@Schema()
export class Feed extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Newspaper', required: true })
  newspapers: Newspaper[];

  @Prop({ type: Date })
  lastUpdate: Date;

  @Prop({ type: Date })
  created: Date;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
