import { ClientServiceInterface } from '@app/modules/client/services/client.service.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteClientResDto } from '@app/modules/client/dtos/response/delete-client-res.dto';
import { GetClientResDto } from '@app/modules/client/dtos/response/get-client-res.dto';
import { PostClientReqDto } from '@app/modules/client/dtos/request/post-client-req.dto';
import { PutClientReqDto } from '@app/modules/client/dtos/request/put-client.req.dto';
import { ClientDto } from '@app/modules/client/dtos/client.dto';
import { Client } from '@app/modules/client/models/client.model';
import { convertToISODate, generateUuid } from '@app/modules/client/utils/client.util';
import { validateEnumKey } from '@app/modules/client/utils/validateEnum.util';
import { Behavior } from "@app/modules/client/enums/behavior.enum";
import { Emotion } from "@app/modules/client/enums/emotion.enum";
import { PhysiologicalReaction } from "@app/modules/client/enums/physiological.reaction.enum";

@Injectable()
export class ClientService implements ClientServiceInterface {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<Client>,
  ) {}

  async getPatientsRDP(
    crp: string,
    startDate?: string, 
    endDate?: string, 
    emotion?: string, 
    patientId?: string
  ): Promise<GetClientResDto> {
    this.validateAuth(crp);
    const filter: any = { responsibleCrp: crp };

    if (startDate && !endDate) {
      throw new HttpException('endDate is required when startDate is provided', HttpStatus.BAD_REQUEST);
    }

    if (!startDate && endDate) {
      throw new HttpException('startDate is required when endDate is provided', HttpStatus.BAD_REQUEST);
    }

    if (startDate) {
      const ISOstartDate = convertToISODate(startDate);
      filter.date = { $gte: ISOstartDate }; // Adiciona um filtro para >= startDate
    }

    if (endDate) {
      const ISOendDate = convertToISODate(endDate);
      if (filter.date) {
        filter.date = { ...filter.date, $lte: ISOendDate }; // Adiciona um filtro para <= endDate
      } else {
        filter.date = { $lte: ISOendDate }; // Cria um novo filtro para <= endDate
      }
    }
 
    if (patientId) {
        filter.patientId = patientId;
    }

    if (emotion) {
      filter.emotion = emotion;
    }

    const rdps = await this.clientModel.find(filter).exec();

    if (!rdps || rdps.length === 0) {
      return { client: [] };
  }

    return { 
      client: rdps.map((rpd) => rpd)
    };
  }

  async getMyRDP(
    patientId: string,
    startDate?: string, 
    endDate?: string, 
    emotion?: string, 
  ): Promise<GetClientResDto> {
    this.validateAuth(patientId);
    const filter: any = { patientId: patientId };

    if (startDate && !endDate) {
      throw new HttpException('endDate is required when startDate is provided', HttpStatus.BAD_REQUEST);
    }

    if (!startDate && endDate) {
      throw new HttpException('startDate is required when endDate is provided', HttpStatus.BAD_REQUEST);
    }

    if (startDate) {
      const ISOstartDate = convertToISODate(startDate);
      filter.date = { $gte: ISOstartDate }; // Adiciona um filtro para >= startDate
    }

    if (endDate) {
      const ISOendDate = convertToISODate(endDate);
      if (filter.date) {
        filter.date = { ...filter.date, $lte: ISOendDate }; // Adiciona um filtro para <= endDate
      } else {
        filter.date = { $lte: ISOendDate }; // Cria um novo filtro para <= endDate
      }
    }

    if (emotion) {
      filter.emotion = emotion;
    }

    const rdps = await this.clientModel.find(filter).exec();

    if (!rdps || rdps.length === 0) {
      return { client: [] };
  }

    return { 
      client: rdps.map((rpd) => rpd)
    };
  }

  async postRDP(patientId: string, responsibleCrp: string, body: PostClientReqDto): Promise<GetClientResDto> {
    this.validateAuth(patientId);
    const uuid = generateUuid();

    body.physiologicalReaction.forEach(p => validateEnumKey(p, PhysiologicalReaction));
    body.behavior.forEach(b => validateEnumKey(b, Behavior));
    body.emotion.forEach(e => validateEnumKey(e, Emotion));

    const createdRdp = new this.clientModel({
      ...body,
      uuid: uuid,
      responsibleCrp: responsibleCrp,
      patientId: patientId
    });
    
    const rdp = await createdRdp.save();

    return {
      client: [{
        emotion: rdp.emotion,
        physiologicalReaction: rdp.physiologicalReaction,
        situation: rdp.situation,
        thought: rdp.thought,
        behavior: rdp.behavior,
        patientId: rdp.patientId,
        responsibleCrp: responsibleCrp
      }],
    };
    
  }


  async putRDP(patientId: string, body: PutClientReqDto): Promise<GetClientResDto> {
    this.validateAuth(patientId);

    const rdpOld = await this.clientModel.findOne({ uuid: body.uuid }).exec();

    this.validateRDP(rdpOld);

    const rdpNew = Object.assign({}, rdpOld.toObject(), body);

    // Verificar apenas os enums que foram alterados
    const changedFields = {
        physiologicalReaction: rdpOld.physiologicalReaction !== body.physiologicalReaction ? body.physiologicalReaction : null,
        behavior: rdpOld.behavior !== body.behavior ? body.behavior : null,
        emotion: rdpOld.emotion !== body.emotion ? body.emotion : null,
    };

    // Validar apenas as propriedades alteradas
    if (changedFields.physiologicalReaction) {
        changedFields.physiologicalReaction.forEach(p => validateEnumKey(p, PhysiologicalReaction));
    }
    if (changedFields.behavior) {
        changedFields.behavior.forEach(b => validateEnumKey(b, Behavior));
    }
    if (changedFields.emotion) {
        changedFields.emotion.forEach(e => validateEnumKey(e, Emotion));
    }

    await this.clientModel.updateOne(
        { uuid: body.uuid },
        {
          $set: {
              emotion: rdpNew.emotion,
              physiologicalReaction: rdpNew.physiologicalReaction,
              situation: rdpNew.situation,
              thought: rdpNew.thought,
              behavior: rdpNew.behavior,               
          }
        }
    );

    return {
      client: [{
        emotion: rdpNew.emotion,
        physiologicalReaction: rdpNew.physiologicalReaction,
        situation: rdpNew.situation,
        thought: rdpNew.thought,
        behavior: rdpNew.behavior,
        patientId: rdpNew.patientId,
        responsibleCrp: rdpNew.responsibleCrp
      }],
    };
  }

  async deleteRPD(patientId: string, uuid: string): Promise<DeleteClientResDto> {
    this.validateAuth(patientId);

    const rdp = await this.clientModel.findOne({ uuid: uuid }).exec();
    this.validateRDP(rdp);

    await rdp.deleteOne();

    return {
      statusCode: 200,
      message: 'RPD successfully deleted',
    };
  }


  private validateRDP(client: ClientDto | null): void {
    if (!client || !client.emotion || !client.physiologicalReaction) {
        throw new HttpException('No RPD register found', HttpStatus.NOT_FOUND);
    }
  }

  private validateAuth(user: string) {
    if (!user) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }
}