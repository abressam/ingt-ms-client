import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteClientReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uuid: string;
}