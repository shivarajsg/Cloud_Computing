/**
 * FreshTrack - AWS Lambda Main Handler
 * 
 * Supports Amazon API Gateway REST API Proxy Integration
 * Runtime: Node.js 24.x
 */

const dynamoService = require('../services/dynamoService');

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
};

function formatResponse(statusCode, body) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}

/**
 * Validates dates for item
 */
function validateDates(purchaseDate, expiryDate) {
  if (!purchaseDate) return { valid: false, error: 'Purchase date is required' };
  if (!expiryDate) return { valid: false, error: 'Expiry date is required' };

  const pDate = new Date(purchaseDate);
  const eDate = new Date(expiryDate);

  if (isNaN(pDate.getTime()) || isNaN(eDate.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  if (eDate.getTime() < pDate.getTime()) {
    return { valid: false, error: 'Expiry date cannot be earlier than purchase date' };
  }

  return { valid: true };
}

/**
 * Sanitizes event metadata for secure CloudWatch logging without exposing sensitive tokens or cookies
 */
function logSafeRequest(httpMethod, path, event) {
  const safeLog = {
    method: httpMethod,
    path: path,
    queryParams: event.queryStringParameters || {},
    pathParams: event.pathParameters || {},
  };

  if (event.headers) {
    const sensitive = ['authorization', 'cookie', 'set-cookie', 'x-api-key', 'x-amz-security-token'];
    const safeHeaders = {};
    for (const [key, val] of Object.entries(event.headers)) {
      if (sensitive.includes(key.toLowerCase())) {
        safeHeaders[key] = '[REDACTED]';
      } else {
        safeHeaders[key] = val;
      }
    }
    safeLog.headers = safeHeaders;
  }

  console.log(`[FreshTrack API Request] ${httpMethod} ${path}`, JSON.stringify(safeLog));
}

exports.handler = async (event, context) => {
  // Extract HTTP method and path
  const httpMethod = event.httpMethod || (event.requestContext && event.requestContext.http && event.requestContext.http.method) || 'GET';
  const path = event.path || (event.requestContext && event.requestContext.http && event.requestContext.http.path) || '';
  const pathParameters = event.pathParameters || {};
  const itemId = pathParameters.id || pathParameters.itemId;

  // Log request without sensitive headers (Authorization, Cookie, etc.)
  logSafeRequest(httpMethod, path, event);

  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    return formatResponse(200, { message: 'CORS OK' });
  }

  try {
    // GET /health - Verifies actual DynamoDB table connectivity
    if (httpMethod === 'GET' && path.endsWith('/health')) {
      try {
        const health = await dynamoService.checkHealth();
        return formatResponse(200, {
          status: 'healthy',
          service: 'FreshTrack Cloud Backend',
          database: health.database,
          table: health.table,
          awsActive: health.awsActive,
          tableStatus: health.tableStatus || null,
          timestamp: new Date().toISOString()
        });
      } catch (healthErr) {
        console.error('Health verification failed:', healthErr.message);
        return formatResponse(503, {
          status: 'unhealthy',
          service: 'FreshTrack Cloud Backend',
          database: 'Amazon DynamoDB',
          table: dynamoService.getTableName(),
          awsActive: false,
          error: healthErr.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // GET /items (List all items)
    if (httpMethod === 'GET' && !itemId && (path === '/items' || path.endsWith('/items'))) {
      const items = await dynamoService.getAllItems();
      return formatResponse(200, items);
    }

    // GET /items/{id}
    if (httpMethod === 'GET' && itemId) {
      const item = await dynamoService.getItemById(itemId);
      if (!item) {
        return formatResponse(404, { error: `Item with id ${itemId} not found` });
      }
      return formatResponse(200, item);
    }

    // POST /items (Create new item)
    if (httpMethod === 'POST' && (path === '/items' || path.endsWith('/items'))) {
      let body;
      try {
        body = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
      } catch (e) {
        return formatResponse(400, { error: 'Invalid JSON request body' });
      }

      if (!body.name || !body.name.trim()) {
        return formatResponse(400, { error: 'Product name is required' });
      }

      const dateValidation = validateDates(body.purchaseDate, body.expiryDate);
      if (!dateValidation.valid) {
        return formatResponse(400, { error: dateValidation.error });
      }

      const newItem = {
        itemId: body.itemId || `ft-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: body.name.trim(),
        category: body.category || 'Others',
        quantity: Number(body.quantity) || 1,
        unit: body.unit || 'pieces',
        purchaseDate: body.purchaseDate,
        expiryDate: body.expiryDate,
        notes: body.notes ? body.notes.trim() : '',
      };

      const savedItem = await dynamoService.putItem(newItem);
      return formatResponse(201, { message: 'Item created successfully', item: savedItem });
    }

    // PUT /items/{id} (Update item)
    if (httpMethod === 'PUT' && itemId) {
      let body;
      try {
        body = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
      } catch (e) {
        return formatResponse(400, { error: 'Invalid JSON request body' });
      }

      const existing = await dynamoService.getItemById(itemId);
      if (!existing) {
        return formatResponse(404, { error: `Item with id ${itemId} not found` });
      }

      const purchaseDate = body.purchaseDate || existing.purchaseDate;
      const expiryDate = body.expiryDate || existing.expiryDate;

      const dateValidation = validateDates(purchaseDate, expiryDate);
      if (!dateValidation.valid) {
        return formatResponse(400, { error: dateValidation.error });
      }

      const updatedItem = {
        ...existing,
        ...body,
        itemId, // ensure ID is preserved
        updatedAt: new Date().toISOString()
      };

      const saved = await dynamoService.putItem(updatedItem);
      return formatResponse(200, { message: 'Item updated successfully', item: saved });
    }

    // DELETE /items/{id} (Delete item)
    if (httpMethod === 'DELETE' && itemId) {
      const deleted = await dynamoService.deleteItem(itemId);
      return formatResponse(200, { 
        success: true, 
        message: deleted ? `Item ${itemId} deleted successfully` : 'Item deleted' 
      });
    }

    // Route not found
    return formatResponse(404, { 
      error: 'Not Found', 
      path, 
      method: httpMethod 
    });

  } catch (error) {
    console.error('Unhandled Lambda Error:', error);
    return formatResponse(500, { 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
};
