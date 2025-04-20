// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate optimal work and break intervals based on user's historical work patterns.
 *
 * - generateOptimalWorkBreak -  A function that suggests optimal work/break intervals.
 * - GenerateOptimalWorkBreakInput - The input type for the generateOptimalWorkBreak function.
 * - GenerateOptimalWorkBreakOutput - The output type for the generateOptimalWorkBreak function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getExercises, Exercise} from '@/services/exercise';

const GenerateOptimalWorkBreakInputSchema = z.object({
  historicalWorkPatterns: z
    .string()
    .describe(
      'A string containing the user historical work patterns, including focus time, break time and distractions.'
    ),
  currentDistractionRisk: z
    .number()
    .describe('The current distraction risk level of the user.'),
});

export type GenerateOptimalWorkBreakInput =
  z.infer<typeof GenerateOptimalWorkBreakInputSchema>;

const GenerateOptimalWorkBreakOutputSchema = z.object({
  workInterval: z
    .number()
    .describe('The suggested work interval in minutes.'),
  breakInterval: z
    .number()
    .describe('The suggested break interval in minutes.'),
  breakActivitySuggestion: z
    .string()
    .describe('A suggestion for an activity to do during the break.'),
});

export type GenerateOptimalWorkBreakOutput =
  z.infer<typeof GenerateOptimalWorkBreakOutputSchema>;

export async function generateOptimalWorkBreak(
  input: GenerateOptimalWorkBreakInput
): Promise<GenerateOptimalWorkBreakOutput> {
  return generateOptimalWorkBreakFlow(input);
}

const generateOptimalWorkBreakPrompt = ai.definePrompt({
  name: 'generateOptimalWorkBreakPrompt',
  input: {
    schema: z.object({
      historicalWorkPatterns: z
        .string()
        .describe(
          'A string containing the user historical work patterns, including focus time, break time and distractions.'
        ),
      currentDistractionRisk: z
        .number()
        .describe('The current distraction risk level of the user.'),
      breakActivityOptions: z
        .string()
        .describe(
          'A string containing the available break activities as options.'
        ),
    }),
  },
  output: {
    schema: z.object({
      workInterval: z
        .number()
        .describe('The suggested work interval in minutes.'),
      breakInterval: z
        .number()
        .describe('The suggested break interval in minutes.'),
      breakActivitySuggestion: z
        .string()
        .describe('A suggestion for an activity to do during the break.'),
    }),
  },
  prompt: `Based on the user's historical work patterns:
  {{{historicalWorkPatterns}}}
  and the current distraction risk level: {{{currentDistractionRisk}}},
  suggest optimal work and break intervals to maintain focus without burnout.
  Available break activity options: {{{breakActivityOptions}}}.
  Suggest a break activity that matches the user's context.
  Ensure that the work interval and break interval is in minutes.
  Do not add any additional information beyond the workInterval, breakInterval, and breakActivitySuggestion.
  Make sure the breakActivitySuggestion is from the available break activity options.
  Be succinct.
  `,
});

const generateOptimalWorkBreakFlow = ai.defineFlow<
  typeof GenerateOptimalWorkBreakInputSchema,
  typeof GenerateOptimalWorkBreakOutputSchema
>(
  {
    name: 'generateOptimalWorkBreakFlow',
    inputSchema: GenerateOptimalWorkBreakInputSchema,
    outputSchema: GenerateOptimalWorkBreakOutputSchema,
  },
  async input => {
    const exercises: Exercise[] = await getExercises();
    const breakActivityOptions = exercises
      .map(exercise => exercise.name)
      .join(', ');

    const {output} = await generateOptimalWorkBreakPrompt({
      ...input,
      breakActivityOptions,
    });
    return output!;
  }
);
