export function orderTrendingProducts(trendingProducts, bestSellers) {
  const bestSellerIds = new Set(bestSellers.map((product) => product.product_id));
  const different = trendingProducts.filter((product) => !bestSellerIds.has(product.product_id));
  const shared = trendingProducts.filter((product) => bestSellerIds.has(product.product_id));

  if (different.length === 0 && shared.length > 1) {
    return [...shared.slice(1), shared[0]];
  }

  return [...different, ...shared];
}
