// ----------------------------------------------------------------------
// Persist the in-flight attempt so a reload/re-login/lost redirect can
// resume status checks without creating a duplicate eSewa initiation.
// ----------------------------------------------------------------------

const PENDING_ORDER_KEY = "esewa_pending_order_id";
const PENDING_UUID_KEY = "esewa_pending_transaction_uuid";

export function rememberEsewaAttempt({ orderId, transactionUuid }) {
  try {
    if (orderId) localStorage.setItem(PENDING_ORDER_KEY, String(orderId));
    if (transactionUuid)
      localStorage.setItem(PENDING_UUID_KEY, String(transactionUuid));
  } catch {
    // localStorage unavailable — attempt just won't be recoverable locally
  }
}

export function getRememberedEsewaAttempt() {
  try {
    return {
      orderId: localStorage.getItem(PENDING_ORDER_KEY) || "",
      transactionUuid: localStorage.getItem(PENDING_UUID_KEY) || "",
    };
  } catch {
    return { orderId: "", transactionUuid: "" };
  }
}

export function forgetEsewaAttempt() {
  try {
    localStorage.removeItem(PENDING_ORDER_KEY);
    localStorage.removeItem(PENDING_UUID_KEY);
  } catch {
    // ignore
  }
}

// ----------------------------------------------------------------------
// Submit every returned payload field unchanged as a normal browser form
// POST. Never fetch the gateway expecting JSON, never regenerate the
// signature client-side.
// ----------------------------------------------------------------------

export function submitEsewaCheckoutForm({ payment_url, payload }) {
  if (typeof window === "undefined" || !payment_url || !payload) return;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = payment_url;

  Object.entries(payload).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

// ----------------------------------------------------------------------
// Map a nullable gateway attempt (esewa_payment, fonepay_payment — same
// shape: payment_status/lifecycle_status/reconciliation_error) to a short
// label + tone for display. Null is not a payment failure.
// ----------------------------------------------------------------------

export function getEsewaAttemptDisplay(attempt) {
  if (!attempt) {
    return { label: "No attempt yet", tone: "neutral" };
  }

  const { payment_status, lifecycle_status, reconciliation_error } = attempt;

  if (lifecycle_status === "manual_review") {
    return { label: "Payment needs review", tone: "warning" };
  }

  if (lifecycle_status === "abandoned") {
    return { label: "Automatic checking stopped", tone: "neutral" };
  }

  if (payment_status === "paid" && reconciliation_error) {
    return {
      label: "Payment received; accounting processing pending",
      tone: "warning",
    };
  }

  if (payment_status === "paid" && lifecycle_status === "resolved") {
    return { label: "Verified payment", tone: "success" };
  }

  if (payment_status === "paid") {
    return { label: "Payment received", tone: "success" };
  }

  if (payment_status === "failed") {
    return { label: "Gateway verification failed", tone: "error" };
  }

  if (payment_status === "pending") {
    return { label: "Awaiting confirmation", tone: "pending" };
  }

  return { label: "Payment status unknown", tone: "neutral" };
}

// Tailwind classes per tone, shared by every eSewa status badge.
export const ESEWA_TONE_CLASSES = {
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  pending:
    "bg-[color-mix(in_srgb,var(--vendor-primary-color,#111827)_10%,white)] text-[var(--vendor-primary-color,#111827)]",
  error: "bg-red-50 text-red-600",
  neutral: "bg-gray-100 text-gray-600",
};
