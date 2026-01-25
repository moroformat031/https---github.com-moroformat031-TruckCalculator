
'use server';

/**
 * @fileOverview Estimates the truck requirements for a given set of SKUs and quantities, utilizing AI when weight and dimensions are unavailable.
 *
 * - estimateTruckRequirements - A function that estimates the truck requirements.
 * - EstimateTruckRequirementsInput - The input type for the estimateTruckRequirements function.
 */

import {ai} from '@/ai/genkit';
import type { EstimateTruckRequirementsOutput } from '@/lib/types';
import {z} from 'genkit';

const EstimateTruckRequirementsInputSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string().describe('The stock keeping unit (SKU) of the item.'),
      quantity: z.number().int().positive().describe('The quantity of the item.'),
      weightLbs: z.number().optional().describe('The weight of a single item in pounds.'),
      lengthInches: z.number().optional().describe('The length of a single item in inches.'),
      widthInches: z.number().optional().describe('The width of a single item in inches.'),
      heightInches: z.number().optional().describe('The height of a single item in inches.'),
    })
  ).describe('An array of items to be shipped.'),
});

export type EstimateTruckRequirementsInput = z.infer<typeof EstimateTruckRequirementsInputSchema>;

const TruckRecommendationSchema = z.object({
  truckType: z.enum(['LTL', 'Half Truck', 'Full Truck']).describe('The recommended truck type (LTL, Half Truck, or Full Truck).'),
  numberOfTrucks: z.number().int().describe('The estimated number of trucks needed.'),
  reasoning: z.string().describe('The reasoning behind the truck recommendation.'),
  linearFeet: z.number().describe('The estimated total linear feet required.'),
});

const EstimateTruckRequirementsOutputSchema = z.object({
  truckRecommendation: TruckRecommendationSchema.describe('The recommendation for the truck requirements.')
});


export async function estimateTruckRequirements(input: EstimateTruckRequirementsInput): Promise<EstimateTruckRequirementsOutput> {
  return estimateTruckRequirementsFlow(input);
}

const estimateTruckRequirementsPrompt = ai.definePrompt({
  name: 'estimateTruckRequirementsPrompt',
  input: {schema: EstimateTruckRequirementsInputSchema},
  output: {schema: EstimateTruckRequirementsOutputSchema},
  prompt: `You are a logistics expert specializing in truckload optimization. Analyze the following order details and determine the optimal truck configuration.

Consider these constraints:
*   Maximum truck weight: 42,000 lbs
*   Full truck length: 48 ft
*   Half truck length: 24 ft
*   LTL (Less than Truckload): <14 ft

Items:
{{#each items}}
*   SKU: {{sku}}, Quantity: {{quantity}}
    {{#if weightLbs}}
    , Weight: {{weightLbs}} lbs
    {{else}}
    , Weight: Not provided - please estimate.
    {{/if}}
    {{#if lengthInches}}
    , Dimensions: {{lengthInches}}x{{widthInches}}x{{heightInches}} inches
    {{else}}
    , Dimensions: Not provided - please estimate.
    {{/if}}
{{/each}}

Based on the items' properties (estimating where necessary), their quantities, and the truck constraints, determine the truck type, number of trucks required, and estimate the total linear feet.

Provide a detailed reasoning for your recommendation.

Return the output in JSON format. Ensure you include the estimated 'linearFeet' in the response.
`,
});

const estimateTruckRequirementsFlow = ai.defineFlow(
  {
    name: 'estimateTruckRequirementsFlow',
    inputSchema: EstimateTruckRequirementsInputSchema,
    outputSchema: EstimateTruckRequirementsOutputSchema,
  },
  async input => {
    const {output} = await estimateTruckRequirementsPrompt(input);
    return output!;
  }
);
