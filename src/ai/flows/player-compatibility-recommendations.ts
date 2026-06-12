'use server';
/**
 * @fileOverview This file provides a Genkit flow for analyzing gaming preferences
 * and opinions to recommend compatible players.
 *
 * - getPlayerCompatibilityRecommendations - A function that recommends compatible players.
 * - PlayerCompatibilityRecommendationsInput - The input type for the function.
 * - PlayerCompatibilityRecommendationsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PlayerCompatibilityRecommendationsInputSchema = z.object({
  currentPlayerProfile: z
    .string()
    .describe("The current player's detailed gaming preferences, opinions, playstyle, and interests."),
  potentialTeammates: z
    .array(
      z.object({
        id: z.string().describe('The unique identifier for the potential teammate.'),
        profile: z
          .string()
          .describe("The potential teammate's detailed gaming preferences, opinions, playstyle, and interests."),
      })
    )
    .describe('A list of potential teammates, each with their ID and a description of their gaming profile.'),
});
export type PlayerCompatibilityRecommendationsInput = z.infer<
  typeof PlayerCompatibilityRecommendationsInputSchema
>;

const PlayerCompatibilityRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({ playerId: z.string(), compatibilityReason: z.string().describe('A brief explanation of why this player is compatible or not with the current player.') })
    )
    .describe('A list of recommended players with their IDs and a reason for their compatibility.'),
});
export type PlayerCompatibilityRecommendationsOutput = z.infer<
  typeof PlayerCompatibilityRecommendationsOutputSchema
>;

export async function getPlayerCompatibilityRecommendations(
  input: PlayerCompatibilityRecommendationsInput
): Promise<PlayerCompatibilityRecommendationsOutput> {
  return playerCompatibilityRecommendationsFlow(input);
}

const playerCompatibilityPrompt = ai.definePrompt({
  name: 'playerCompatibilityPrompt',
  input: { schema: PlayerCompatibilityRecommendationsInputSchema },
  output: { schema: PlayerCompatibilityRecommendationsOutputSchema },
  prompt: `You are an expert gaming matchmaker. Your task is to analyze a player's profile and compare it with several potential teammates' profiles.
For each potential teammate, determine their compatibility with the main player and provide a concise reason.

Current Player Profile:
{{{currentPlayerProfile}}}

Potential Teammates:
{{#each potentialTeammates}}
Player ID: {{{id}}}
Profile: {{{profile}}}
---
{{/each}}

Output your recommendations in JSON format, listing each 'playerId' and a 'compatibilityReason'.`,
});

const playerCompatibilityRecommendationsFlow = ai.defineFlow(
  {
    name: 'playerCompatibilityRecommendationsFlow',
    inputSchema: PlayerCompatibilityRecommendationsInputSchema,
    outputSchema: PlayerCompatibilityRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await playerCompatibilityPrompt(input);
    return output!;
  }
);
