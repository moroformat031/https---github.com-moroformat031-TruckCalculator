
export type Item = {
  sku: string;
  quantity: number;
};

export type TruckSuggestion = {
  truckType: 'LTL' | 'Half Truck' | 'Full Truck';
  trucksNeeded: number;
  packingNotes: string;
};

export type ItemWithData = Item & {
    description?: string;
    category?: 'TPO' | 'Accessory' | 'ISO';
    weightLbs?: number;
    lengthInches?: number;
    widthInches?: number;
    heightInches?: number;
    rollsPerPallet?: number;
    qtyPerPallet?: number;
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
