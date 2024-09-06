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
    physiological_reaction: string;
  
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
}