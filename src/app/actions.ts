
'use server';

import { estimateTruckRequirements, type EstimateTruckRequirementsInput } from '@/ai/flows/estimate-truck-requirements';
import { providePackingSuggestions, type PackingSuggestionsOutput } from '@/ai/flows/provide-packing-suggestions';
import { skuData } from '@/lib/sku-data';
import type { Item, ItemWithData } from '@/lib/types';
import { z } from 'zod';

const itemsSchema = z.array(
    z.object({
      sku: z.string(),
      quantity: z.number(),
    })
);

export async function getTruckSuggestion(items: Item[]): Promise<PackingSuggestionsOutput> {
  const parsedItems = itemsSchema.safeParse(items);
  if (!parsedItems.success) {
      throw new Error("Invalid items provided.");
  }
  
  const itemsWithData: ItemWithData[] = parsedItems.data.map(item => {
    const data = skuData[item.sku];
    return {
        ...item,
        ...data,
    };
  });

  // Separate items with full data from those needing estimation
  const itemsForPacking = itemsWithData.filter(item => 
    item.category && (item.rollsPerPallet || item.qtyPerPallet) && item.palletLength
  );

  const itemsForEstimation = itemsWithData.filter(item => 
    !itemsForPacking.includes(item)
  ).map(item => ({
    sku: item.sku,
    quantity: item.quantity,
    weightLbs: item.weightLbs,
    lengthInches: item.lengthInches,
    widthInches: item.widthInches,
    heightInches: item.heightInches
  }));

  try {
    let packingSuggestion: PackingSuggestionsOutput = {
        truckType: 'LTL',
        trucksNeeded: 1,
        packingNotes: '',
    };

    if (itemsForPacking.length > 0) {
        packingSuggestion = await providePackingSuggestions({ items: itemsForPacking });
    }
    
    if (itemsForEstimation.length > 0) {
      const estimationInput: EstimateTruckRequirementsInput = { items: itemsForEstimation };
      const estimationResult = await estimateTruckRequirements(estimationInput);
      
      // Combine results if needed, or just append notes.
      // This is a simplified combination logic.
      if (itemsForPacking.length === 0) {
        return {
          truckType: estimationResult.truckRecommendation.truckType,
          trucksNeeded: estimationResult.truckRecommendation.numberOfTrucks,
          packingNotes: estimationResult.truckRecommendation.reasoning,
        };
      } else {
         packingSuggestion.packingNotes += `\n\n--- Additional Items Estimation ---\n${estimationResult.truckRecommendation.reasoning}`;
         // A more complex logic could be to combine linear feet or weight and re-evaluate the truck type.
         // For now, we'll just append the notes.
      }
    }
    
    if(itemsForPacking.length === 0 && itemsForEstimation.length === 0) {
        throw new Error('No items to calculate.');
    }

    return packingSuggestion;

  } catch (error) {
    console.error('Error getting truck suggestion:', error);
    throw new Error('An error occurred while calculating the truck requirements. Please try again.');
  }
}
