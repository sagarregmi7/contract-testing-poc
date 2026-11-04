import path from 'node:path';

import { describe, it } from 'vitest';

import {
  MessageProviderPact,
  providerWithMetadata,
} from '@pact-foundation/pact';

import { createOrderCreatedEvent } from '../src/order-producer.js';

const pactFile = path.resolve(
  process.cwd(),
  'pacts',
  'inventoryservice-orderservice.json',
);

describe('Order Service message verification', () => {
  it('generates a message compatible with InventoryService', async () => {
    const verifier = new MessageProviderPact({
      messageProviders: {
        'an OrderCreated event': providerWithMetadata(
          () => createOrderCreatedEvent(),
          {
            queue: 'orders',
          },
        ),
      },
      provider: 'OrderService',
      providerVersion: '1.0.0',
      pactUrls: [pactFile],
    });

    await verifier.verify();
  });
});