import { ClientServiceInterface } from '@app/modules/client/services/client.service.interface';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteClientResDto } from '@app/modules/client/dtos/response/delete-client-res.dto';
import { GetClientResDto } from '@app/modules/client/dtos/response/get-client-res.dto';
import { GetSingleClientResDto } from '@app/modules/client//dtos/response/get-single-client-res.dto';
import { PostClientReqDto } from '@app/modules/client/dtos/request/post-client-req.dto';
import { PutClientReqDto } from '@app/modules/client/dtos/request/put-client.req.dto';
import { ClientDto } from '@app/modules/client/dtos/client.dto';
import { Client } from '@app/modules/client/models/client.model';
import { convertToISODate } from 'utils/convert-iso-date';

@Injectable()
export class ClientService implements ClientServiceInterface {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<Client>,
    private readonly configService: ConfigService,
  ) {}

  async getRDP(
    userUuid: string, 
    startDate?: string, 
    endDate?: string, 
    emotion?: string, 
    pacientId?: number
): Promise<GetClientResDto> {
    this.validateAuth(userUuid);

    const user = await this.clientModel.findOne({ uuid: userUuid });
    const queryOptions = this.checkUserType(user, userUuid, pacientId);

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

    const rpds = await this.clientModel.find(queryOptions); 

    this.validateRDP(rpds[0]);

    return { 
      client: rpds.map((rpd) => rpd)
    };
  }

  async postRDP(userUuid: string, body: PostClientReqDto): Promise<GetSingleClientResDto> {

    const user = await this.clientModel.findOne({ uuid: userUuid });

    if(user.crp != null) {
      throw new HttpException('Only pacients can create RDP', HttpStatus.BAD_REQUEST);
    }

    const createdRdp = new this.clientModel({
      ...body,
    });
    
    const rdp = await createdRdp.save();

    return {
      client: {
        emotion: rdp.emotion,
        physiological_reaction: rdp.physiological_reaction,
        situation: rdp.situation,
        thought: rdp.thought,
        behavior: rdp.behavior,
        pacientId: rdp.pacientId
      },
    };
    
  }


  async putRDP(userUuid: string, body: PutClientReqDto): Promise<GetSingleClientResDto> {
    this.validateAuth(userUuid);

    const rdpOld = await this.clientModel.findOne({ uuid: userUuid }).exec();

    this.validateRDP(rdpOld);

    const rdpNew = Object.assign({}, rdpOld.toObject(), body);

    await this.clientModel.updateOne(
        { uuid: userUuid },
        {
          $set: {
              emotion: rdpNew.emotion,
              physiological_reaction: rdpNew.physiological_reaction,
              situation: rdpNew.situation,
              thought: rdpNew.thought,
              behavior: rdpNew.behavior,               
          }
        }
    );

    return {
      client: {
        emotion: rdpNew.emotion,
        physiological_reaction: rdpNew.physiological_reaction,
        situation: rdpNew.situation,
        thought: rdpNew.thought,
        behavior: rdpNew.behavior,
        pacientId: rdpNew.pacientId
      },
    };
  }

  async deleteRPD(RdpUuid: string, userUuid: string): Promise<DeleteClientResDto> {
    this.validateAuth(userUuid);

    const rdp = await this.clientModel.findOne({ uuid: RdpUuid });

    this.validateRDP(rdp);

    await rdp.deleteOne({ uuid: RdpUuid });

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

  private validateAuth(userUuid: string) {
    if (!userUuid) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }

  private checkUserType(user: any, userUuid: string, pacientId?: number): any {
    const queryOptions: any = {};

    // if is a professional
    if(user.crp != null) {
      if(pacientId) {
        queryOptions.pacientId = pacientId; // search for one specific pacient
      } else {
        queryOptions.userUuid = userUuid; // return all the pacients registers
      }
    } else {
      queryOptions.userUuid = userUuid; // if you are a pacient, just see your registers
    }
    
    return queryOptions;
  }
}