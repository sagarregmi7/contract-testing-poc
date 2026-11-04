// import express from 'express';

// export const app = express();

// app.use(express.json());

// app.get('/products/:id', (req, res) => {
//   const id = Number(req.params.id);

//   // Original API response
//   res.json({
//     id,
//     name: 'Laptop',
//   });
// });


import express from 'express';

const app = express();

app.use(express.json());

// In-memory data (for demonstration)
let products = [
  {
    id: 101,
    name: 'Laptop',
    price: 1200,
    category: 'Electronics',
    stock: 10,
  },
  {
    id: 102,
    name: 'Keyboard',
    price: 100,
    category: 'Accessories',
    stock: 25,
  },
  {
    id: 103,
    name: 'Mouse',
    price: 50,
    category: 'Accessories',
    stock: 40,
  },
];

let nextId = 104;

// 1. GET all products
app.get('/products', (req, res) => {
  res.status(200).json(products);
});

// 2. GET product categories
app.get('/products/categories', (req, res) => {
  const categories = [
    ...new Set(products.map((product) => product.category)),
  ];

  res.status(200).json(categories);
});

// 3. SEARCH products
app.get('/products/search', (req, res) => {
  const query = req.query.q?.toLowerCase();

  if (!query) {
    return res.status(400).json({
      message: 'Search query is required',
    });
  }

  const result = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

  res.status(200).json(result);
});

// 4. GET product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find(
    (p) => p.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  res.status(200).json(product);
});

// 5. CREATE product
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      message: 'Valid name and price are required',
    });
  }

  const product = {
    id: nextId++,
    name,
    price,
    category: req.body.category || 'General',
    stock: req.body.stock ?? 0,
  };

  products.push(product);

  res.status(201).json(product);
});

// 6. UPDATE product
app.put('/products/:id', (req, res) => {
  const product = products.find(
    (p) => p.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  const { name, price } = req.body;

  if (
    !name ||
    typeof price !== 'number' ||
    price <= 0
  ) {
    return res.status(400).json({
      message: 'Valid name and price are required',
    });
  }

  product.name = name;
  product.price = price;

  res.status(200).json(product);
});

// 7. UPDATE product stock
app.patch('/products/:id/stock', (req, res) => {
  const product = products.find(
    (p) => p.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  const { stock } = req.body;

  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({
      message: 'Stock must be a non-negative integer',
    });
  }

  product.stock = stock;

  res.status(200).json(product);
});

// 8. DELETE product
app.delete('/products/:id', (req, res) => {
  const productIndex = products.findIndex(
    (p) => p.id === Number(req.params.id)
  );

  if (productIndex === -1) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  products.splice(productIndex, 1);

  res.status(204).send();
});

export { app };
