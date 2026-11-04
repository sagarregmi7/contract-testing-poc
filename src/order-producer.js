export function createOrderCreatedEvent() {
  return {
    eventType: 'OrderCreated',
    orderId: 'ORD-101',
    status: 'CREATED',
  };
}