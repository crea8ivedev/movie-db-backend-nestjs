import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../user/user.schema';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Movie extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  poster: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Object })
  user: User;

}

export const MovieSchema = SchemaFactory.createForClass(Movie);
