import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { Behavior } from "enum/behavior.enum";
import { Emotion } from "enum/emotion.enum";
import { Thought } from "enum/thoght.enum";
import { PhysiologicalReaction } from "enum/physiological-reaction.enum";

export class PostClientReqDto {
    @ApiProperty({ enum: Emotion, required: true })
    @IsEnum(Emotion)
    emotion: Emotion;

    @ApiProperty({ enum: PhysiologicalReaction, required: true })
    @IsEnum(PhysiologicalReaction)
    physiological_reaction: PhysiologicalReaction;
  
    @ApiProperty({ type: String, required: true })
    @IsString()
    situation: string;
  
    @ApiProperty({ enum: Thought, required: true })
    @IsEnum(Thought)
    thought: Thought;
  
    @ApiProperty({ enum: Behavior, required: true })
    @IsEnum(Behavior)
    behavior: Behavior;
}