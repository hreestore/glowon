# Fonepay: staff dashboard and POS frontend implementation

Source: `routes/api.php`, staff order/sale/POS/payment controllers, `StaffFonepayController`.

Read [shared headers, error handling, and polling](README.md). All calls here use the staff bearer token (`auth:api`). The `Vendor` header required by customer routes is not required by these staff routes; vendor ownership comes from the staff account.

## Routes and permissions

| Method | Full path | Permission | Behavior |
| --- | --- | --- | --- |
| POST | `/api/order/store` | `access-order` | Save pending order and request QR |
| POST | `/api/order/status-update/{id}` | `access-order` | With `status: confirmed` + Fonepay, defer confirmation and conversion |
| POST | `/api/order/create-sale/{id}` | `access-order` | Request QR and defer sale creation |
| POST | `/api/sale/store` | `access-sales` | Save unpaid sale and request QR |
| POST | `/api/pos/store` | `access-pos` | Save unpaid POS sale and request QR |
| POST | `/api/sales-payment/store/{saleId}` | `access-sales` | Request QR; no immediate ledger payment |
| POST | `/api/fonepay/initiate/order/{id}` | `access-order` | Start/resume checkout for saved order |
| POST | `/api/fonepay/initiate/sale/{id}` | `access-pos` for POS; otherwise `access-sales` | Start/resume checkout for saved sale |
| GET | `/api/fonepay/status/order/{id}` | `access-order` | Verify latest order attempt |
| GET | `/api/fonepay/status/sale/{id}` | `access-pos` for POS; otherwise `access-sales` | Verify latest direct/order-linked sale attempt |
| GET | `/api/fonepay/status/prn/{prn}` | Order permission if attempt has order ID; otherwise target sale/POS permission | Verify specific attempt |

All record IDs and supplied wallets must belong to the signed-in staff member's vendor. Status-by-PRN is the preferred way to track the QR currently displayed.

## 1. Submit the intended business action once

Add `payment_method: "fonepay"` to the normal request. Amount rules:

- Order creation: optional positive `paid_amount`; omitted/null defaults to total.
- Confirmation, conversion, direct sale, POS, and retry: required positive `paid_amount`.
- Added sale payment: required positive `payment_amount`, not `paid_amount`.
- At most two decimal places; amount must fit within the order total or current sale due amount.
- `payment_account_id` is optional. If supplied, select an active Fonepay wallet for this vendor. Otherwise the backend resolves/creates the wallet.

Examples use an existing product, party, and fiscal-year date. Replace IDs/dates and retain all normal business validation/customization fields required by your screen.

### New order

`POST /api/order/store`:

```json
{
  "party_id": 7,
  "order_date": "2026-09-07",
  "payment_method": "fonepay",
  "paid_amount": 400,
  "order_items": [{ "product_type": "Product", "product_id": 1, "quantity": 2, "price": 500 }]
}
```

The saved order stays pending. Omit `paid_amount` to request the full total. Initiation does not confirm the order or create its sale.

### Confirm an order

`POST /api/order/status-update/42`:

```json
{ "status": "confirmed", "date": "2026-09-07", "payment_method": "fonepay", "paid_amount": 400 }
```

Show “Awaiting payment confirmation”; a successful API response does not mean the status has changed to confirmed.

### Convert an order to sale

`POST /api/order/create-sale/42`:

```json
{ "sale_date": "2026-09-07", "payment_method": "fonepay", "paid_amount": 400, "remarks": "First installment" }
```

The response contains `sale: null` until verification creates the sale.

### New direct sale or POS sale

Use the following for `POST /api/sale/store` or `POST /api/pos/store`:

```json
{
  "party_id": 7,
  "sale_date": "2026-09-07",
  "payment_method": "fonepay",
  "paid_amount": 400,
  "sale_items": [{ "product_type": "Product", "product_id": 1, "quantity": 2, "price": 500 }]
}
```

Direct sale requires a party. Fonepay POS allows `party_id` to be omitted/null and also permits an omitted `sale_date`. The backend immediately records the unpaid sale, invoice, and stock movement. It keeps paid amount at zero until verification. Do not call the store endpoint again to retry its QR.

### Add a payment to an existing sale

`POST /api/sales-payment/store/81`:

```json
{
  "payment_method": "fonepay",
  "payment_amount": 400,
  "payment_date": "2026-09-07",
  "remarks": "Second installment"
}
```

The response has `payment: null` because QR initiation has not created a party ledger credit. Keep the displayed paid/due totals from `summary` or the sale resource. After verification, reload the sale and `GET /api/sales-payment/81`. Party-less POS gets wallet/balance updates without a party ledger payment.

## 2. Read checkout data from the correct response location

All paths below are relative to the full JSON response:

