// ----------------------------------------------------------------------
// Persist the in-flight attempt so a reload/re-login/lost response can
// resume status checks without requesting a duplicate QR (customer
// initiation always issues a new PRN — there is no server-side reuse).
// ----------------------------------------------------------------------

const PENDING_ORDER_KEY = "fonepay_pending_order_id";
const PENDING_PRN_KEY = "fonepay_pending_prn";

export function rememberFonepayAttempt({ orderId, prn }) {
  try {
    if (orderId) localStorage.setItem(PENDING_ORDER_KEY, String(orderId));
    if (prn) localStorage.setItem(PENDING_PRN_KEY, String(prn));
  } catch {
    // localStorage unavailable — attempt just won't be recoverable locally
  }
}

export function getRememberedFonepayAttempt() {
  try {
    return {
      orderId: localStorage.getItem(PENDING_ORDER_KEY) || "",
      prn: localStorage.getItem(PENDING_PRN_KEY) || "",
    };
  } catch {
    return { orderId: "", prn: "" };
  }
}

export function forgetFonepayAttempt() {
  try {
    localStorage.removeItem(PENDING_ORDER_KEY);
    localStorage.removeItem(PENDING_PRN_KEY);
  } catch {
    // ignore
  }
}

// ----------------------------------------------------------------------
// Render the gateway-provided QR text as a scannable image. qr_message is
// raw QR payload text, not a guaranteed image URL or base64 PNG.
// ----------------------------------------------------------------------

export async function generateFonepayQrDataUrl(qrMessage) {
  if (!qrMessage || typeof window === "undefined") return "";

  try {
    const QRCode = (await import("qrcode")).default;

    return await QRCode.toDataURL(qrMessage, {
      margin: 1,
      width: 320,
    });
  } catch {
    return "";
  }
}

// ----------------------------------------------------------------------
// Customer status response is a flat object (payment_status,
// lifecycle_status, accounting_finalized, reconciliation_error) — not
// nested like eSewa's esewa_payment. Map it to a UI state key per the
// documented table.
// ----------------------------------------------------------------------

export function resolveFonepayUiState(status) {
  if (!status) return { key: "unknown" };

  const { payment_status, lifecycle_status, accounting_finalized, reconciliation_error } =
    status;

  if (lifecycle_status === "abandoned" && payment_status === "pending") {
    return { key: "abandoned" };
  }

  if (payment_status === "paid" && accounting_finalized) {
    return { key: "success" };
  }

  if (payment_status === "paid") {
    return { key: "paid_pending_finalize" };
  }

  if (payment_status === "failed") {
    return { key: "failed" };
  }

  if (payment_status === "pending" && reconciliation_error) {
    return { key: "errors_pending" };
  }

  if (payment_status === "pending") {
    return { key: "pending" };
  }

  return { key: "unknown" };
}
