/**
 * FreshTrack - Local Development & Lab Demonstration Server
 * 
 * Runs a standalone Express server emulating Amazon API Gateway + AWS Lambda.
 * Allows running and demonstrating the full cloud backend locally without deploying to AWS first.
 */

const express = require('express');
const cors = require('cors');
const { handler } = require('./handlers/items');
const dynamoService = require('./services/dynamoService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to convert Express req/res into AWS API Gateway Proxy event/response
async function invokeLambda(req, res, pathOverride = null) {
  const event = {
    httpMethod: req.method,
    path: pathOverride || req.path,
    pathParameters: req.params,
    queryStringParameters: req.query,
    headers: req.headers,
    body: JSON.stringify(req.body)
  };

  try {
    const result = await handler(event, {});
    const headers = result.headers || {};
    Object.keys(headers).forEach((key) => res.setHeader(key, headers[key]));
    res.status(result.statusCode).send(result.body);
  } catch (err) {
    console.error('Local server error calling Lambda handler:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}

// Health Check
app.get('/health', (req, res) => invokeLambda(req, res));

// Items Endpoints
app.get('/items', (req, res) => invokeLambda(req, res));
app.get('/items/:id', (req, res) => invokeLambda(req, res, `/items/${req.params.id}`));
app.post('/items', (req, res) => invokeLambda(req, res));
app.put('/items/:id', (req, res) => invokeLambda(req, res, `/items/${req.params.id}`));
app.delete('/items/:id', (req, res) => invokeLambda(req, res, `/items/${req.params.id}`));

// Fallback reset endpoint for lab tests
app.post('/reset-demo', (req, res) => {
  const sample = dynamoService.resetFallbackStore();
  res.json({ message: 'Reset local backend database to sample data', items: sample });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` FreshTrack Backend Server Running`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Health: http://localhost:${PORT}/health`);
    console.log(` Items:  http://localhost:${PORT}/items`);
    console.log(` Emulating: AWS API Gateway -> AWS Lambda -> DynamoDB`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
