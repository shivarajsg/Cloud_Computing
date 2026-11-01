import { formatDate } from './expiry.js';

/**
 * Generates initial demonstration items relative to the current date.
 * Guarantee:
 * - 1 Expired item (e.g. -3 days)
 * - 2 Expiring soon items (e.g. today [0 days] and +4 days)
 * - 3 Fresh items (e.g. +9 days, +14 days, +45 days)
 */
export function generateSampleItems() {
  const now = new Date();

  const addDays = (base, days) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return formatDate(d);
  };

  return [
    {
      itemId: 'ft-demo-001',
      name: 'Greek Yogurt (500g)',
      category: 'Dairy Products',
      quantity: 1,
      unit: 'packets',
      purchaseDate: addDays(now, -12),
      expiryDate: addDays(now, -3), // EXPIRED (3 days overdue)
      notes: 'Contains live cultures. Kept on top refrigerator shelf.',
      createdAt: new Date(now.getTime() - 12 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    },
    {
      itemId: 'ft-demo-002',
      name: 'Organic Whole Milk',
      category: 'Dairy Products',
      quantity: 2,
      unit: 'litres',
      purchaseDate: addDays(now, -5),
      expiryDate: addDays(now, 0), // EXPIRING SOON - Boundary: Today!
      notes: 'Seal opened. Use for morning oats or smoothies today.',
      createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    },
    {
      itemId: 'ft-demo-003',
      name: 'Fresh Strawberries',
      category: 'Fruits',
      quantity: 500,
      unit: 'g',
      purchaseDate: addDays(now, -2),
      expiryDate: addDays(now, 4), // EXPIRING SOON (+4 days)
      notes: 'Washed and kept in perforated container.',
      createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    },
    {
      itemId: 'ft-demo-004',
      name: 'Artisan Sourdough Bread',
      category: 'Bakery',
      quantity: 1,
      unit: 'pieces',
      purchaseDate: addDays(now, -1),
      expiryDate: addDays(now, 9), // FRESH (+9 days)
      notes: 'Stored in bread box at room temperature.',
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    },
    {
      itemId: 'ft-demo-005',
      name: 'Chicken Breast Cutlets',
      category: 'Meat and Seafood',
      quantity: 1.2,
      unit: 'kg',
      purchaseDate: addDays(now, 0),
      expiryDate: addDays(now, 14), // FRESH (+14 days)
      notes: 'Vacuum packed in deep freezer (-18°C).',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      itemId: 'ft-demo-006',
      name: 'Organic Rolled Oats',
      category: 'Grains and Cereals',
      quantity: 2,
      unit: 'kg',
      purchaseDate: addDays(now, -7),
      expiryDate: addDays(now, 45), // FRESH (+45 days)
      notes: 'Pantry pantry airtight container.',
      createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
    }
  ];
}
