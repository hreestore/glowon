# eSewa: staff API frontend availability

Source: `routes/api.php`, staff order/sale/payment controllers, `GatewayPaymentResource`.

**Staff eSewa checkout is not implemented in `api.php`.** The staff UI can display existing customer order-linked eSewa payment context. There is no staff-authenticated eSewa form initiation, retry, or status-verification endpoint.

## Supported and unsupported behavior

| Staff UI action | Current backend support |
| --- | --- |
| Display eSewa attempt on an order | Supported through `esewa_payment` in order resources |
| Display eSewa attempt on a sale created from an order | Supported through the sale's order context |
| Display eSewa attempt on a direct sale/POS sale | No direct eSewa attempt relationship; normally null |
| Initiate eSewa on order confirmation/conversion | Not supported |
| Initiate eSewa on sale/POS creation | Not supported |
| Add an eSewa payment to an existing sale | Not supported |
| Poll eSewa verification with a staff bearer token | No route |

The payment-method validators on staff sale/POS creation, order confirmation/conversion, and added sale payments accept `cash`, `bank`, and `fonepay`, not `esewa`. Staff order creation does not implement an eSewa branch; sending `payment_method: "esewa"` there does not generate a signed form or collect payment, even if the order itself saves successfully.

There is no `/api/esewa/initiate/...` or `/api/esewa/status/...`. Do not construct these paths in the client or send a staff token to customer-authenticated routes. To implement staff eSewa checkout, corresponding backend support is required first. The working customer flow is documented in [customer eSewa](esewa-frontend-routes.md).

## Read-only display flow

Send `Authorization: Bearer <staff-token>` and `Accept: application/json` to existing resource endpoints:

| Method | Full path | Permission | Payment object location |
| --- | --- | --- | --- |
| GET | `/api/order/show/{id}` | `access-order` | `data.esewa_payment` |
| GET | `/api/sale/show/{id}` | `access-sales` | `data.sale.esewa_payment` |
| GET | `/api/pos/show/{id}` | `access-pos` | `data.sale.esewa_payment` |
| GET | `/api/sales-payment/{saleId}` | `access-sales` | `data.esewa_payment`, beside ledger `payments` |

1. Load the record with the staff API and read its nullable `esewa_payment`.
2. If null, show no eSewa attempt. Null is not a payment failure.
3. If present, display gateway status and reference details separately from sale balance/ledger entries.
4. Provide “Refresh record” using the same GET endpoint. These reads are not an eSewa gateway-verification API. Scheduled backend reconciliation can update the data between refreshes.
5. If verified money has a reconciliation error, show “Payment received; accounting requires attention.” Avoid exposing a button that posts the same money as cash/bank.

Example resource fragment:

```json
{
  "esewa_payment": {
    "id": 18,
    "payment_amount": 1000,
    "payment_status": "paid",
    "lifecycle_status": "resolved",
    "transaction_uuid": "7d91a090-bc8f-43fa-85a2-c5b55f5089e3",
    "esewa_status": "COMPLETE",
    "esewa_ref_id": "gateway-reference",
    "reconciliation_error": null,
    "status_check_attempts": 2
  }
}
```

Additional nullable fields include `payment_date`, `last_status_checked_at`, `next_status_check_at`, `abandoned_at`, and `reconciliation_error_at`. eSewa resources do not expose an `accounting_finalized` boolean or a signed gateway form payload.

## Display rules

| Data | Suggested UI |
| --- | --- |
| `pending` | Awaiting confirmation |
| `paid` + no error + `resolved` | Verified eSewa payment; display actual sale/ledger balances |
| `paid` + reconciliation error | Payment received; accounting processing/review pending |
| `failed` | Gateway verification failed |
| Lifecycle `manual_review` | Needs review; do not automatically collect a replacement |
| Lifecycle `abandoned` | Automatic checking stopped; not proof of failure |

The selected eSewa resource is the newest **paid** attempt if one exists, otherwise the newest attempt. It is not a complete attempt-history listing. `payment_amount` is the attempt amount, not necessarily a fresh ledger credit. Keep the ledger `payments` array and sale `paid_amount`/`due_amount` as the accounting source of truth.

## Frontend acceptance checks

- Staff eSewa payment collection is hidden/disabled until a backend route exists.
- Order-linked eSewa details display without changing balances locally.
- Null, pending, abandoned, failed, and manual-review states are handled.
- Customer tokens and staff tokens are never interchanged.

Related: [supported staff Fonepay checkout](fonepay-api-routes.md), [shared client conventions](README.md).
