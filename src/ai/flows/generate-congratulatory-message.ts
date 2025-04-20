'use server';
/**
 * @fileOverview Generates a personalized congratulatory message when a goal is completed.
 *
 * - generateCongratulatoryMessage - A function that generates a congratulatory message.
 * - GenerateCongratulatoryMessageInput - The input type for the generateCongratulatoryMessage function.
 * - GenerateCongratulatoryMessageOutput - The return type for the generateCongratulatoryMessage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateCongratulatoryMessageInputSchema = z.object({
  goalTitle: z.string().describe('The title of the completed goal.'),
  userName: z.string().describe('The name of the user who completed the goal.'),
  streak: z.number().describe('The number of consecutive goals completed.'),
});
export type GenerateCongratulatoryMessageInput = z.infer<
  typeof GenerateCongratulatoryMessageInputSchema
>;

const GenerateCongratulatoryMessageOutputSchema = z.object({
  message: z.string().describe('The personalized congratulatory message.'),
});
export type GenerateCongratulatoryMessageOutput = z.infer<
  typeof GenerateCongratulatoryMessageOutputSchema
>;

export async function generateCongratulatoryMessage(
  input: GenerateCongratulatoryMessageInput
): Promise<GenerateCongratulatoryMessageOutput> {
  return generateCongratulatoryMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCongratulatoryMessagePrompt',
  input: {
    schema: z.object({
      goalTitle: z.string().describe('The title of the completed goal.'),
      userName: z.string().describe('The name of the user who completed the goal.'),
      streak: z.number().describe('The number of consecutive goals completed.'),
    }),
  },
  output: {
    schema: z.object({
      message: z.string().describe('The personalized congratulatory message.'),
    }),
  },
  prompt: `Congratulations, {{{userName}}}! You've completed your goal: {{{goalTitle}}}.  Way to go!

You're on a streak of {{{streak}}} goals completed.  Keep up the great work!

Write a personalized congratulatory message to the user to celebrate their achievement, in under 100 words.`,
});

const generateCongratulatoryMessageFlow = ai.defineFlow<
  typeof GenerateCongratulatoryMessageInputSchema,
  typeof GenerateCongratulatoryMessageOutputSchema
>(
  {
    name: 'generateCongratulatoryMessageFlow',
    inputSchema: GenerateCongratulatoryMessageInputSchema,
    outputSchema: GenerateCongratulatoryMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
