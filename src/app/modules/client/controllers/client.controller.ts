import { ClientService } from '@app/modules/client/services/client.service';
import { ClientControllerInterface } from '@app/modules/client/controllers/client.controller.interface';
import { ErrorDto } from '@app/modules/session/dtos/error.dto';
import { DeleteClientResDto } from '@app/modules/client/dtos/response/delete-client-res.dto';
import { GetClietRdpReqDto } from '@app/modules/client/dtos/request/get-client-filter-rdp-req.dto';
import { GetClietMyRdpsReqDto } from '@app/modules/client/dtos/request/get-client-filter-my-rdps-req.dto';
import { GetClientResDto } from '@app/modules/client/dtos/response/get-client-res.dto';
import { PostClientReqDto } from '@app/modules/client/dtos/request/post-client-req.dto';
import { PutClientReqDto } from '@app/modules/client/dtos/request/put-client.req.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Request,
  Param,
  Body,
  HttpCode,
  HttpException,
  Logger,
  Query,
} from '@nestjs/common';

@ApiTags('client')
@Controller('client')
export class ClientController implements ClientControllerInterface {
  constructor(private readonly clientService: ClientService) {}

  @Get('get-my-patients-rdps')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Get the client data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the client data',
    type: GetClientResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getPatientsRDP(
    @Request() req: Request,
    @Query() filter?: GetClietRdpReqDto
) {
    const logger = new Logger(ClientController.name);

    try {
        const user = req['crp'];
        logger.log('getPatientsRDP()');
        return await this.clientService.getPatientsRDP(user, filter.patientId, filter.startDate, filter.endDate, filter.emotion);
    } catch (error) {
        logger.error(error);
        throw new HttpException(error.message, error.getStatus());
    }
  }

  @Get('get/my-rdps')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Get the client data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the client data',
    type: GetClientResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getMyRDP(
    @Request() req: Request,
    @Query() filter?: GetClietMyRdpsReqDto
) {
    const logger = new Logger(ClientController.name);

    try {
        const user = req['patientId'];
        logger.log('getMyRDP()');
        return await this.clientService.getMyRDP(user, filter.startDate, filter.endDate, filter.emotion);
    } catch (error) {
        logger.error(error);
        throw new HttpException(error.message, error.getStatus());
    }
  }

  @Post('post')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Post the client data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the client data',
    type: GetClientResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async postRDP(@Request() req: Request, @Body() body: PostClientReqDto) {
    const logger = new Logger(ClientController.name);

    try {
        const user = req['patientId'];
        const responsibleCrp = req['responsibleCrp'];
        logger.log('postRDP()');
        return await this.clientService.postRDP(user, responsibleCrp, body);
    } catch (error) {
        logger.error(error);
        throw new HttpException(error.message, error.getStatus());
    }
  }

  @Put('put')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Put the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user data',
    type: GetClientResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async putRDP(@Request() req: Request, @Body() body: PutClientReqDto) {
    const logger = new Logger(ClientController.name);

    try {
        const user = req['patientId'];
        logger.log('putRDP()');
        return await this.clientService.putRDP(user, body);
    } catch (error) {
        logger.error(error);
        throw new HttpException(error.message, error.getStatus());
    }
  }

  @Delete('delete/:uuid')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Delete the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user status',
    type: DeleteClientResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async deleteRPD(@Request() req: Request, @Param('uuid') uuid: string) {
    const logger = new Logger(ClientController.name);

    try {
        const user = req['patientId'];
        logger.log('deleteRPD()');
        return await this.clientService.deleteRPD(user, uuid);
    } catch (error) {
        logger.error(error);
        throw new HttpException(error.message, error.getStatus());
    }
  }
}