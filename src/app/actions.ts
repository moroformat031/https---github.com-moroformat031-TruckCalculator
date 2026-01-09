
'use server';

import { providePackingSuggestions, type PackingSuggestionsInput, type PackingSuggestionsOutput } from '@/ai/flows/provide-packing-suggestions';
import { skuData } from '@/lib/sku-data';
import { z } from 'zod';

const itemsSchema = z.array(
    z.object({
      sku: z.string(),
      quantity: z.number(),
    })
);

export async function getTruckSuggestion(items: PackingSuggestionsInput['items']): Promise<PackingSuggestionsOutput> {
  const parsedItems = itemsSchema.safeParse(items);
  if (!parsedItems.success) {
      throw new Error("Invalid items provided.");
  }
  
  const itemsWithData = parsedItems.data.map(item => {
    const data = skuData[item.sku];
    return {
        ...item,
        ...data,
    };
  });

  try {
    const result = await providePackingSuggestions({ items: itemsWithData });
    return result;
  } catch (error) {
    console.error('Error getting truck suggestion:', error);
    throw new Error('An error occurred while calculating the truck requirements. Please try again.');
  }
}
