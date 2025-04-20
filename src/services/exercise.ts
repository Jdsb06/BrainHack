/**
 * Represents an exercise with a name and description.
 */
export interface Exercise {
  /**
   * The name of the exercise.
   */
  name: string;
  /**
   * A description of the exercise.
   */
  description: string;
}

/**
 * Asynchronously retrieves a list of exercises.
 *
 * @returns A promise that resolves to an array of Exercise objects.
 */
export async function getExercises(): Promise<Exercise[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      name: 'Deep Breathing',
      description: 'Inhale deeply, hold for a few seconds, and exhale slowly.',
    },
    {
      name: 'Quick Meditation',
      description: 'Close your eyes and focus on your breath for 5 minutes.',
    },
  ];
}
