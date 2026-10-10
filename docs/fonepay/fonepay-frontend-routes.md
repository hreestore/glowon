 # Fonepay: customer frontend implementation

Source: `routes/frontend.php`, `FonepayController`, `FonepayPaymentReconciliationService`.

Read [shared headers, error handling, and polling](README.md). Customer Fonepay is a full-order QR checkout. The staff partial-payment/retry contract is separate.

## Routes

All routes in this table require a customer bearer token and `Vendor` header.

| Method | Full backend path | Purpose |
| --- | --- | --- |
| POST | `/api/frontend/user/cart/order/store` | Create order from current cart |
| POST | `/api/frontend/user/fonepay/initiate/{orderId}` | Request QR for the full order total |
| POST | `/api/frontend/user/fonepay/status/{prn}` | Server-side verification of a specific attempt |
| POST | `/api/frontend/user/fonepay/status/order/{orderId}` | Check newest attempt for an owned order |
| GET | `/api/frontend/user/profile/order/{id}` | Reload order and linked sale/payment details |

There are no customer Fonepay success/failure redirect routes and no customer sale/POS initiation routes.

## 1. Save or resume the order

For new checkout, POST the existing cart order request, for example:

```json
{ "order_from": "web", "customer_address_id": 12 }
```

Include delivery fields required by the cart flow. Store `response.data.order_id`. For an existing order, reuse its ID. Saving the cart order does not generate the QR.

## 2. Request and display the QR

```http
POST /api/frontend/user/fonepay/initiate/42
Content-Type: application/json

{}
```

Do not send a client-calculated payment amount: this endpoint uses the full order total. Existing linked sales, missing Fonepay credentials, and nonpositive totals prevent initiation.

```json
{
  "status": 200,
  "success": true,
  "message": "Initiated Fonepay payment",
  "data": {
    "prn": "ORD42ABC12345",
    "amount": 1000,
    "qr_message": "gateway-provided-QR-text",
    "client_code": "gateway-client-code",
    "device_id": "gateway-device-id",
    "merchant_code": "gateway-merchant-code",
    "thirdparty_qr_websocket_url": "gateway-provided-websocket-URL",
    "status": "pending",
    "lifecycle_status": "active",
    "qr_response": {}
  }
}
```

`qr_response` is the actual raw gateway response; `{}` is an abbreviated example. Persist the PRN and order ID. Render `qr_message` with the application's QR-code component and display `amount`. The QR field is gateway text, not a guaranteed image URL or base64 PNG. Guard against missing QR data; do not show an empty QR as ready for payment.

The initiation object uses `amount` and `status`. Resource objects use `payment_amount` and `payment_status`; status responses have their own shape below. Do not apply a single unchecked object shape to all responses.

## 3. Verify on the backend

Start serial POST polling while the QR screen is active:

```js
const payment = await paymentRequest(origin,
  `/api/frontend/user/fonepay/status/${encodeURIComponent(prn)}`,
  { token: customerToken, vendorToken });

if (payment.payment_status === 'paid' && payment.accounting_finalized) {
  // Stop polling and reload the owned order.
}
```

An optional websocket connection may prompt an immediate status check. The repository does not define a stable client websocket message schema; do not assume an event format. Polling alone is sufficient. A websocket “success” event must never update accounting in the client.

Status response, with common metadata abbreviated:

```json
{
  "status": 200,
  "success": true,
  "message": "Fonepay payment status checked",
  "data": {
    "order_id": 42,
    "sale_id": 81,
    "accounting_finalized": true,
    "prn": "ORD42ABC12345",
    "payment_status": "paid",
    "lifecycle_status": "resolved",
    "fonepay_status": "COMPLETE",
    "fonepay_status_code": "200",
    "fonepay_message": "Request Complete",
    "trace_id": "gateway-trace",
    "reconciliation_error": null,
    "status_response": {}
  }
}
```

Customer status returns this object directly in `data`, not inside `data.fonepay_payment`. It does not return QR data or amount; retain initiation details or reload the order resource's `fonepay_payment`.

| Payment state | UI behavior |
| --- | --- |
| `pending`, no reconciliation error | Waiting for payment; keep checking |
| `pending` with reconciliation error | Verification unavailable; keep record and offer status retry |
| `paid`, `accounting_finalized = false` | Payment received; order processing/reconciliation pending; no second charge |
| `paid`, `accounting_finalized = true` | Checkout complete; reload order and sale |
| `failed` | Show failure; recheck before an explicit new checkout |
| Lifecycle `abandoned` while payment `pending` | Automatic checks stopped; offer manual status check, not an assumed failure |

Use `payment_status` and `accounting_finalized`, rather than interpreting `fonepay_message`, raw payloads, or HTTP 200 as payment proof.

## 4. Refresh, errors, and retry

On refresh, POST status by stored PRN. If the PRN was lost, POST `/api/frontend/user/fonepay/status/order/{orderId}`; it selects the newest attempt. GET the profile order to recover resource QR context where available.

Customer initiation currently creates a **new PRN each time**; it does not implement the staff “reuse active attempt” behavior. Prevent duplicate clicks and do not call initiation automatically on page mount. After an initiation timeout or HTTP error, the order remains saved and an attempt may also exist. Recover by order and verify before requesting another QR.

The customer initiation failure response is an error envelope, rather than the staff saved-record-plus-checkout-error response:

```json
{
  "status": 400,
  "success": false,
  "message": "Failed to initiate Fonepay payment",
  "data": { "message": "Gateway error details" }
}
```

Do not assume a request timeout means no payment attempt exists. A UI timeout or closing the QR modal does not cancel the gateway request. Customer attempts can become abandoned after 24 hours of pending status; authenticated forced status checks still work.

## Frontend acceptance checks

- QR text, amount, and saved PRN match the initiation response.
- Scanning/websocket events alone never show accounting completion.
- Paid-but-unfinalized state shows processing pending.
- Lost initiation response is recovered by order without automatically making another PRN.
- Page refresh restores the checkout; unmount stops browser polling.

Related: [staff Fonepay flow](fonepay-api-routes.md).
