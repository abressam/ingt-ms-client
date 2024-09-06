import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';
import { ClientDto } from '@app/modules/client/dtos/client.dto';

export class GetSingleClientResDto {
  @ApiProperty()
  @IsNotEmptyObject({ nullable: false })
  client: ClientDto;
}