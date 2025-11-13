// Field configuration for displaying listing details
// Maps category/subcategory to their specific fields for structured display

export interface FieldConfig {
  key: string;
  label: string;
  group?: string;
  format?: (value: any) => string | undefined;
  showWhen?: (listing: any) => boolean;
}

// Base fields common to all listings
export const BASE_FIELDS: Record<string, FieldConfig[]> = {
  essentials: [
    { key: 'brand', label: 'Brand', group: 'Essentials' },
    { key: 'age', label: 'Age / Used For', group: 'Essentials' },
    { key: 'condition', label: 'Condition', group: 'Essentials', format: (v) => v?.replace(/_/g, ' ') },
  ],
  pricing: [
    { key: 'price', label: 'Current Price', group: 'Pricing', format: (v) => `₹${parseFloat(v).toLocaleString('en-IN')}` },
    { key: 'originalPrice', label: 'Original Price', group: 'Pricing', format: (v) => v ? `₹${parseFloat(v).toLocaleString('en-IN')}` : undefined },
    { key: 'isNegotiable', label: 'Negotiable', group: 'Pricing', format: (v) => v === 1 ? 'Yes' : 'No' },
  ],
  documentation: [
    { key: 'billAvailability', label: 'Bill / Invoice Available', group: 'Documentation' },
    { key: 'warranty', label: 'Warranty', group: 'Documentation' },
    { key: 'buyDate', label: 'Purchase Date', group: 'Documentation', format: (v) => v ? new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined },
  ],
  usage: [
    { key: 'productUsageLevel', label: 'Usage Level', group: 'Usage', format: (v) => v?.replace(/_/g, ' ') },
    { key: 'accessories', label: 'Accessories Included', group: 'Included Items' },
    { key: 'issues', label: 'Known Issues', group: 'Condition & History' },
  ],
};

