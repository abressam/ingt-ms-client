import { ClientServiceInterface } from '@app/modules/client/services/client.service.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeleteClientResDto } from '@app/modules/client/dtos/response/delete-client-res.dto';
import { GetClientResDto } from '@app/modules/client/dtos/response/get-client-res.dto';
import { GetSingleClientResDto } from '@app/modules/client//dtos/response/get-single-client-res.dto';
import { PostClientReqDto } from '@app/modules/client/dtos/request/post-client-req.dto';
import { PutClientReqDto } from '@app/modules/client/dtos/request/put-client.req.dto';
import { ClientDto } from '@app/modules/client/dtos/client.dto';
import { Client } from '@app/modules/client/models/client.model';
import { convertToISODate, generateUuid } from '@app/modules/client/utils/client.util';
import { validateEnumKey } from '@app/modules/client/utils/validateEnum.util';
import { Behavior } from "@app/modules/client/enums/behavior.enum";
import { Emotion } from "@app/modules/client/enums/emotion.enum";
import { Thought } from "@app/modules/client/enums/thoght.enum";
import { PhysiologicalReaction } from "@app/modules/client/enums/physiological.reaction.enum";

@Injectable()
export class ClientService implements ClientServiceInterface {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<Client>,
  ) {}

  async getRDP(
    user: string, 
    startDate?: string, 
    endDate?: string, 
    emotion?: string, 
    pacientId?: number
): Promise<GetClientResDto> {
    this.validateAuth(user);
    let rpds = null;

    const userObject = await this.clientModel.findOne({ cpfCnpj: user }).exec();

    const queryOptions = this.checkUserType(userObject, user, pacientId);

    if (emotion) {
        queryOptions.emotion = emotion;
    }

    if (startDate && endDate) {
        const isoStartDate = convertToISODate(startDate);
        const isoEndDate = convertToISODate(endDate);

        queryOptions.createdAt = { 
            $gte: new Date(isoStartDate),  // maior ou igual a startDate
            $lte: new Date(isoEndDate)     // menor ou igual a endDate
        };
    }

    console.log("Valor do queryOptions", queryOptions);

    const keys = Object.keys(queryOptions);

    if(keys[0] == "userObject") {
      rpds = await this.clientModel.find({ cpfCnpj: user }); 
    } else {
      // outras chaves aqui
    }

    if (rpds.length === 0) {
      return { client: [] };
    }

    return { 
      client: rpds.map((rpd) => rpd)
    };
  }

  async postRDP(user: string, responsibleCrp: string, pacientId: string, body: PostClientReqDto): Promise<GetSingleClientResDto> {
    this.validateAuth(user);
    const uuid = generateUuid();
    
    if (pacientId === null || responsibleCrp === null) {
      throw new HttpException('Only patients can create RDP', HttpStatus.BAD_REQUEST);
    }

    validateEnumKey(body.physiologicalReaction, PhysiologicalReaction);
    validateEnumKey(body.behavior, Behavior);
    validateEnumKey(body.emotion, Emotion);
    validateEnumKey(body.thought, Thought);

    const createdRdp = new this.clientModel({
      ...body,
      uuid: uuid,
      cpfCnpj: user,
      responsibleCrp: responsibleCrp,
      pacientId: pacientId
    });
    
    const rdp = await createdRdp.save();

    return {
      client: {
        emotion: rdp.emotion,
        physiologicalReaction: rdp.physiologicalReaction,
        situation: rdp.situation,
        thought: rdp.thought,
        behavior: rdp.behavior,
        pacientId: rdp.pacientId,
        responsibleCrp: responsibleCrp
      },
    };
    
  }


  async putRDP(user: string, body: PutClientReqDto): Promise<GetSingleClientResDto> {
    this.validateAuth(user);

    const rdpOld = await this.clientModel.findOne({ uuid: body.uuid }).exec();

    this.validateRDP(rdpOld);

    const rdpNew = Object.assign({}, rdpOld.toObject(), body);

    if (body.physiologicalReaction) {
      validateEnumKey(body.physiologicalReaction, PhysiologicalReaction);
    }
    
    if (body.behavior) {
        validateEnumKey(body.behavior, Behavior);
    }

    if (body.emotion) {
        validateEnumKey(body.emotion, Emotion);
    }

    if (body.thought) {
        validateEnumKey(body.thought, Thought);
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
      client: {
        emotion: rdpNew.emotion,
        physiologicalReaction: rdpNew.physiologicalReaction,
        situation: rdpNew.situation,
        thought: rdpNew.thought,
        behavior: rdpNew.behavior,
        pacientId: rdpNew.pacientId,
        responsibleCrp: rdpNew.responsibleCrp
      },
    };
  }

  async deleteRPD(user: string, uuid: string): Promise<DeleteClientResDto> {
    this.validateAuth(user);

    const rdp = await this.clientModel.findOne({ uuid: uuid }).exec();

    this.validateRDP(rdp);

    await rdp.deleteOne();

    return {
      statusCode: 200,
      message: 'RPD successfully deleted',
    };
  }

  private validateRDP(client: ClientDto) {
    if (!client) {
      throw new HttpException('No RPD register found', HttpStatus.NOT_FOUND);
    }
  }

  private validateAuth(user: string) {
    if (!user) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }

  private checkUserType(user: any, userObject: string, pacientId?: number): any {
    const queryOptions: any = {};

    // if is a professional
    if(user && user.crp) {
      if(pacientId) {
        queryOptions.pacientId = pacientId; // search for one specific pacient
      } else {
        queryOptions.userObject = userObject; // return all the pacients registers
      }
    } else {
      queryOptions.userObject = userObject; // if you are a pacient, just see your registers
    }
    
    return queryOptions;
  }
}