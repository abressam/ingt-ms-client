import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { Behavior } from "enum/behavior.enum";
import { Emotion } from "enum/emotion.enum";
import { Thought } from "enum/thoght.enum";
import { PhysiologicalReaction } from "enum/physiological-reaction.enum";

export class PutClientReqDto {
    @ApiProperty({ enum: Emotion, required: true })
    @IsOptional()
    @IsEnum(Emotion)
    emotion?: Emotion;

    @ApiProperty({ enum: PhysiologicalReaction, required: true })
    @IsOptional()
    @IsEnum(PhysiologicalReaction)
    physiological_reaction?: PhysiologicalReaction;
  
    @ApiProperty({ type: String, required: true })
    @IsOptional()
    @IsString()
    situation?: string;
  
    @ApiProperty({ enum: Thought, required: true })
    @IsOptional()
    @IsEnum(Thought)
    thought?: Thought;
  
    @ApiProperty({ enum: Behavior, required: true })
    @IsOptional()
    @IsEnum(Behavior)
    behavior?: Behavior;
}