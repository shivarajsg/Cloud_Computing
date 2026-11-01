const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const API_BASE_URL = 'https://ng7dtfqk39.execute-api.ap-south-1.amazonaws.com/prod';

describe('Live AWS Production Cloud Integration Tests', () => {

  test('1. AWS Backend /health endpoint returns healthy and awsActive: true', async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    assert.equal(res.status, 200, 'Health endpoint must return HTTP 200');

    const data = await res.json();
    assert.equal(data.status, 'healthy');
    assert.equal(data.service, 'FreshTrack Cloud Backend');
    assert.equal(data.database, 'Amazon DynamoDB');
    assert.equal(data.table, 'FreshTrackItems');
    assert.equal(data.awsActive, true, 'awsActive must be true on real AWS');
    assert.equal(data.tableStatus, 'ACTIVE', 'DynamoDB table must be in ACTIVE state');
  });

  test('2. CORS preflight OPTIONS returns allowed methods and origin', async () => {
    const res = await fetch(`${API_BASE_URL}/items`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://freshtrack.vercel.app',
        'Access-Control-Request-Method': 'POST'
      }
    });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('access-control-allow-origin'), '*');
    assert.ok(res.headers.get('access-control-allow-methods').includes('POST'));
    assert.ok(res.headers.get('access-control-allow-methods').includes('GET'));
  });

  let createdItemId = null;

  test('3. POST /items persists a new product into Amazon DynamoDB', async () => {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + 5); // Expiring soon (+5d)

    const payload = {
      name: 'Fresh Strawberries (Demo Pack)',
      category: 'Fruits',
      quantity: 500,
      unit: 'g',
      purchaseDate: now.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      notes: 'Live AWS Cloud Integration Test'
    };

    const res = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201, 'POST /items must return 201 Created');
    const data = await res.json();
    assert.ok(data.item);
    assert.ok(data.item.itemId);
    assert.equal(data.item.name, payload.name);
    assert.equal(data.item.category, payload.category);
    assert.equal(data.item.quantity, payload.quantity);

    createdItemId = data.item.itemId;
  });

  test('4. GET /items retrieves the list including the newly persisted item', async () => {
    assert.ok(createdItemId);
    const res = await fetch(`${API_BASE_URL}/items`);
    assert.equal(res.status, 200);

    const items = await res.json();
    assert.ok(Array.isArray(items));
    const found = items.find(i => i.itemId === createdItemId);
    assert.ok(found, 'Created item must be returned in GET /items scan');
  });

  test('5. GET /items/{id} retrieves the specific product from DynamoDB', async () => {
    assert.ok(createdItemId);
    const res = await fetch(`${API_BASE_URL}/items/${createdItemId}`);
    assert.equal(res.status, 200);

    const item = await res.json();
    assert.equal(item.itemId, createdItemId);
    assert.equal(item.name, 'Fresh Strawberries (Demo Pack)');
  });

  test('6. PUT /items/{id} updates attributes in DynamoDB', async () => {
    assert.ok(createdItemId);
    const updatePayload = {
      quantity: 250,
      notes: 'Half pack consumed, remainder refrigerated'
    };

    const res = await fetch(`${API_BASE_URL}/items/${createdItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.item.quantity, 250);
    assert.equal(data.item.notes, 'Half pack consumed, remainder refrigerated');
  });

  test('7. DELETE /items/{id} removes the record from DynamoDB', async () => {
    assert.ok(createdItemId);
    const res = await fetch(`${API_BASE_URL}/items/${createdItemId}`, {
      method: 'DELETE'
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
  });

  test('8. GET /items/{id} returns 404 after deletion', async () => {
    assert.ok(createdItemId);
    const res = await fetch(`${API_BASE_URL}/items/${createdItemId}`);
    assert.equal(res.status, 404);
  });

});
