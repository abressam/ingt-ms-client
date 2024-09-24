import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetClietUuidReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uuid: string;
}