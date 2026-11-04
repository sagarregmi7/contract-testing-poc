// import { describe, it, expect } from 'vitest';
// import { PactV4, MatchersV3 } from '@pact-foundation/pact';
// import { getProduct } from '../src/product-consumer.js';

// const { like } = MatchersV3;

// const pact = new PactV4({
//   consumer: 'ProductFrontend',
//   provider: 'ProductAPI',
//   dir: './pacts',
// });

// describe('Product API consumer contract', () => {
//   it('retrieves a product', async () => {
//     await pact
//       .addInteraction()
//       .given('product 101 exists')
//       .uponReceiving('a request for product 101')
//       .withRequest('GET', '/products/101')
//       .willRespondWith(200, (builder) => {
//         builder
//           .headers({
//             'Content-Type': 'application/json',
//           })
//           .jsonBody({
//             id: like(101),
//             name: like('Laptop'),
//           });
//       })
//       .executeTest(async (mockServer) => {
//         const product = await getProduct(
//           mockServer.url,
//           101,
//         );

//         expect(product.id).toBe(101);
//         expect(product.name).toBe('Laptop');
//       });
//   });
// });

import { describe, it, expect } from 'vitest';
import { PactV4, MatchersV3 } from '@pact-foundation/pact';

const { like, eachLike } = MatchersV3;

const pact = new PactV4({
  consumer: 'ProductFrontend',
  provider: 'ProductAPI',
  dir: './pacts',
});

describe('Product API consumer contract', () => {

  // 1. Get all products
  it('returns a list of products', async () => {
    await pact
      .addInteraction()
      .given('products exist')
      .uponReceiving('a request to get all products')
      .withRequest('GET', '/products')
      .willRespondWith(200, (builder) => {
        builder
          .headers({ 'Content-Type': 'application/json' })
          .jsonBody(
            eachLike({
              id: like(101),
              name: like('Laptop'),
              price: like(1200),
            })
          );
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/products`);
        const products = await response.json();

        expect(response.status).toBe(200);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].name).toBe('Laptop');
      });
  });

  // 2. Get product by ID
  it('returns a product by its ID', async () => {
    await pact
      .addInteraction()
      .given('product 101 exists')
      .uponReceiving('a request for product 101')
      .withRequest('GET', '/products/101')
      .willRespondWith(200, (builder) => {
        builder
          .headers({ 'Content-Type': 'application/json' })
          .jsonBody({
            id: like(101),
            name: like('Laptop'),
            price: like(1200),
          });
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/products/101`);
        const product = await response.json();

        expect(response.status).toBe(200);
        expect(product.id).toBe(101);
      });
  });

  // 3. Create a product
  it('creates a new product', async () => {
    await pact
      .addInteraction()
      .given('the product catalog accepts new products')
      .uponReceiving('a request to create a product')
      .withRequest('POST', '/products', (builder) => {
        builder
          .headers({ 'Content-Type': 'application/json' })
          .jsonBody({
            name: 'Keyboard',
            price: 100,
          });
      })
      .willRespondWith(201, (builder) => {
        builder
          .headers({ 'Content-Type': 'application/json' })
          .jsonBody({
            id: like(102),
            name: like('Keyboard'),
            price: like(100),
          });
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Keyboard',
            price: 100,
          }),
        });

        const product = await response.json();

        expect(response.status).toBe(201);
        expect(product.name).toBe('Keyboard');
      });
  });

  // 4. Update a product
  it('updates an existing product', async () => {
    await pact
      .addInteraction()
      .given('product 101 exists')
      .uponReceiving('a request to update product 101')
      .withRequest('PUT', '/products/101', (builder) => {
        builder
          .headers({ 'Content-Type': 'application/json' })
          .jsonBody({
            name: 'Updated Laptop',
            price: 1500,
          });
      })
      .willRespondWith(200, (builder) => {
        builder
          .headers({ 'Content-Type': 'application/json' })
          .jsonBody({
            id: like(101),
            name: like('Updated Laptop'),
            price: like(1500),
          });
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/products/101`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Updated Laptop',
            price: 1500,
          }),
        });

        const product = await response.json();

        expect(response.status).toBe(200);
        expect(product.name).toBe('Updated Laptop');
      });
  });

  // 5. Delete a product
  it('deletes an existing product', async () => {
    await pact
      .addInteraction()
      .given('product 101 exists')
      .uponReceiving('a request to delete product 101')
      .withRequest('DELETE', '/products/101')
      .willRespondWith(204)
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/products/101`, {
          method: 'DELETE',
        });

        expect(response.status).toBe(204);
      });
  });

});