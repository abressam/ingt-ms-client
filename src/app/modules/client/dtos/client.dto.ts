import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ClientDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    emotion: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    physiologicalReaction: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    situation: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    thought: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    behavior: string;
  
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    pacientId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    responsibleCrp: string;
}