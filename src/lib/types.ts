
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
