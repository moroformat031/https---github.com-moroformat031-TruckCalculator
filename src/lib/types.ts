
export type Item = {
  sku: string;
  quantity: number;
};

export type TruckSuggestion = {
  truckType: 'LTL' | 'Half Truck' | 'Full Truck' | 'Mixed';
  trucksNeeded: number;
  packingNotes: string;
  linearFeet: number;
  aiUsage?: { count: number; remaining: number; limit: number };
};

export type AiUsage = {
  date: string;
  count: number;
  remaining: number;
  limit: number;
};

export type ItemWithData = Item & {
    description?: string;
    category?: 'TPO' | 'Accessory' | 'ISO' | 'Metal';
    unitOfMeasure?: string;
    weightLbs?: number;
    lengthInches?: number;
    widthInches?: number;
    heightInches?: number;
    rollsPerPallet?: number;
    qtyPerPallet?: number;
    boardsPerPallet?: number;
    palletLength?: number;
};

// This was previously in actions.ts, but types are better defined here.
export type EstimateTruckRequirementsOutput = {
  truckRecommendation: {
    truckType: 'LTL' | 'Half Truck' | 'Full Truck';
    numberOfTrucks: number;
    reasoning: string;
    linearFeet: number;
  };
};
