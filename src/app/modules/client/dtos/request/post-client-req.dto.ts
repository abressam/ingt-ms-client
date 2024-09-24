import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PostClientReqDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    emotion: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    physiologicalReaction: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    situation: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    thought: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    behavior: string;
}
