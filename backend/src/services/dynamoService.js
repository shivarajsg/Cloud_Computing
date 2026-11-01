/**
 * FreshTrack - DynamoDB Service Layer
 * 
 * Interacts with Amazon DynamoDB using AWS SDK v3 (client-dynamodb & lib-dynamodb)
 * Table: FreshTrackItems (Partition Key: itemId [S])
 */

const { DynamoDBClient, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  GetCommand, 
  PutCommand, 
  DeleteCommand 
} = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.TABLE_NAME || 'FreshTrackItems';
const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-south-1';

// In-memory fallback store for offline local testing / demonstration
const inMemoryStore = new Map();

// Initialize initial relative demo items in in-memory fallback
function initFallbackStore() {
  const now = new Date();
  const addDays = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const sample = [
    {
      itemId: 'ft-backend-001',
      name: 'Greek Yogurt (500g)',
      category: 'Dairy Products',
      quantity: 1,
      unit: 'packets',
      purchaseDate: addDays(-12),
      expiryDate: addDays(-3), // Expired
      notes: 'Initial sample in DynamoDB backend',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      itemId: 'ft-backend-002',
      name: 'Organic Whole Milk',
      category: 'Dairy Products',
      quantity: 2,
      unit: 'litres',
      purchaseDate: addDays(-5),
      expiryDate: addDays(0), // Expiring Today
      notes: 'Boundary test: 0 days remaining',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      itemId: 'ft-backend-003',
      name: 'Fresh Strawberries',
      category: 'Fruits',
      quantity: 500,
      unit: 'g',
      purchaseDate: addDays(-2),
      expiryDate: addDays(4), // Expiring in 4 days
      notes: 'Keep chilled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      itemId: 'ft-backend-004',
      name: 'Artisan Sourdough Bread',
      category: 'Bakery',
      quantity: 1,
      unit: 'pieces',
      purchaseDate: addDays(-1),
      expiryDate: addDays(9), // Fresh
      notes: 'Stored in bread box',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      itemId: 'ft-backend-005',
      name: 'Chicken Breast Cutlets',
      category: 'Meat and Seafood',
      quantity: 1.2,
      unit: 'kg',
      purchaseDate: addDays(0),
      expiryDate: addDays(14), // Fresh
      notes: 'Deep frozen',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      itemId: 'ft-backend-006',
      name: 'Organic Rolled Oats',
      category: 'Grains and Cereals',
      quantity: 2,
      unit: 'kg',
      purchaseDate: addDays(-7),
      expiryDate: addDays(45), // Fresh
      notes: 'Airtight pantry container',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  inMemoryStore.clear();
  sample.forEach((item) => inMemoryStore.set(item.itemId, item));
}

initFallbackStore();

// Determines whether the execution environment is strictly AWS or configured for real AWS DynamoDB
function isAwsMode() {
  return Boolean(
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.AWS_EXECUTION_ENV ||
    process.env.USE_AWS_DYNAMO === 'true'
  );
}

// Create DynamoDB Client
let rawClient = null;
let docClient = null;

try {
  const clientConfig = { region: REGION };
  if (process.env.DYNAMODB_ENDPOINT) {
    clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
  }
  rawClient = new DynamoDBClient(clientConfig);
  docClient = DynamoDBDocumentClient.from(rawClient, {
    marshallOptions: { removeUndefinedValues: true }
  });
} catch (err) {
  console.warn('Could not initialize AWS DynamoDB client:', err.message);
  rawClient = null;
  docClient = null;
}

const dynamoService = {
  getTableName() {
    return TABLE_NAME;
  },

  isAwsMode() {
    return isAwsMode();
  },

  /**
   * Verifies actual DynamoDB table connectivity via DescribeTableCommand.
   * Reports awsActive: true ONLY when the real DynamoDB connection succeeds.
   */
  async checkHealth() {
    if (isAwsMode()) {
      if (!rawClient) {
        throw new Error('DynamoDB client is not initialized in AWS environment');
      }

      try {
        const cmd = new DescribeTableCommand({ TableName: TABLE_NAME });
        const res = await rawClient.send(cmd);
        const status = res.Table?.TableStatus || 'UNKNOWN';

        return {
          connected: true,
          awsActive: true,
          database: 'Amazon DynamoDB',
          table: TABLE_NAME,
          tableStatus: status
        };
      } catch (err) {
        // Never silently claim healthy when running in AWS mode
        console.error(`DynamoDB health check failed for table "${TABLE_NAME}":`, err.message);
        throw new Error(`DynamoDB connection failed: ${err.message}`);
      }
    }

    // Local in-memory emulation mode
    return {
      connected: true,
      awsActive: false,
      database: 'Local In-Memory Emulation',
      table: TABLE_NAME,
      tableStatus: 'LOCAL_ACTIVE'
    };
  },

  async getAllItems() {
    if (isAwsMode()) {
      if (!docClient) {
        throw new Error('DynamoDB DocumentClient is not initialized in AWS environment');
      }
      // Strictly execute against DynamoDB; do NOT silently fall back to in-memory store
      const cmd = new ScanCommand({ TableName: TABLE_NAME });
      const res = await docClient.send(cmd);
      return res.Items || [];
    }

    // Local development emulation
    return Array.from(inMemoryStore.values());
  },

  async getItemById(itemId) {
    if (isAwsMode()) {
      if (!docClient) {
        throw new Error('DynamoDB DocumentClient is not initialized in AWS environment');
      }
      // Strictly execute against DynamoDB; do NOT silently fall back to in-memory store
      const cmd = new GetCommand({
        TableName: TABLE_NAME,
        Key: { itemId }
      });
      const res = await docClient.send(cmd);
      return res.Item || null;
    }

    // Local development emulation
    return inMemoryStore.get(itemId) || null;
  },

  async putItem(item) {
    const timestamp = new Date().toISOString();
    const completeItem = {
      ...item,
      createdAt: item.createdAt || timestamp,
      updatedAt: timestamp
    };

    if (isAwsMode()) {
      if (!docClient) {
        throw new Error('DynamoDB DocumentClient is not initialized in AWS environment');
      }
      // Strictly execute against DynamoDB; do NOT silently fall back to in-memory store
      const cmd = new PutCommand({
        TableName: TABLE_NAME,
        Item: completeItem
      });
      await docClient.send(cmd);
      return completeItem;
    }

    // Local development emulation
    inMemoryStore.set(completeItem.itemId, completeItem);
    return completeItem;
  },

  async deleteItem(itemId) {
    if (isAwsMode()) {
      if (!docClient) {
        throw new Error('DynamoDB DocumentClient is not initialized in AWS environment');
      }
      // Strictly execute against DynamoDB; do NOT silently fall back to in-memory store
      const cmd = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { itemId }
      });
      await docClient.send(cmd);
      return true;
    }

    // Local development emulation
    const existed = inMemoryStore.has(itemId);
    inMemoryStore.delete(itemId);
    return existed;
  },

  resetFallbackStore() {
    initFallbackStore();
    return Array.from(inMemoryStore.values());
  }
};

module.exports = dynamoService;
