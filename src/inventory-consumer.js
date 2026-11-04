
export async function handleOrderCreated(event) {
  if (event.eventType !== 'OrderCreated') {
    throw new Error('Unexpected event type');
  }

  if (typeof event.orderId !== 'string') {
    throw new Error('orderId must be a string');
  }

  if (event.status !== 'CREATED') {
    throw new Error('Unexpected order status');
  }

  // In a real application:
  // 1. Look up the order.
  // 2. Check inventory.
  // 3. Update the order-processing state.

  return {
    processed: true,
    orderId: event.orderId,
  };
}