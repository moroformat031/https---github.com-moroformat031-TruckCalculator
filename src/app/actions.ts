
'use server';

import { estimateTruckRequirements, type EstimateTruckRequirementsInput } from '@/ai/flows/estimate-truck-requirements';
import { providePackingSuggestions, type PackingSuggestionsInput, type PackingSuggestionsOutput } from '@/ai/flows/provide-packing-suggestions';
import { skuData } from '@/lib/sku-data';
import type { Item, ItemWithData, EstimateTruckRequirementsOutput } from '@/lib/types';
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
  
  if (itemsWithData.length === 0) {
    throw new Error('No items to calculate.');
  }

  // Items that have the necessary data for the detailed packing flow
  const itemsForPacking: PackingSuggestionsInput['items'] = itemsWithData.filter(item => 
    item.category && 
    (item.rollsPerPallet || item.qtyPerPallet) && 
    item.palletLength &&
    item.weightLbs
  ).map(item => ({ // ensure only needed properties are passed
    sku: item.sku,
    quantity: item.quantity,
    description: item.description,
    category: item.category,
    weightLbs: item.weightLbs,
    palletLength: item.palletLength,
    rollsPerPallet: item.rollsPerPallet,
    qtyPerPallet: item.qtyPerPallet,
  }));

  // Items that are missing some data and need the general estimation flow
  const itemsForEstimation: EstimateTruckRequirementsInput['items'] = itemsWithData.filter(item => 
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
    // Log the inputs so we can trace problematic SKUs/quantities
    console.info('Calculating truck suggestion. itemsWithData:', itemsWithData);
    console.info('itemsForPacking:', itemsForPacking);
    console.info('itemsForEstimation:', itemsForEstimation);

    // Run each flow separately and capture their errors so we can tell which one fails.
    let packingResult = null;
    let estimationResult = null;

    if (itemsForPacking.length > 0) {
      try {
        packingResult = await providePackingSuggestions({ items: itemsForPacking });
      } catch (err) {
        console.error('providePackingSuggestions failed. input:', itemsForPacking, 'error:', err);
        // Re-throw the original error to preserve the message for debugging.
        throw err;
      }
    }

    if (itemsForEstimation.length > 0) {
      try {
        estimationResult = await estimateTruckRequirements({ items: itemsForEstimation });
      } catch (err) {
        console.error('estimateTruckRequirements failed. input:', itemsForEstimation, 'error:', err);
        throw err;
      }
    }
    
    // Case 1: Only packing suggestions are available.
    if (packingResult && !estimationResult) {
      return packingResult;
    }

    // Case 2: Only estimation results are available.
    if (!packingResult && estimationResult) {
      return {
        truckType: estimationResult.truckRecommendation.truckType,
        trucksNeeded: estimationResult.truckRecommendation.numberOfTrucks,
        packingNotes: estimationResult.truckRecommendation.reasoning,
      };
    }
    
    // Case 3: Both results are available, combine them.
    if (packingResult && estimationResult) {
      const truckOrder = ['LTL', 'Half Truck', 'Full Truck'];
      const packingTruckIndex = truckOrder.indexOf(packingResult.truckType);
      const estimationTruckIndex = truckOrder.indexOf(estimationResult.truckRecommendation.truckType);

      // Default to the larger truck type if they differ.
      const combinedTruckType = packingTruckIndex > estimationTruckIndex 
        ? packingResult.truckType 
        : estimationResult.truckRecommendation.truckType;
      
      // Sum the number of trucks needed.
      const combinedTrucksNeeded = packingResult.trucksNeeded + estimationResult.truckRecommendation.numberOfTrucks;

      return {
        truckType: combinedTruckType,
        trucksNeeded: combinedTrucksNeeded,
        packingNotes: `--- Detailed Packing Plan ---\n${packingResult.packingNotes}\n\n--- Additional Items Estimation ---\n${estimationResult.truckRecommendation.reasoning}`,
      };
    }

    // Case 4: No results could be generated (should not be reached if items are provided).
    throw new Error('Could not calculate truck requirements for the items provided.');

  } catch (error) {
    console.error('Error getting truck suggestion:', error);
    // Re-throwing a more user-friendly message
    if (error instanceof Error && error.message.includes('DEADLINE_EXCEEDED')) {
       throw new Error('The calculation took too long to complete. Please try again with fewer items.');
    }

    // If the AI flow fails due to schema incompatibility or missing API key, fall back to a simple local estimator.
    if (error instanceof Error && (error.message.includes('exclusiveMinimum') || error.message.includes('Please pass in the API key') || error.message.includes('FAILED_PRECONDITION'))) {
      console.warn('Falling back to local estimator due to AI flow error.');

      // Local estimation (basic implementation mirroring packing rules in the prompt)
      // Calculate accessory pallets
      const accessoryPallets = itemsWithData
        .filter(i => i.category === 'Accessory' && i.qtyPerPallet)
        .reduce((sum, it) => sum + Math.ceil((it.quantity || 0) / (it.qtyPerPallet || 1)), 0);

      // Calculate TPO pallets grouped by palletLength
      const tpoByLength = new Map<number, number>();
      itemsWithData.filter(i => i.category === 'TPO' && i.rollsPerPallet && i.palletLength).forEach(it => {
        const pallets = Math.ceil((it.quantity || 0) / (it.rollsPerPallet || 1));
        const len = it.palletLength as number;
        tpoByLength.set(len, (tpoByLength.get(len) || 0) + pallets);
      });

      // Compute linear feet for TPO
      let tpoLinearFeet = 0;
      for (const [len, pallets] of tpoByLength.entries()) {
        const floorSpots = Math.ceil(pallets / 4); // 4 pallets per floor spot (2-wide x 2-high)
        tpoLinearFeet += floorSpots * len;
      }

      // Accessories linear feet (assume 4ft pallet length)
      const accessoryLinearFeet = Math.ceil(accessoryPallets / 4) * 4;

      const totalLinearFeet = tpoLinearFeet + accessoryLinearFeet;

      // Decide truck type and count
      let truckType: 'LTL' | 'Half Truck' | 'Full Truck' = 'LTL';
      let trucksNeeded = 1;
      if (totalLinearFeet < 14) {
        truckType = 'LTL';
        trucksNeeded = 1;
      } else if (totalLinearFeet <= 24) {
        truckType = 'Half Truck';
        trucksNeeded = 1;
      } else if (totalLinearFeet <= 48) {
        truckType = 'Full Truck';
        trucksNeeded = 1;
      } else {
        truckType = 'Full Truck';
        trucksNeeded = Math.ceil(totalLinearFeet / 48);
      }

      const packingNotes = `Local estimate used. totalLinearFeet=${totalLinearFeet}, tpoLinearFeet=${tpoLinearFeet}, accessoryLinearFeet=${accessoryLinearFeet}, accessoryPallets=${accessoryPallets}`;

      return {
        truckType,
        trucksNeeded,
        packingNotes,
      };
    }

    throw new Error('An error occurred while calculating the truck requirements. Please try again.');
  }
}
