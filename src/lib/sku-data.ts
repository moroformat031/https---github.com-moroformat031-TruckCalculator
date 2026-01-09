
export type SkuData = {
  [sku: string]: {
    description: string;
    category: 'TPO' | 'Accessory';
    weightLbs?: number;
    lengthInches?: number;
    widthInches?: number;
    heightInches?: number;
    rollsPerPallet?: number; // For TPO
    qtyPerPallet?: number; // For Accessories
    palletLength?: number;
  };
};

export const skuData: SkuData = {
    '600000001051': { description: 'Primer 1 Gal Pail 6ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 44, palletLength: 4 },
    '600000001052': { description: 'TPO Membrane Cleaner 1 Gal 4/box', category: 'Accessory', qtyPerPallet: 40, weightLbs: 33, palletLength: 4 },
    '600000001041': { description: 'LVOC Sprayable Bonding Adhesive Canis', category: 'Accessory', qtyPerPallet: 40, weightLbs: 45, palletLength: 4 },
    '600000001055': { description: 'General Purpose LVOC Sealant White 10.1', category: 'Accessory', qtyPerPallet: 40, weightLbs: 22, palletLength: 4 },
    '600000001057': { description: 'White One-Part Pourable Sealer 2L/4ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 30, palletLength: 4 },
    '600000001042': { description: 'Low-Rise Foam Adhesive Cartridge 1500mL', category: 'Accessory', qtyPerPallet: 40, weightLbs: 12, palletLength: 4 },
    '600000001040': { description: 'TPO Membrane Bonding Adhesive 5 Gal C', category: 'Accessory', qtyPerPallet: 40, weightLbs: 39, palletLength: 4 },
    '600000001004': { description: 'TPO 045 Membrane 10\' x 100\' White', category: 'TPO', rollsPerPallet: 8, weightLbs: 225, palletLength: 10 },
    '600000001001': { description: 'TPO 045 Membrane 5\' x 100\' White', category: 'TPO', rollsPerPallet: 8, weightLbs: 113, palletLength: 5 },
    '600000001006': { description: 'TPO 060 Membrane 5\' x 100\' White', category: 'TPO', rollsPerPallet: 8, weightLbs: 150, palletLength: 5 },
    '600000001007': { description: 'TPO 060 Membrane 6\' x 100\' White', category: 'TPO', rollsPerPallet: 8, weightLbs: 180, palletLength: 6 },
    '600000001009': { description: 'TPO 060 Membrane 10\' x 100\' White', category: 'TPO', rollsPerPallet: 8, weightLbs: 300, palletLength: 10 },
    '600000001308': { description: '#12 Fasteners 2-1/4" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 8, palletLength: 4 },
    '600000001309': { description: '#12 Fasteners 3" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 24, palletLength: 4 },
    '600000001310': { description: '#12 Fasteners 4" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 31, palletLength: 4 },
    '600000001311': { description: '#12 Fasteners 5" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 35, palletLength: 4 },
    '600000001312': { description: '#12 Fasteners 6" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 40, palletLength: 4 },
    '600000001313': { description: '#12 Fasteners 7" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 48, palletLength: 4 },
    '600000001314': { description: '#12 Fasteners 8" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 50, palletLength: 4 },
    '600000001031': { description: '#15 Fasteners 2" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 20, palletLength: 4 },
    '600000001315': { description: '#15 Fasteners 3" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 29, palletLength: 4 },
    '600000001316': { description: '#15 Fasteners 4" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 38, palletLength: 4 },
    '600000001317': { description: '#15 Fasteners 5" 500ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 20, palletLength: 4 },
    '600000001318': { description: '#15 Fasteners 6" 500ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 28, palletLength: 4 },
    '600000001319': { description: '#15 Fasteners 7" 500ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 34, palletLength: 4 },
    '600000001320': { description: '#15 Fasteners 8" 500ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 35, palletLength: 4 },
    '600000001321': { description: '#15 Fasteners 9" 500ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 50, palletLength: 4 },
    '600000001322': { description: '#15 Fasteners 10" 500ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 47, palletLength: 4 },
    '600000001023': { description: 'TPO Molded Corner Mold Universal White', category: 'Accessory', qtyPerPallet: 40, weightLbs: 6, palletLength: 4 },
    '600000001058': { description: 'TPO Penetration Pocket 6ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 7.2, palletLength: 4 },
    '600000001027': { description: 'Throughwall Scuppers 2ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 11, palletLength: 4 },
    '600000001024': { description: 'TPO Pipe Boots White 1" to 6" 10ct/box', category: 'Accessory', qtyPerPallet: 40, weightLbs: 9, palletLength: 4 },
    '600000001017': { description: 'TPO T-Joint Cover White 100ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 3.2, palletLength: 4 },
    '600000001016': { description: 'Flashing 060 24"x50\' URF White 1roll', category: 'Accessory', qtyPerPallet: 40, weightLbs: 56, palletLength: 4 },
    '600000001018': { description: 'White TPO Cover Tape URF 6" x 100\' 2/box', category: 'Accessory', qtyPerPallet: 40, weightLbs: 48, palletLength: 4 },
    '600000001352': { description: 'TPO Sprayable Bonding Adhesive 6\' Hose', category: 'Accessory', qtyPerPallet: 40, weightLbs: 1, palletLength: 4 },
    '600000001353': { description: 'TPO Sprayable Bonding Adhesive 12\' Hosi', category: 'Accessory', qtyPerPallet: 40, weightLbs: 2, palletLength: 4 },
    '600000001049': { description: 'TPO Spray Applicator Replacement Tips', category: 'Accessory', qtyPerPallet: 40, weightLbs: 1, palletLength: 4 },
    '600000001028': { description: 'Roof Drain White', category: 'Accessory', qtyPerPallet: 40, weightLbs: 0, palletLength: 4 },
    '600000001036': { description: 'TPO Induction Welding Plate 500ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 35, palletLength: 4 },
    '600000001038': { description: 'Square Insulation Plate 3" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 43, palletLength: 4 },
    '600000001035': { description: 'Seam Plate 2-3/8" 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 50, palletLength: 4 },
    '600000001039': { description: 'Termination Bar', category: 'Accessory', qtyPerPallet: 40, weightLbs: 86, palletLength: 4 },
    '600000001032': { description: 'Fasteners Zamac Nailing 1000ct', category: 'Accessory', qtyPerPallet: 40, weightLbs: 12, palletLength: 4 },
};
