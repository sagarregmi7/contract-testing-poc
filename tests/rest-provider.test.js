
import { describe, it, beforeAll, afterAll } from 'vitest';
import { Verifier } from '@pact-foundation/pact';
import { app } from '../src/product-api.js';

let server;
let providerBaseUrl;

beforeAll(async () => {
  server = app.listen(0);

  await new Promise((resolve) => {
    server.once('listening', resolve);
  });

  const address = server.address();
  console.log("..check",process.env.PACT_BROKER_URL)

  providerBaseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
});

describe('Product API provider verification', () => {
  it('satisfies the consumer contract from Pact Broker', async () => {
    await new Verifier({
      // Must match the provider name in the consumer Pact
      provider: 'ProductAPI',

      // Running Express API
      providerBaseUrl,

      // Retrieve contracts from Pact Broker
      pactBrokerUrl: process.env.PACT_BROKER_URL || 'http://3.148.136.140:9292', 

      // // Broker authentication (for basic-authenticated OSS Broker)
      pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
      pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,

      // Retrieve the latest consumer contract
      consumerVersionSelectors: [
        { latest: true },
      ],

      // Publish verification result
      publishVerificationResult: true,

      // Version of the provider being verified
      providerVersion: process.env.GIT_SHA || '1.0.0',

      providerVersionBranch: 'main',

    }).verifyProvider();
  },30000);
});
