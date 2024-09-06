import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Client extends Document {
   @Prop({ type: String, required: true, index: true })
   uuid: string;   
   
   @Prop({ type: Number, required: true })
   pacientId: number;
   
   @Prop({ type: String, required: true })
   crp: string;
   
   @Prop({ type: String, required: true })
   emotion: string;   
   
   @Prop({ type: String, required: true })
   physiological_reaction: string;

   @Prop({ type: String, required: true })
   situation: string;

   @Prop({ type: String, required: true })
   thought: string;

   @Prop({ type: String, required: true })
   behavior: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);