const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { handler } = require('../src/handlers/items');

describe('Backend API & Lambda Handler Tests', () => {

  test('GET /health returns healthy status and service metadata', async () => {
    const event = {
      httpMethod: 'GET',
      path: '/health',
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.status, 'healthy');
    assert.equal(body.service, 'FreshTrack Cloud Backend');
    assert.equal(body.database, 'Local In-Memory Emulation');
    assert.equal(body.awsActive, false, 'In local emulation, awsActive must be false');
    assert.ok(body.timestamp);
  });

  test('OPTIONS preflight request returns CORS 200', async () => {
    const event = {
      httpMethod: 'OPTIONS',
      path: '/items',
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['Access-Control-Allow-Origin'], '*');
    assert.equal(response.headers['Access-Control-Allow-Methods'], 'OPTIONS,GET,POST,PUT,DELETE');
  });

  test('Redacts sensitive headers (Authorization, Cookie) during logging', async () => {
    // Intercept console.log to verify sensitive headers are redacted
    const originalLog = console.log;
    let loggedOutput = '';
    console.log = (...args) => {
      loggedOutput += args.join(' ') + '\n';
      originalLog.apply(console, args);
    };

    try {
      const event = {
        httpMethod: 'GET',
        path: '/items',
        headers: {
          'Authorization': 'Bearer secret-jwt-token-12345',
          'Cookie': 'session_id=confidential_session_value',
          'Accept': 'application/json'
        }
      };

      await handler(event, {});
      assert.ok(loggedOutput.includes('[REDACTED]'), 'Must redact sensitive headers in logs');
      assert.ok(!loggedOutput.includes('secret-jwt-token-12345'), 'Must never expose secret token in logs');
      assert.ok(!loggedOutput.includes('confidential_session_value'), 'Must never expose cookie in logs');
    } finally {
      console.log = originalLog;
    }
  });

  test('GET /items retrieves all inventory items', async () => {
    const event = {
      httpMethod: 'GET',
      path: '/items',
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.ok(Array.isArray(body));
    assert.ok(body.length > 0, 'Should have initial backend demonstration items');
  });

  test('POST /items rejects item when product name is missing (400)', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/items',
      body: JSON.stringify({
        name: '',
        category: 'Dairy Products',
        purchaseDate: '2025-06-01',
        expiryDate: '2025-06-10'
      })
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 400);

    const body = JSON.parse(response.body);
    assert.match(body.error, /Product name is required/);
  });

  test('POST /items rejects item when expiryDate is earlier than purchaseDate (400)', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/items',
      body: JSON.stringify({
        name: 'Spoiled Milk',
        category: 'Dairy Products',
        purchaseDate: '2025-06-15',
        expiryDate: '2025-06-10'
      })
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 400);

    const body = JSON.parse(response.body);
    assert.match(body.error, /cannot be earlier/);
  });

  let createdItemId = null;

  test('POST /items creates a valid food item in database (201)', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/items',
      body: JSON.stringify({
        name: 'Fresh Fuji Apples',
        category: 'Fruits',
        quantity: 6,
        unit: 'pieces',
        purchaseDate: '2025-06-01',
        expiryDate: '2025-06-20',
        notes: 'Crisp red apples in fruit bowl'
      })
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 201);

    const body = JSON.parse(response.body);
    assert.ok(body.item);
    assert.equal(body.item.name, 'Fresh Fuji Apples');
    assert.ok(body.item.itemId);
    assert.ok(body.item.createdAt);

    createdItemId = body.item.itemId;
  });

  test('GET /items/{id} retrieves the created item', async () => {
    assert.ok(createdItemId, 'Item must have been created in prior test');

    const event = {
      httpMethod: 'GET',
      path: `/items/${createdItemId}`,
      pathParameters: { id: createdItemId }
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.itemId, createdItemId);
    assert.equal(body.name, 'Fresh Fuji Apples');
  });

  test('PUT /items/{id} updates existing item details', async () => {
    const event = {
      httpMethod: 'PUT',
      path: `/items/${createdItemId}`,
      pathParameters: { id: createdItemId },
      body: JSON.stringify({
        quantity: 4,
        notes: 'Two apples consumed, 4 remaining'
      })
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.item.quantity, 4);
    assert.equal(body.item.notes, 'Two apples consumed, 4 remaining');
  });

  test('DELETE /items/{id} removes the item from database', async () => {
    const event = {
      httpMethod: 'DELETE',
      path: `/items/${createdItemId}`,
      pathParameters: { id: createdItemId }
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
  });

  test('GET /items/{id} returns 404 after item is deleted', async () => {
    const event = {
      httpMethod: 'GET',
      path: `/items/${createdItemId}`,
      pathParameters: { id: createdItemId }
    };

    const response = await handler(event, {});
    assert.equal(response.statusCode, 404);
  });

  test('Requirement 9: In strict AWS mode, failure strictly throws and does NOT silently fall back', async () => {
    const prevMode = process.env.USE_AWS_DYNAMO;
    process.env.USE_AWS_DYNAMO = 'true';

    try {
      // In strict AWS mode with nonexistent credentials / unreachable endpoint, health check must report error
      const event = {
        httpMethod: 'GET',
        path: '/health'
      };

      const response = await handler(event, {});
      // In AWS mode without credentials, it must report 503 and awsActive: false, NOT silent success
      const body = JSON.parse(response.body);
      assert.equal(response.statusCode, 503);
      assert.equal(body.status, 'unhealthy');
      assert.equal(body.awsActive, false);
      assert.ok(body.error, 'Should contain explicit connection error message');
    } finally {
      if (prevMode !== undefined) {
        process.env.USE_AWS_DYNAMO = prevMode;
      } else {
        delete process.env.USE_AWS_DYNAMO;
      }
    }
  });

});
