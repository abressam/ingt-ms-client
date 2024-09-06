import { ClientService } from '@app/modules/client/services/client.service';
import { ClientControllerInterface } from '@app/modules/client/controllers/client.controller.interface';
import { ErrorDto } from '@app/modules/session/dtos/error.dto';
import { DeleteClientResDto } from '@app/modules/client/dtos/response/delete-client-res.dto';
import { DeleteClientReqDto } from '@app/modules/client/dtos/request/delete-client-req.dto';
import { GetClientResDto } from '@app/modules/client/dtos/response/get-client-res.dto';
import { GetSingleClientResDto } from '@app/modules/client//dtos/response/get-single-client-res.dto';
import { PostClientReqDto } from '@app/modules/client/dtos/request/post-client-req.dto';
import { PutClientReqDto } from '@app/modules/client/dtos/request/put-client.req.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
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

  @Get('get')
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
  @ApiQuery({ name: 'startDate', required: false, description: 'RDP start date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'RDP end date' })
  @ApiQuery({ name: 'emotion', required: false, description: 'RDP emotion' })
  @ApiQuery({ name: 'pacientId', required: false, description: 'RDP pacientId' })
  async getRDP(
    @Request() req: Request,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('emotion') emotion?: string,
    @Query('pacientId') pacientId?: number,
) {
    const logger = new Logger(ClientController.name);

    try {
        const userUuid = req['userUuid'];
        logger.log('getRDP()');
        return await this.clientService.getRDP(userUuid);
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
    type: GetSingleClientResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async postRDP(@Request() req: Request, @Body() body: PostClientReqDto) {
    const logger = new Logger(ClientController.name);

    try {
        const userUuid = req['userUuid'];
        logger.log('postRDP()');
        return await this.clientService.postRDP(userUuid, body);
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
    type: GetSingleClientResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async putRDP(@Request() req: Request, @Body() body: PutClientReqDto) {
    const logger = new Logger(ClientController.name);

    try {
        const userUuid = req['userUuid'];
        logger.log('putRDP()');
        return await this.clientService.putRDP(userUuid, body);
    } catch (error) {
        logger.error(error);
        throw new HttpException(error.message, error.getStatus());
    }
  }

  @Delete('delete/:id')
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
  async deleteRPD(@Param() params: DeleteClientReqDto, @Request() req: Request) {
    const logger = new Logger(ClientController.name);

    try {
        const userUuid = req['userUuid'];
        const rdpUuid = params.uuid;
        logger.log('deleteRPD()');
        return await this.clientService.deleteRPD(rdpUuid, userUuid);
    } catch (error) {
        logger.error(error);
        throw new HttpException(error.message, error.getStatus());
    }
  }
}