| Endpoint | Saved record | Checkout object |
| --- | --- | --- |
| Order store | `data` | `data.fonepay_payment` |
| Order status-update | `data[0]` | `data[0].fonepay_payment` |
| Order create-sale | `data.order`, initially `data.sale = null` | `data.order.fonepay_payment` |
| Sale/POS store | `data[0]` | `data[0].fonepay_payment` |
| Added sale payment | `data.sale` | `data.fonepay_payment` (also on sale resource) |
| Dedicated order/sale initiate | `data.order` or `data.sale` | `data.fonepay_payment` |
| Any staff Fonepay status route | Linked IDs in checkout object | `data` itself |

Example checkout object; common timestamps and gateway metadata are abbreviated:

```json
{
  "id": 123,
  "prn": "SAL81ABC12345",
  "payment_amount": 400,
  "payment_status": "pending",
  "lifecycle_status": "active",
  "order_id": null,
  "sale_id": 81,
  "qr_message": "gateway-QR-text",
  "thirdparty_qr_websocket_url": "gateway-websocket-URL",
  "checkout_error": null,
  "accounting_finalized": false,
  "accounting_finalized_at": null,
  "reconciliation_error": null
}
```

Persist the attempt ID, PRN, target ID, and requested amount. Render `qr_message` as QR text and display `payment_amount`. If a checkout error exists or QR data is missing, keep the saved record visible and show recovery controls. `success: true` may accompany a saved record whose QR generation failed.

## 3. Poll and render the verified state

```js
const payment = await paymentRequest(origin,
  `/api/fonepay/status/prn/${encodeURIComponent(prn)}`,
  { token: staffToken, method: 'GET' });

if (payment.payment_status === 'paid' && payment.accounting_finalized) {
  // Stop polling, then refresh the linked record and its payment ledger.
}
```

Poll serially using the [shared polling flow](README.md). Optional websocket messages may trigger an immediate GET status check; they are not proof of payment. No stable websocket message schema is defined by this repository.

| State | UI action |
| --- | --- |
| `pending`, usable QR | Show QR and “Awaiting payment”; poll |
| `pending`, `checkout_error` or missing QR | Saved checkout needs recovery; offer “Check payment” / “Resume checkout” |
| `pending`, reconciliation error | Status verification unavailable; retain record and retry verification |
| `paid`, `accounting_finalized = false` | “Payment received; accounting pending”; do not collect again |
| `paid`, `accounting_finalized = true` | Attempt complete; refresh balances and record |
| `failed` | Offer explicit retry on saved record after refreshing status |

For a partial payment, the **attempt** becomes `paid` while the **sale** becomes `partial`. Present the backend's remaining `due_amount`; do not label the entire sale fully paid just because the attempt completed. Orders can be confirmed and converted following a verified partial payment.

After completion, reload the relevant endpoint:

- `GET /api/order/show/{id}` for order details.
- `GET /api/sale/show/{id}` for direct/order sale details (`data.sale`).
- `GET /api/pos/show/{id}` for POS details (`data.sale`).
- `GET /api/sales-payment/{saleId}` for sale balances and party ledger payments.

## 4. Retry on the saved target

```http
POST /api/fonepay/initiate/sale/81
Content-Type: application/json
```

```json
{ "paid_amount": 400, "payment_date": "2026-09-07", "remarks": "Resume checkout" }
```

Use `/api/fonepay/initiate/order/42` for an unconverted order. Retry requires `paid_amount`, even for an order originally created without an explicit amount. Optional context fields are `sale_date`, `date`, `payment_date`, `remarks`, and `payment_account_id`.

- Same target and amount with a pending attempt reuses that attempt. Its original dates, remarks, and wallet context remain unchanged.
- A different amount conflicts with the pending attempt. Display the validation error and keep the original checkout accessible.
- Definitive QR rejection or gateway failure allows a new attempt on retry.
- Timeouts, server errors, rate limits, and interrupted requests remain uncertain. Retry reconciles the existing PRN instead of issuing another QR. It may still return no usable QR; keep offering status checks rather than spinning new initiation requests.
- An unfinalized verified attempt blocks another attempt until accounting is resolved.
- Staff pending attempts remain eligible for scheduled reconciliation beyond 24 hours. A UI countdown does not cancel them.

After a verified partial order payment, use the returned `sale_id` for the next installment (`/api/fonepay/initiate/sale/{id}` or added sale-payment endpoint). Do not reconvert the order. Latest-attempt resource selection ensures the new pending QR is visible even when an older installment succeeded.

## Frontend acceptance checks

- Each of the six actions saves its record once and opens the correct checkout object.
- QR failure preserves the record and offers retry without a second store request.
- Full and partial payments update balances only after verified finalization.
- A paid-but-unfinalized attempt never shows a “Pay again” prompt.
- POS without a party works; ledger absence is not treated as payment failure.
- Refresh resumes by PRN or target ID; conflicting amounts and invalid wallets show validation errors.
- Unauthorized/cross-vendor responses do not reveal or reuse another record's checkout.

Deployment prerequisite: the staff checkout migration must be applied and existing payment scheduler/workers running. See [backend staff checkout notes](../fonepay-staff-checkout.md). Customer route differences are in [customer Fonepay](fonepay-frontend-routes.md).