// Category-specific fields mapped from SUBCATEGORY_FIELDS
export const SUBCATEGORY_FIELDS_CONFIG: Record<string, Record<string, FieldConfig[]>> = {
  electronics: {
    Mobile: [
      { key: 'model', label: 'Model', group: 'Specifications' },
      { key: 'storage', label: 'Storage', group: 'Specifications' },
      { key: 'ram', label: 'RAM', group: 'Specifications' },
      { key: 'battery', label: 'Battery Health', group: 'Condition & History' },
      { key: 'boxAvailability', label: 'Box Available', group: 'Included Items' },
    ],
    Laptop: [
      { key: 'model', label: 'Model', group: 'Specifications' },
      { key: 'processor', label: 'Processor', group: 'Specifications' },
      { key: 'ram', label: 'RAM', group: 'Specifications' },
      { key: 'storage', label: 'Storage', group: 'Specifications' },
      { key: 'graphics', label: 'Graphics Card', group: 'Specifications' },
      { key: 'screenSize', label: 'Screen Size', group: 'Specifications' },
      { key: 'boxAvailability', label: 'Box Available', group: 'Included Items' },
    ],
    Camera: [
      { key: 'model', label: 'Model', group: 'Specifications' },
      { key: 'cameraType', label: 'Camera Type', group: 'Specifications' },
      { key: 'megapixels', label: 'Megapixels', group: 'Specifications' },
      { key: 'lens', label: 'Lens Included', group: 'Specifications' },
      { key: 'shutterCount', label: 'Shutter Count', group: 'Condition & History' },
      { key: 'boxAvailability', label: 'Box Available', group: 'Included Items' },
    ],
  },
  fashion: {
    Watches: [
      { key: 'model', label: 'Model', group: 'Specifications' },
      { key: 'strapType', label: 'Strap Type', group: 'Specifications' },
      { key: 'dialType', label: 'Dial Type', group: 'Specifications' },
      { key: 'dialColor', label: 'Dial Color', group: 'Specifications' },
      { key: 'waterResistance', label: 'Water Resistance', group: 'Specifications' },
      { key: 'boxAvailability', label: 'Box Available', group: 'Included Items' },
    ],
    Footwear: [
      { key: 'size', label: 'Size', group: 'Specifications' },
      { key: 'shoeType', label: 'Type', group: 'Specifications' },
      { key: 'color', label: 'Color', group: 'Specifications' },
      { key: 'material', label: 'Material', group: 'Specifications' },
      { key: 'boxAvailability', label: 'Box Available', group: 'Included Items' },
    ],
    "Men's Clothing": [
      { key: 'clothingType', label: 'Type', group: 'Specifications' },
      { key: 'size', label: 'Size', group: 'Specifications' },
      { key: 'color', label: 'Color', group: 'Specifications' },
      { key: 'material', label: 'Material', group: 'Specifications' },
    ],
    "Women's Clothing": [
      { key: 'clothingType', label: 'Type', group: 'Specifications' },
      { key: 'size', label: 'Size', group: 'Specifications' },
      { key: 'color', label: 'Color', group: 'Specifications' },
      { key: 'material', label: 'Material', group: 'Specifications' },
    ],
    Bags: [
      { key: 'bagType', label: 'Type', group: 'Specifications' },
      { key: 'material', label: 'Material', group: 'Specifications' },
      { key: 'color', label: 'Color', group: 'Specifications' },
      { key: 'boxAvailability', label: 'Box/Dust Bag Available', group: 'Included Items' },
    ],
  },
  vehicles: {
    Bike: [
      { key: 'model', label: 'Model', group: 'Specifications' },
      { key: 'year', label: 'Year', group: 'Specifications' },
      { key: 'engineCapacity', label: 'Engine Capacity', group: 'Specifications' },
      { key: 'kmDriven', label: 'KM Driven', group: 'Usage' },
      { key: 'ownership', label: 'Ownership', group: 'History' },
      { key: 'insurance', label: 'Insurance', group: 'Documentation' },
      { key: 'documents', label: 'Documents', group: 'Documentation' },
    ],
    Scooter: [
      { key: 'model', label: 'Model', group: 'Specifications' },
      { key: 'year', label: 'Year', group: 'Specifications' },
      { key: 'engineCapacity', label: 'Engine Capacity', group: 'Specifications' },
      { key: 'kmDriven', label: 'KM Driven', group: 'Usage' },
      { key: 'ownership', label: 'Ownership', group: 'History' },
      { key: 'insurance', label: 'Insurance', group: 'Documentation' },
      { key: 'documents', label: 'Documents', group: 'Documentation' },
    ],
    Car: [
      { key: 'model', label: 'Model', group: 'Specifications' },
      { key: 'year', label: 'Year', group: 'Specifications' },
      { key: 'fuelType', label: 'Fuel Type', group: 'Specifications' },
      { key: 'kmDriven', label: 'KM Driven', group: 'Usage' },
      { key: 'ownership', label: 'Ownership', group: 'History' },
      { key: 'transmission', label: 'Transmission', group: 'Specifications' },
      { key: 'seatingCapacity', label: 'Seating Capacity', group: 'Specifications' },
      { key: 'insurance', label: 'Insurance', group: 'Documentation' },
      { key: 'documents', label: 'Documents', group: 'Documentation' },
    ],
    Bicycle: [
      { key: 'bicycleType', label: 'Type', group: 'Specifications' },
      { key: 'gears', label: 'Gears', group: 'Specifications' },
      { key: 'frameSize', label: 'Frame Size', group: 'Specifications' },
      { key: 'frameMaterial', label: 'Frame Material', group: 'Specifications' },
    ],
  },
  furniture: {
    Sofa: [
      { key: 'sofaType', label: 'Type', group: 'Specifications' },
      { key: 'material', label: 'Material', group: 'Specifications' },
      { key: 'color', label: 'Color', group: 'Specifications' },
      { key: 'dimensions', label: 'Dimensions', group: 'Specifications' },
      { key: 'assembly', label: 'Assembly Required', group: 'Specifications' },
    ],
    Bed: [
      { key: 'bedSize', label: 'Size', group: 'Specifications' },
      { key: 'material', label: 'Material', group: 'Specifications' },
      { key: 'mattressIncluded', label: 'Mattress Included', group: 'Included Items' },
      { key: 'storage', label: 'Storage', group: 'Specifications' },
    ],
  },
};

// Real estate specific fields
export const REAL_ESTATE_FIELDS: FieldConfig[] = [
  { key: 'totalSquareFeet', label: 'Total Area', group: 'Property Details', format: (v) => v ? `${v} sq.ft` : undefined },
  { key: 'usableSquareFeet', label: 'Usable Area', group: 'Property Details', format: (v) => v ? `${v} sq.ft` : undefined },
  { key: 'furnishingLevel', label: 'Furnishing', group: 'Property Details', format: (v) => v?.replace(/_/g, ' ') },
  { key: 'facilities', label: 'Facilities', group: 'Property Details' },
  { key: 'nearbyLocations', label: 'Nearby Locations', group: 'Location' },
];

// Helper function to get all fields for a listing
export function getFieldsForListing(category: string, subCategory?: string): FieldConfig[] {
  const fields: FieldConfig[] = [];
  
  // Add base fields
  fields.push(...BASE_FIELDS.essentials);
  fields.push(...BASE_FIELDS.usage);
  fields.push(...BASE_FIELDS.documentation);
  
  // Add category/subcategory specific fields from attributes
  if (subCategory && SUBCATEGORY_FIELDS_CONFIG[category]?.[subCategory]) {
    fields.push(...SUBCATEGORY_FIELDS_CONFIG[category][subCategory]);
  }
  
  // Add real estate fields if applicable
  if (category?.startsWith('real_estate')) {
    fields.push(...REAL_ESTATE_FIELDS);
  }
  
  return fields;
}

// Helper to group fields by their group property
export function groupFields(fields: FieldConfig[]): Record<string, FieldConfig[]> {
  const grouped: Record<string, FieldConfig[]> = {};
  
  fields.forEach(field => {
    const group = field.group || 'Other';
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(field);
  });
  
  return grouped;
}
