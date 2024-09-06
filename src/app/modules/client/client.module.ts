import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from '@app/modules/client/models/client.model';
import { ClientService } from '@app/modules/client/services/client.service';
import { ClientController } from '@app/modules/client/controllers/client.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule  {}