/**
 * FreshTrack Backend - AWS Lambda Entrypoint
 */

const { handler } = require('./handlers/items');

exports.handler = handler;
