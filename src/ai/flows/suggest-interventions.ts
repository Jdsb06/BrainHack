// src/ai/flows/suggest-interventions.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting interventions based on user context.
 *
 * - suggestInterventions - A function that suggests interventions based on user context.
 * - SuggestInterventionsInput - The input type for the suggestInterventions function.
 * - SuggestInterventionsOutput - The return type for the suggestInterventions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getExercises, Exercise} from '@/services/exercise';

const SuggestInterventionsInputSchema = z.object({
  activity: z.string().describe('The current activity of the user.'),
  location: z.string().describe('The current location of the user.'),
  stressLevel: z.string().describe('The current stress level of the user (e.g., low, medium, high).'),
});
export type SuggestInterventionsInput = z.infer<typeof SuggestInterventionsInputSchema>;

const SuggestInterventionsOutputSchema = z.object({
  interventionSuggestions: z.array(z.string()).describe('A list of suggested interventions based on the user\'s current context.'),
});
export type SuggestInterventionsOutput = z.infer<typeof SuggestInterventionsOutputSchema>;

export async function suggestInterventions(input: SuggestInterventionsInput): Promise<SuggestInterventionsOutput> {
  return suggestInterventionsFlow(input);
}

const interventionPrompt = ai.definePrompt({
  name: 'interventionPrompt',
  input: {
    schema: z.object({
      activity: z.string().describe('The current activity of the user.'),
      location: z.string().describe('The current location of the user.'),
      stressLevel: z.string().describe('The current stress level of the user.'),
      exercises: z.array(z.string()).describe('A list of available exercises.'),
    }),
  },
  output: {
    schema: z.object({
      interventionSuggestions: z.array(z.string()).describe('A list of suggested interventions based on the user\'s current context.'),
    }),
  },
  prompt: `Based on the user\'s current context (activity: {{{activity}}}, location: {{{location}}}, stress level: {{{stressLevel}}}), suggest relevant interventions to help manage distractions.

Here are some exercises you can suggest:
{{#each exercises}}
- {{{this}}}
{{/each}}

Suggest interventions that are specific and actionable. Focus on mindfulness and quick exercises. The interventions should be no longer than 2 sentences each.
`,
});

const suggestInterventionsFlow = ai.defineFlow<
  typeof SuggestInterventionsInputSchema,
  typeof SuggestInterventionsOutputSchema
>(
  {
    name: 'suggestInterventionsFlow',
    inputSchema: SuggestInterventionsInputSchema,
    outputSchema: SuggestInterventionsOutputSchema,
  },
  async input => {
    const exercises: Exercise[] = await getExercises();
    const exerciseNames: string[] = exercises.map(exercise => exercise.name);

    const {output} = await interventionPrompt({
      ...input,
      exercises: exerciseNames,
    });
    return output!;
  }
);
