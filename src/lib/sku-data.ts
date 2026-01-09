
export type SkuData = {
  [sku: string]: {
    description: string;
    category: 'TPO' | 'Accessory';
    weightLbs?: number;
    lengthInches?: number;
    widthInches?: number;
    heightInches?: number;
    rollsPerPallet?: number;
  };
};

export const skuData: SkuData = {
    // TPO
    'TPO-W-4-5-100': { description: 'TPO White 4.5\' x 100\'', category: 'TPO', rollsPerPallet: 16, lengthInches: 54 },
    'TPO-W-6-100': { description: 'TPO White 6\' x 100\'', category: 'TPO', rollsPerPallet: 16, lengthInches: 72 },
    'TPO-W-8-100': { description: 'TPO White 8\' x 100\'', category: 'TPO', rollsPerPallet: 12, lengthInches: 96 },
    'TPO-W-10-100': { description: 'TPO White 10\' x 100\'', category: 'TPO', rollsPerPallet: 12, lengthInches: 120 },
    'TPO-W-12-100': { description: 'TPO White 12\' x 100\'', category: 'TPO', rollsPerPallet: 12, lengthInches: 144 },

    'TPO-T-4-5-100': { description: 'TPO Tan 4.5\' x 100\'', category: 'TPO', rollsPerPallet: 16, lengthInches: 54 },
    'TPO-T-6-100': { description: 'TPO Tan 6\' x 100\'', category: 'TPO', rollsPerPallet: 16, lengthInches: 72 },
    'TPO-T-8-100': { description: 'TPO Tan 8\' x 100\'', category: 'TPO', rollsPerPallet: 12, lengthInches: 96 },
    'TPO-T-10-100': { description: 'TPO Tan 10\' x 100\'', category: 'TPO', rollsPerPallet: 12, lengthInches: 120 },
    'TPO-T-12-100': { description: 'TPO Tan 12\' x 100\'', category: 'TPO', rollsPerPallet: 12, lengthInches: 144 },

    'TPO-G-4-5-100': { description: 'TPO Gray 4.5\' x 100\'', category: 'TPO', rollsPerPallet: 16, lengthInches: 54 },
    'TPO-G-6-100': { description: 'TPO Gray 6\' x 100\'', category: 'TPO', rollsPerPallet: 16, lengthInches: 72 },
    'TPO-G-8-100': { description: 'TPO Gray 8\' x 100\'', category: 'TPO', rollsPerPallet: 12, lengthInches: 96 },
    'TPO-G-10-100': { description: 'TPO Gray 10\' x 100\'', category: 'TPO', rollsPerPallet: 12, lengthInches: 120 },
    'TPO-G-12-100': { description: 'TPO Gray 12\' x 100\'', category: 'TPO', rollsPerPallet: 12, lengthInches: 144 },

    // Accessories
    'TPO-CW-P': { description: 'TPO Cover Tape White 6" x 100\'', category: 'Accessory' },
    'TPO-CT-P': { description: 'TPO Cover Tape Tan 6" x 100\'', category: 'Accessory' },
    'TPO-CG-P': { description: 'TPO Cover Tape Gray 6" x 100\'', category: 'Accessory' },
    'TPO-IW-P': { description: 'TPO Inside/Outside Corner White', category: 'Accessory' },
    'TPO-IT-P': { description: 'TPO Inside/Outside Corner Tan', category: 'Accessory' },
    'TPO-IG-P': { description: 'TPO Inside/Outside Corner Gray', category: 'Accessory' },
    'TPO-PBW-P': { description: 'TPO Pipe Boot White', category: 'Accessory' },
    'TPO-PBT-P': { description: 'TPO Pipe Boot Tan', category: 'Accessory' },
    'TPO-PBG-P': { description: 'TPO Pipe Boot Gray', category: 'Accessory' },
    'TPO-SW-P': { description: 'TPO Seam Sealant White', category: 'Accessory' },
    'TPO-SC-P': { description: 'TPO Seam Cleaner', category: 'Accessory' },
    'TPO-S-P': { description: 'TPO Screws', category: 'Accessory' },
    'TPO-P-P': { description: 'TPO Plates', category: 'Accessory' },
  };
