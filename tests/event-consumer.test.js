import { describe, it } from 'vitest';

import {
  Pact,
  Matchers,
  v4SynchronousBodyHandler,
} from '@pact-foundation/pact';

import { handleOrderCreated } from '../src/inventory-consumer.js';
import { createOrderCreatedEvent } from '../src/order-producer.js';

const { like } = Matchers;
const event = createOrderCreatedEvent();

const messagePact = new Pact({
  consumer: 'InventoryService',
  provider: 'OrderService',
  dir: './pacts',
  spec: 4,
});

describe('OrderCreated message contract', () => {
  it('accepts an OrderCreated event', async () => {
    await messagePact
      .addAsynchronousInteraction()
      .given('an order has been created')
      .expectsToReceive('an OrderCreated event', (builder) => {
        builder.withJSONContent({
          eventType: like('OrderCreated'),
          orderId: like('ORD-101'),
          status: like('CREATED'),
        });

        builder.withMetadata({
          queue: 'orders',
        });
      })
      .executeTest(v4SynchronousBodyHandler(()=>handleOrderCreated(event)));
  });
});