import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Client extends Document {
   @Prop({ index: true })
   uuid: string;   
   
   @Prop()
   pacientId: number;

   @Prop()
   cpfCnpj: string;
   
   @Prop()
   responsibleCrp: string;
   
   @Prop()
   emotion: string;   
   
   @Prop()
   physiologicalReaction: string;

   @Prop()
   situation: string;

   @Prop()
   thought: string;

   @Prop()
   behavior: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);