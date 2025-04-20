// src/ai/flows/suggest-break-activities.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest break activities to the user.
 *
 * It uses reinforcement learning insights to provide personalized suggestions for relaxation and recharging.
 *
 * - suggestBreakActivities - A function that suggests break activities.
 * - SuggestBreakActivitiesInput - The input type for the suggestBreakActivities function.
 * - SuggestBreakActivitiesOutput - The return type for the suggestBreakActivities function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getExercises, Exercise} from '@/services/exercise';

const SuggestBreakActivitiesInputSchema = z.object({
  userPreferences: z
    .string()
    .optional()
    .describe('The user preferences for break activities.'),
  timeAvailable: z
    .number()
    .optional()
    .describe('The time available for the break in minutes.'),
});
export type SuggestBreakActivitiesInput = z.infer<typeof SuggestBreakActivitiesInputSchema>;

const SuggestBreakActivitiesOutputSchema = z.object({
  suggestedActivities: z
    .array(z.string())
    .describe('The suggested break activities based on user preferences and time available.'),
});
export type SuggestBreakActivitiesOutput = z.infer<typeof SuggestBreakActivitiesOutputSchema>;

export async function suggestBreakActivities(input: SuggestBreakActivitiesInput): Promise<SuggestBreakActivitiesOutput> {
  return suggestBreakActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBreakActivitiesPrompt',
  input: {
    schema: z.object({
      userPreferences: z
        .string()
        .optional()
        .describe('The user preferences for break activities.'),
      timeAvailable: z
        .number()
        .optional()
        .describe('The time available for the break in minutes.'),
      exercises: z.array(z.string()).describe('A list of available exercises.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedActivities: z
        .array(z.string())
        .describe('The suggested break activities based on user preferences and time available.'),
    }),
  },
  prompt: `You are an AI assistant designed to suggest break activities to users based on their preferences and available time.\n\n  The user has the following preferences: {{{userPreferences}}}.\n  The user has the following amount of time for a break (in minutes): {{{timeAvailable}}}.\n  Here is a list of possible exercises: {{{exercises}}}.\n\n  Suggest activities that the user can do during their break, considering their preferences and the time they have available. Be creative and suggest a diverse range of activities. Prioritize exercises if appropriate. Do not suggest activities that take a long time. Only suggest things from the provided list of exercises.`,
});

const suggestBreakActivitiesFlow = ai.defineFlow<
  typeof SuggestBreakActivitiesInputSchema,
  typeof SuggestBreakActivitiesOutputSchema
>(
  {
    name: 'suggestBreakActivitiesFlow',
    inputSchema: SuggestBreakActivitiesInputSchema,
    outputSchema: SuggestBreakActivitiesOutputSchema,
  },
  async input => {
    const exercises: Exercise[] = await getExercises();
    const exerciseNames: string[] = exercises.map(exercise => exercise.name);

    const {output} = await prompt({
      ...input,
      exercises: exerciseNames,
    });
    return output!;
  }
);
