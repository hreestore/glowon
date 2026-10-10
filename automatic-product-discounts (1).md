# Product and Variant Discounts

This guide describes selected-product and exact-variant discounts. Set `is_automatic: true` to apply an eligible discount automatically, or `is_automatic: false` to require its `discount_code` at checkout, sale, POS, quick order, and discount-info. Percentage discounts apply to the matching line total; fixed discounts apply once per matching line and cannot reduce it below zero. When an automatic discount and a flash sale both apply, the lower payable price wins.

## 1. API implementation (`routes/api.php`)

These endpoints are under the authenticated management API group.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/discount` | List vendor discounts, including selected products. |
| `GET` | `/api/discount/{id}` | Retrieve one vendor discount. |
| `POST` | `/api/discount/store` | Create a selected-product discount. |
| `POST` | `/api/discount/update/{id}` | Replace the selected products and update a discount. |
| `POST` | `/api/price-calculation/sale` | Preview sale totals with automatic product pricing. |
| `POST` | `/api/price-calculation` | Generic price preview; automatic product pricing is included for product lines. |

For `applies_to: "product"`, targets are authoritative through `product_ids` and `variant_ids`. Every selected product and variant must belong to the authenticated vendor. `product_ids` accepts only simple products with no variants; a variable parent ID is rejected with an error directing clients to use `variant_ids`. At least one simple product or exact variant is required, and both lists may be sent together.

`target_id` remains for legacy consumers and storage. `target_type` identifies whether that primary target is a `product` or `variant`. Category discounts retain their existing `target_id` contract.

```json
{
  "discount_code": "BUNDLE20",
  "discount_type": "percentage",
  "discount_value": 20,
  "applies_to": "product",
  "product_ids": [101],
  "variant_ids": [1089, 1090],
  "max_usage": 100,
  "start_date": "2026-10-10",
  "expiry_date": "2026-10-31",
  "is_active": true,
  "is_automatic": true,
  "min_spent": 1000
}
```

Discount responses retain their existing fields and additionally return `is_automatic`, `products` with `product_id`, `name`, `sku`, and `price`, plus `variants` with `variant_id`, `name`, `sku`, `price`, and parent-product context. Existing discounts default to `is_automatic: true` after migration.

Automatic discounts apply without submitting a code. Code-only discounts never change a catalogue, product-detail, cart, or sale preview price until the client submits their `discount_code`; automatic discount codes are not redeemable as code-only discounts.

Price calculations return automatic line details in `items[*].automatic_discount`, plus the already-calculated `discount_amount` and `final_price`. Use those values as server authority; do not recalculate percentage or fixed discounts in the client.

## 2. Frontend implementation (`routes/frontend.php`)

Storefront catalogue, details, related, recent, home-category, and flash-sale payloads now expose compatible price fields:

```json
{
  "price": 1200,
  "original_price": 1200,
  "discounted_price": 960,
  "discount_amount": 240,
  "active_discount": {
    "id": 44,
    "code": "BUNDLE20",
    "type": "percentage",
    "value": 20
  }
}
```

`price` remains the original/base value for compatibility. Render `discounted_price` as the payable price and show `original_price` struck through only when `discount_amount > 0`. These fields and `active_discount` represent automatic discounts only. A simple-product target applies only to that simple-product line. A variant target applies only to that exact variant, never its siblings or parent. Existing legacy variable-parent targets remain functional for compatibility, but new create/update requests cannot put variable parents in `product_ids`.

Relevant customer routes are:

| Method | Path | Use |
| --- | --- | --- |
| `POST` | `/api/frontend/user/cart/calculate` | Recalculate cart pricing before checkout. |
| `POST` | `/api/frontend/user/cart/check-discount` | Validate an optional manual/code discount. |
| `POST` | `/api/frontend/user/cart/order/store` | Create the cart order using server totals. |
| `POST` | `/api/frontend/quick-order/store` | Start a quick order. |
| `POST` | `/api/frontend/quick-order/verify-and-create` | Complete a verified quick order. |

Cart rows expose `original_price`, `discounted_price`, and `discount_amount`; keep `price` and `regular_price` compatible with the existing cart UI. The checkout UI must submit product IDs and quantities, then use the calculation/order response rather than trusting catalog prices. To redeem a code-only discount, submit `discount_code`; a submitted code applies only when it belongs to a non-automatic discount and its product, variant, category, date, usage, and minimum-spend rules pass. Do not display or add another discount on a line carrying `automatic_discount`.

## 3. POS implementation

POS uses the same `PriceCalculationService` resolution as storefront checkout. Submit the normal item price, quantity, and product/variant identifiers; for a variant-specific discount, submit the exact `ProductVariant` ID. Automatic discounts apply without a code. To redeem a code-only discount, submit its `discount_code`; the server validates vendor/date/status/minimum-spend/usage and target eligibility before VAT.

| Method | Path | Use |
| --- | --- | --- |
| `POST` | `/api/pos/store` | Persist a POS sale using server-calculated line discounts and totals. |
| `POST` | `/api/pos/get-discount-info` | Validate a manual/code discount for eligible non-automatic lines. |
| `POST` | `/api/price-calculation/sale` | Preview the POS sale, including VAT and automatic pricing. |

POS rules:

- Treat `items[*].final_price` and `items[*].discount_amount` from the calculation as authoritative.
- Fixed automatic discounts are per sale line, not per unit. For example, a fixed 100 discount on two units priced 500 each results in a 900 line total, not 800.
- Tax is calculated after the chosen product/flash-sale discount.
- If a flash-sale price is lower than the automatic-discount price, keep the flash-sale price; do not stack either discount.
- Do not apply POS-level manual/code allocation to a line that contains `automatic_discount`; the shared calculator excludes it from order-level allocation.

The migrations `2026_10_10_000001_create_discount_product_table.php`, `2026_10_10_111658_add_variant_targets_to_discounts.php`, and `2026_10_10_112355_add_is_automatic_to_discounts.php` must be applied before management users create product or variant target discounts.
