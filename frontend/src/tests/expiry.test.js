import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
  normalizeDate, 
  formatDate, 
  getDaysDifference, 
  calculateExpiryStatus, 
  validateFoodItemDates 
} from '../utils/expiry.js';
import { generateSampleItems } from '../utils/sampleData.js';

describe('Smart Expiry Calculation Logic & Boundary Tests', () => {
  const baseDate = new Date('2025-06-15T12:00:00Z');

  test('Correctly identifies EXPIRED products (date < today)', () => {
    // 3 days in the past
    const status = calculateExpiryStatus('2025-06-12', baseDate);
    assert.equal(status.status, 'EXPIRED');
    assert.equal(status.overdueDays, 3);
    assert.equal(status.daysRemaining, -3);
    assert.equal(status.label, 'Expired 3 days ago');
    assert.equal(status.theme.dotBg, 'bg-rose-500');
  });

  test('Correctly identifies EXPIRING SOON at boundary: Today (0 days remaining)', () => {
    const status = calculateExpiryStatus('2025-06-15', baseDate);
    assert.equal(status.status, 'EXPIRING_SOON');
    assert.equal(status.daysRemaining, 0);
    assert.equal(status.label, 'Expires today');
    assert.equal(status.theme.dotBg, 'bg-amber-500');
  });

  test('Correctly identifies EXPIRING SOON at boundary: Tomorrow (1 day remaining)', () => {
    const status = calculateExpiryStatus('2025-06-16', baseDate);
    assert.equal(status.status, 'EXPIRING_SOON');
    assert.equal(status.daysRemaining, 1);
    assert.equal(status.label, 'Expires tomorrow');
  });

  test('Correctly identifies EXPIRING SOON at upper boundary: exactly 7 days remaining', () => {
    const status = calculateExpiryStatus('2025-06-22', baseDate);
    assert.equal(status.status, 'EXPIRING_SOON');
    assert.equal(status.daysRemaining, 7);
    assert.equal(status.label, 'Expires in 7 days');
  });

  test('Correctly identifies FRESH at lower boundary: 8 days remaining', () => {
    const status = calculateExpiryStatus('2025-06-23', baseDate);
    assert.equal(status.status, 'FRESH');
    assert.equal(status.daysRemaining, 8);
    assert.equal(status.label, 'Expires in 8 days');
    assert.equal(status.theme.dotBg, 'bg-emerald-500');
  });

  test('Correctly identifies FRESH for items 45 days out', () => {
    const status = calculateExpiryStatus('2025-07-30', baseDate);
    assert.equal(status.status, 'FRESH');
    assert.equal(status.daysRemaining, 45);
    assert.equal(status.theme.dotBg, 'bg-emerald-500');
  });
});

describe('Date Validation Rules', () => {
  test('Rejects expiry date earlier than purchase date', () => {
    const validation = validateFoodItemDates('2025-06-15', '2025-06-10');
    assert.equal(validation.valid, false);
    assert.match(validation.error, /cannot be earlier/);
  });

  test('Accepts expiry date same as purchase date (e.g. prepared fresh meals)', () => {
    const validation = validateFoodItemDates('2025-06-15', '2025-06-15');
    assert.equal(validation.valid, true);
    assert.equal(validation.error, null);
  });

  test('Accepts expiry date after purchase date', () => {
    const validation = validateFoodItemDates('2025-06-15', '2025-06-25');
    assert.equal(validation.valid, true);
  });
});

describe('Sample Demonstration Data Verification', () => {
  test('Guarantees 1 expired, 2 expiring soon, and 3 fresh relative to execution date', () => {
    const sample = generateSampleItems();
    assert.equal(sample.length, 6, 'Should generate 6 demonstration items');

    const now = new Date();
    let expiredCount = 0;
    let soonCount = 0;
    let freshCount = 0;

    sample.forEach((item) => {
      const { status } = calculateExpiryStatus(item.expiryDate, now);
      if (status === 'EXPIRED') expiredCount++;
      if (status === 'EXPIRING_SOON') soonCount++;
      if (status === 'FRESH') freshCount++;
    });

    assert.equal(expiredCount, 1, 'Must have exactly 1 expired item');
    assert.equal(soonCount, 2, 'Must have exactly 2 expiring soon items (including today boundary)');
    assert.equal(freshCount, 3, 'Must have exactly 3 fresh items');
  });
});
