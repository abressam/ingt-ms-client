import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, IsDateString, IsOptional, IsString, IsNumber } from 'class-validator';
import { ClientDto } from '@app/modules/client/dtos/client.dto';

export class GetClientResDto {
  @ApiProperty()
  @IsNotEmptyObject({ nullable: false })
  client: ClientDto[];

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  emotion?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  pacientId?: number;
}