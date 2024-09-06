import { Behavior } from "enum/behavior.enum";
import { Emotion } from "enum/emotion.enum";
import { Thought } from "enum/thoght.enum";
import { PhysiologicalReaction } from "enum/physiological-reaction.enum";

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ') // Substitui caracteres não alfanuméricos por espaço
    .trim()
    .split(' ')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}

export function mapDescriptionToBehavior(description: string): Behavior | undefined {
  const camelCaseDescription = toCamelCase(description);
  return Behavior[camelCaseDescription as keyof typeof Behavior];
}

export function mapDescriptionToEmotion(description: string): Emotion | undefined {
    const camelCaseDescription = toCamelCase(description);
    return Emotion[camelCaseDescription as keyof typeof Emotion];
}

export function mapDescriptionToThought(description: string): Thought | undefined {
  const camelCaseDescription = toCamelCase(description);
  return Thought[camelCaseDescription as keyof typeof Thought];
}

export function mapDescriptionToPhysiologicalReaction(description: string): PhysiologicalReaction | undefined {
  const camelCaseDescription = toCamelCase(description);
  return PhysiologicalReaction[camelCaseDescription as keyof typeof PhysiologicalReaction];
}