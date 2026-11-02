import { strict as assert } from "node:assert";
import { test } from "node:test";
import { orderTrendingProducts } from "./trending-order.mjs";

const product = (product_id) => ({ product_id });

test("places products absent from best sellers first", () => {
  assert.deepEqual(
    orderTrendingProducts([product(1), product(2), product(3)], [product(1), product(3)]).map((item) => item.product_id),
    [2, 1, 3],
  );
});

test("changes the starting product when every product overlaps", () => {
  assert.deepEqual(
    orderTrendingProducts([product(1), product(2), product(3)], [product(1), product(2), product(3)]).map((item) => item.product_id),
    [2, 3, 1],
  );
  assert.deepEqual(orderTrendingProducts([product(1)], [product(1)]), [product(1)]);
  assert.deepEqual(orderTrendingProducts([], []), []);
});
