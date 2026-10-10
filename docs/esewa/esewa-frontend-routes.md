# eSewa: customer frontend implementation

Source: `routes/frontend.php`, `EsewaController`, `EsewaPaymentReconciliationService`.

Read [shared headers, error handling, and polling](README.md). This is a full-order redirect checkout. It does not accept a partial amount or target a direct sale/POS record.

## Routes

| Method | Full backend path | Authentication | Purpose |
| --- | --- | --- | --- |
| POST | `/api/frontend/user/cart/order/store` | Customer bearer + Vendor header | Save an order from the customer's current cart |
| POST | `/api/frontend/user/esewa/initiate/{orderId}` | Customer bearer + Vendor header | Create attempt and return signed form fields |
| POST | `/api/frontend/user/esewa/status/{transactionUuid}` | Customer bearer + Vendor header | Verify a specific attempt |
| POST | `/api/frontend/user/esewa/status/order/{orderId}` | Customer bearer + Vendor header | Recover order payment status |
| GET | `/api/frontend/user/esewa/success` | Gateway/browser callback; no customer header required | Backend verifies callback and gateway status, then redirects |
| GET or POST | `/api/frontend/user/esewa/failure` | Gateway/browser callback; no customer header required | Backend redirects; browser failure alone does not mark payment failed |
| GET | `/api/frontend/user/profile/order/{id}` | Customer bearer + Vendor header | Reload order and linked sale/payment details |

The status and initiation routes only allow the authenticated customer's party and vendor. Callbacks are backend endpoints; the backend supplies their URLs in the signed form response.

## 1. Save or resume the order

For a new checkout, submit the current cart once:

```http
POST /api/frontend/user/cart/order/store
Content-Type: application/json
```

```json
{
  "order_from": "web",
  "customer_address_id": 12,
  "remarks": "Call before delivery"
}
```

Use `order_from: "mobile"` for mobile orders. Include applicable address/delivery/customization fields from the existing cart flow. Save `response.data.order_id`. The cart order endpoint saves the order; it does not initiate eSewa. When resuming an existing order, skip creating another one.

## 2. Initiate eSewa

```http
POST /api/frontend/user/esewa/initiate/42
Content-Type: application/json

{}
```

The backend determines the amount from the order total. An existing linked sale, missing credentials, or a nonpositive total prevents initiation. Response example:

```json
{
  "status": 200,
  "success": true,
  "message": "Initiated eSewa Payment",
  "data": {
    "payment_url": "https://configured-esewa-host/api/epay/main/v2/form",
    "payload": {
      "amount": "1000.00",
      "tax_amount": "0",
      "total_amount": "1000.00",
      "transaction_uuid": "7d91a090-bc8f-43fa-85a2-c5b55f5089e3",
      "product_code": "configured-product-code",
      "product_service_charge": 0,
      "product_delivery_charge": 0,
      "success_url": "https://backend.example.com/api/frontend/user/esewa/success",
      "failure_url": "https://backend.example.com/api/frontend/user/esewa/failure?transaction_uuid=7d91a090-bc8f-43fa-85a2-c5b55f5089e3",
      "signed_field_names": "total_amount,transaction_uuid,product_code",
      "signature": "backend-generated-signature"
    }
  }
}
```

Use the returned `payment_url`; do not hardcode a production/test gateway URL. The backend's fallback URL is the eSewa test environment, so deployment configuration controls the destination.

## 3. Submit a browser form

Persist `orderId` and `payload.transaction_uuid`, then submit every returned payload field unchanged as a normal browser form POST. Do not `fetch` the gateway expecting JSON and do not regenerate the signature in the client.

```js
function submitEsewaCheckout({ payment_url, payload }) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = payment_url;
  for (const [name, value] of Object.entries(payload)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
```

The flow is: storefront → eSewa form → backend callback → storefront result page. A mobile client needs an equivalent browser/webview form navigation and handling of the configured storefront return URL.

## 4. Handle both result pages by checking status

Implement `/payment/success` and `/payment/failed` on the configured frontend origin. Backend redirects can include `order_id`, `transaction_uuid`, `status`, and `reason`. Unknown/malformed callbacks may omit the IDs.

Treat query parameters as navigation hints. On **either** page, restore customer authentication and POST status by UUID; if only the order ID is available, use status by order. With no usable ID, offer order history rather than claiming a payment result. If login is required, preserve the identifiers through login.

```js
const result = await paymentRequest(origin,
  `/api/frontend/user/esewa/status/${encodeURIComponent(transactionUuid)}`,
  { token: customerToken, vendorToken });
const attempt = result.esewa_payment;
```

Status response, with common metadata abbreviated:

```json
{
  "status": 200,
  "success": true,
  "message": "eSewa payment status",
  "data": {
    "order_id": 42,
    "status": "paid",
    "esewa_payment": {
      "id": 18,
      "payment_amount": 1000,
      "payment_status": "paid",
      "lifecycle_status": "resolved",
      "transaction_uuid": "7d91a090-bc8f-43fa-85a2-c5b55f5089e3",
      "esewa_status": "COMPLETE",
      "esewa_ref_id": "gateway-reference",
      "reconciliation_error": null
    }
  }
}
```

`data.status` is the reconciliation result; `data.esewa_payment.payment_status` is the persisted payment state. There is no `accounting_finalized` boolean in the eSewa object.

| Result / payment state | UI behavior |
| --- | --- |
| `data.status = paid`, attempt `paid`, lifecycle `resolved`, no reconciliation error | Show success; reload order/sale |
| `pending` | Show “Waiting for payment confirmation”; continue controlled polling |
| `errors`, attempt still `pending` | Show verification unavailable; retry status, not payment creation |
| `errors`, attempt `paid` | Show “Payment received; order processing pending”; no second charge |
| `failed` | Show verified failure and offer an explicit retry after rechecking the order |
| `manual_review` | Show “Payment needs review”; stop automatic retry/initiation |
| Lifecycle `abandoned` | Automatic checks stopped; manual status check is still available; do not equate this with failure |

The failure callback can redirect with `status=pending`. A cancelled browser navigation is not gateway-confirmed failure. Refund statuses can produce `manual_review`; the client must not trigger an automatic refund or replacement payment.

## 5. Retry and recover

Every initiation currently creates a new UUID; customer eSewa initiation does **not** deduplicate active attempts. Disable duplicate clicks. After a lost initiation response, refresh, failed redirect, or browser close, check by order before initiating again. Status-by-order prefers the newest **paid** attempt, otherwise the newest attempt. Use UUID polling when tracking a specific checkout.

Keep an uncertain attempt in a “Check payment” flow. Only expose an explicit new checkout after resolving the previous result. The existing scheduler can recover missed callbacks; browser polling is not the only recovery mechanism.

## Frontend acceptance checks

- Full payment redirects through backend and refreshes the confirmed order/linked sale.
- Failure URL, back navigation, and lost network never cause a local paid balance.
- A paid attempt with a reconciliation error shows processing pending.
- Reload and re-login resume using saved UUID/order ID without a second initiation.
- Missing credentials, ownership errors, pending, and manual-review responses have distinct UI states.

Related: [staff eSewa availability](esewa-api-routes.md), [backend recovery notes](../esewa-recovery.md).
