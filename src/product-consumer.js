export async function getProduct(baseUrl, id) {
  const response = await fetch(`${baseUrl}/products/${id}`);

  if (!response.ok) {
    throw new Error(`Product API failed: ${response.status}`);
  }

  return response.json();
}