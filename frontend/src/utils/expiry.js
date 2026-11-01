/**
 * FreshTrack - Smart Expiry Calculation Engine
 * 
 * Rules:
 * - Expired: Expiry date is strictly earlier than today (< 0 days remaining)
 * - Expiring Soon: Expiry date is within the next 7 days, including today (0 to 7 days remaining)
 * - Fresh: Expiry date is more than 7 days away (> 7 days remaining)
 */

/**
 * Normalizes a date string (YYYY-MM-DD) or Date object to a clean UTC/Local midnight timestamp
 * to avoid timezone and daylight saving discrepancies.
 */
export function normalizeDate(dateInput) {
  if (!dateInput) return null;
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day, 0, 0, 0, 0);
    }
  }
  const d = new Date(dateInput);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * Formats a Date object or string as YYYY-MM-DD
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  const d = normalizeDate(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates remaining days from baseDate to targetDate.
 * Negative number means targetDate has passed (overdue).
 */
export function getDaysDifference(targetDateInput, baseDateInput = new Date()) {
  const target = normalizeDate(targetDateInput);
  const base = normalizeDate(baseDateInput);

  if (!target || !base) return 0;

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = target.getTime() - base.getTime();
  return Math.round(diffMs / msPerDay);
}

/**
 * Calculates the dynamic status of a food product.
 * Returns status, daysRemaining, human-readable label, and styling classes.
 */
export function calculateExpiryStatus(expiryDateInput, baseDateInput = new Date()) {
  const daysRemaining = getDaysDifference(expiryDateInput, baseDateInput);

  if (daysRemaining < 0) {
    const overdueDays = Math.abs(daysRemaining);
    return {
      status: 'EXPIRED',
      key: 'expired',
      daysRemaining,
      overdueDays,
      label: overdueDays === 1 ? 'Expired 1 day ago' : `Expired ${overdueDays} days ago`,
      shortLabel: 'Expired',
      urgency: 'high',
      theme: {
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200',
        dotBg: 'bg-rose-500',
        cardBg: 'bg-rose-50/50',
        cardBorder: 'border-rose-200',
        hoverBorder: 'hover:border-rose-400',
        accentText: 'text-rose-600',
        progressColor: '#f43f5e',
      }
    };
  }

  if (daysRemaining <= 7) {
    let label = '';
    if (daysRemaining === 0) {
      label = 'Expires today';
    } else if (daysRemaining === 1) {
      label = 'Expires tomorrow';
    } else {
      label = `Expires in ${daysRemaining} days`;
    }

    return {
      status: 'EXPIRING_SOON',
      key: 'expiring_soon',
      daysRemaining,
      overdueDays: 0,
      label,
      shortLabel: 'Expiring Soon',
      urgency: 'medium',
      theme: {
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-200',
        dotBg: 'bg-amber-500',
        cardBg: 'bg-amber-50/50',
        cardBorder: 'border-amber-200',
        hoverBorder: 'hover:border-amber-400',
        accentText: 'text-amber-600',
        progressColor: '#f59e0b',
      }
    };
  }

  return {
    status: 'FRESH',
    key: 'fresh',
    daysRemaining,
    overdueDays: 0,
    label: `Expires in ${daysRemaining} days`,
    shortLabel: 'Fresh',
    urgency: 'low',
    theme: {
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-200',
      dotBg: 'bg-emerald-500',
      cardBg: 'bg-emerald-50/40',
      cardBorder: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-400',
      accentText: 'text-emerald-600',
      progressColor: '#10b981',
    }
  };
}

/**
 * Validates date rules:
 * - Expiry date cannot be earlier than purchase date
 */
export function validateFoodItemDates(purchaseDate, expiryDate) {
  if (!purchaseDate) return { valid: false, error: 'Purchase date is required' };
  if (!expiryDate) return { valid: false, error: 'Expiry date is required' };

  const pDate = normalizeDate(purchaseDate);
  const eDate = normalizeDate(expiryDate);

  if (eDate.getTime() < pDate.getTime()) {
    return {
      valid: false,
      error: 'Expiry date cannot be earlier than purchase date.'
    };
  }

  return { valid: true, error: null };
}

export const FOOD_CATEGORIES = [
  'Dairy Products',
  'Fruits',
  'Vegetables',
  'Bakery',
  'Meat and Seafood',
  'Beverages',
  'Grains and Cereals',
  'Others'
];

export const QUANTITY_UNITS = [
  'kg',
  'g',
  'litres',
  'ml',
  'pieces',
  'packets'
];
