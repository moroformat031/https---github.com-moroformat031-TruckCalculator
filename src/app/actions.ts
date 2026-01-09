
'use server';

import { estimateTruckRequirements, type EstimateTruckRequirementsOutput } from '@/ai/flows/estimate-truck-requirements';
import { providePackingSuggestions, type PackingSuggestionsInput, type PackingSuggestionsOutput } from '@/ai/flows/provide-packing-suggestions';
import { skuData } from '@/lib/sku-data';
import type { Item, ItemWithData } from '@/lib/types';
import { z } from 'zod';

const itemsSchema = z.array(
    z.object({
      sku: z.string(),
      quantity: z.number(),
    })
);

function combineSuggestions(
  packing: PackingSuggestionsOutput,
  estimation: EstimateTruckRequirementsOutput
): PackingSuggestionsOutput {
  
  // Simple combination logic: For now, we'll just append notes
  // and take the more "major" truck type. A more complex logic could be to 
  // combine linear feet or weight and re-evaluate the truck type.
  const truckOrder = ['LTL', 'Half Truck', 'Full Truck'];
  const packingTruckIndex = truckOrder.indexOf(packing.truckType);
  const estimationTruckIndex = truckOrder.indexOf(estimation.truckRecommendation.truckType);

  const combinedTruckType = packingTruckIndex > estimationTruckIndex ? packing.truckType : estimation.truckRecommendation.truckType;
  const combinedTrucksNeeded = Math.max(packing.trucksNeeded, estimation.truckRecommendation.numberOfTrucks);

  return {
    truckType: combinedTruckType,
    trucksNeeded: combinedTrucksNeeded,
    packingNotes: `${packing.packingNotes}\n\n--- Additional Items Estimation ---\n${estimation.truckRecommendation.reasoning}`,
  };
}


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
  
  if (itemsWithData.length === 0) {
    throw new Error('No items to calculate.');
  }

  // Items that have the necessary data for the detailed packing flow
  const itemsForPacking: PackingSuggestionsInput['items'] = itemsWithData.filter(item => 
    item.category && 
    (item.rollsPerPallet || item.qtyPerPallet) && 
    item.palletLength &&
    item.weightLbs
  );

  // Items that are missing some data and need the general estimation flow
  const itemsForEstimation = itemsWithData.filter(item => 
    !itemsForPacking.find(p => p.sku === item.sku)
  ).map(item => ({
    sku: item.sku,
    quantity: item.quantity,
    weightLbs: item.weightLbs,
    lengthInches: item.lengthInches,
    widthInches: item.widthInches,
    heightInches: item.heightInches
  }));

  try {
    const packingPromise = itemsForPacking.length > 0 ? providePackingSuggestions({ items: itemsForPacking }) : Promise.resolve(null);
    const estimationPromise = itemsForEstimation.length > 0 ? estimateTruckRequirements({ items: itemsForEstimation }) : Promise.resolve(null);

    const [packingSuggestion, estimationResult] = await Promise.all([packingPromise, estimationPromise]);
    
    if (packingSuggestion && estimationResult) {
      return combineSuggestions(packingSuggestion, estimationResult);
    }

    if (packingSuggestion) {
      return packingSuggestion;
    }

    if (estimationResult) {
      return {
        truckType: estimationResult.truckRecommendation.truckType,
        trucksNeeded: estimationResult.truckRecommendation.numberOfTrucks,
        packingNotes: estimationResult.truckRecommendation.reasoning,
      };
    }
    
    // This case should not be reached if there are items, but as a fallback:
    throw new Error('Could not calculate truck requirements for the items provided.');

  } catch (error) {
    console.error('Error getting truck suggestion:', error);
    throw new Error('An error occurred while calculating the truck requirements. Please try again.');
  }
}
