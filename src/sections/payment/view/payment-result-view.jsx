"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSearchParams } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";

import { useAppSelector } from "@/redux/hooks";

import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";

import {
    checkEsewaStatusByUuid,
    checkEsewaStatusByOrder,
    initiateEsewaPayment,
} from "@/api";

import {
    rememberEsewaAttempt,
    getRememberedEsewaAttempt,
    forgetEsewaAttempt,
    submitEsewaCheckoutForm,
    ESEWA_TONE_CLASSES,
} from "@/utils";

// ----------------------------------------------------------------------

const POLL_INTERVAL_MS = 5000;
const MAX_AUTO_POLLS = 6; // ~30s of automatic polling

// Backend redirects can include order_id/transaction_uuid/status/reason,
// but they're only navigation hints — the actual state always comes from
// re-checking status with the customer's own token.
function resolveUiState(result) {
    if (!result) return { key: "unknown" };

    const { status, esewa_payment: attempt } = result;
    const lifecycle = attempt?.lifecycle_status;
    const paymentStatus = attempt?.payment_status;
    const reconciliationError = attempt?.reconciliation_error;

    if (lifecycle === "manual_review") return { key: "manual_review" };
    if (lifecycle === "abandoned") return { key: "abandoned" };

    if (
        status === "paid" &&
        paymentStatus === "paid" &&
        lifecycle === "resolved" &&
        !reconciliationError
    ) {
        return { key: "success" };
    }

    if (paymentStatus === "paid" && reconciliationError) {
        return { key: "paid_reconciliation_error" };
    }

    if (status === "pending") return { key: "pending" };

    if (status === "errors") {
        return paymentStatus === "paid"
            ? { key: "errors_paid" }
            : { key: "errors_pending" };
    }

    if (status === "failed") return { key: "failed" };

    return { key: "unknown" };
}

const STATE_CONTENT = {
    success: {
        tone: "success",
        icon: "solar:check-circle-bold",
        title: "Payment successful",
        description: "Your eSewa payment has been verified.",
    },
    pending: {
        tone: "pending",
        icon: "svg-spinners:8-dots-rotate",
        title: "Waiting for payment confirmation",
        description:
            "We're still confirming your payment with eSewa. This can take a moment.",
    },
    errors_pending: {
        tone: "error",
        icon: "solar:refresh-circle-bold",
        title: "Verification unavailable",
        description:
            "We couldn't verify the payment status right now. Please try checking again — no new charge will be made.",
    },
    errors_paid: {
        tone: "warning",
        icon: "solar:clock-circle-bold",
        title: "Payment received; order processing pending",
        description:
            "Your payment was received. We're still finishing verification, so no second charge is needed.",
    },
    paid_reconciliation_error: {
        tone: "warning",
        icon: "solar:clock-circle-bold",
        title: "Payment received; accounting requires attention",
        description:
            "Your payment was received. Our team needs to reconcile it before it reflects on your order balance.",
    },
    failed: {
        tone: "error",
        icon: "solar:close-circle-bold",
        title: "Payment failed",
        description:
            "eSewa reported that this payment attempt failed. You can retry after we recheck your order.",
    },
    manual_review: {
        tone: "warning",
        icon: "solar:shield-warning-bold",
        title: "Payment needs review",
        description:
            "This payment needs manual review. We won't automatically collect a replacement payment.",
    },
    abandoned: {
        tone: "neutral",
        icon: "solar:pause-circle-bold",
        title: "Automatic checking stopped",
        description:
            "Automatic status checks have stopped for this attempt. This is not proof of failure — you can still check manually.",
    },
    unknown: {
        tone: "neutral",
        icon: "solar:question-circle-bold",
        title: "Checking payment status",
        description: "",
    },
};

// ----------------------------------------------------------------------

export function PaymentResultView({ resultType }) {
    const searchParams = useSearchParams();

    const { isLogin } = useAppSelector((state) => state.auth);

    const remembered = getRememberedEsewaAttempt();

    const orderId = searchParams.get("order_id") || remembered.orderId || "";
    const transactionUuid =
        searchParams.get("transaction_uuid") || remembered.transactionUuid || "";
    const callbackReason = searchParams.get("reason") || "";

    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isRetrying, setIsRetrying] = useState(false);
    const [pollCount, setPollCount] = useState(0);

    const pollTimeoutRef = useRef(null);

    const hasUsableId = Boolean(orderId || transactionUuid);

    const checkStatus = useCallback(
        async ({ silent } = {}) => {
            if (!hasUsableId) return;

            if (!silent) setIsLoading(true);
            setErrorMessage("");

            try {
                const response = transactionUuid
                    ? await checkEsewaStatusByUuid(transactionUuid)
                    : await checkEsewaStatusByOrder(orderId);

                setResult(response?.data || null);
            } catch (err) {
                setErrorMessage(
                    typeof err?.message === "string"
                        ? err.message
                        : "Verification unavailable. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        },
        [hasUsableId, transactionUuid, orderId]
    );

    // Initial check once we know the customer is authenticated
    useEffect(() => {
        if (isLogin && hasUsableId) {
            checkStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin, hasUsableId]);

    const uiState = resolveUiState(result);

    // Controlled polling while confirmation is still pending
    useEffect(() => {
        const shouldPoll =
            isLogin &&
            hasUsableId &&
            (uiState.key === "pending" || uiState.key === "unknown") &&
            pollCount < MAX_AUTO_POLLS;

        if (!shouldPoll) return undefined;

        pollTimeoutRef.current = setTimeout(async () => {
            await checkStatus({ silent: true });
            setPollCount((count) => count + 1);
        }, POLL_INTERVAL_MS);

        return () => clearTimeout(pollTimeoutRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin, hasUsableId, uiState.key, pollCount]);

    // Resolved attempts no longer need to be recoverable from storage
    useEffect(() => {
        if (["success", "failed", "manual_review", "errors_paid"].includes(uiState.key)) {
            forgetEsewaAttempt();
        } else if (orderId || transactionUuid) {
            rememberEsewaAttempt({ orderId, transactionUuid });
        }
    }, [uiState.key, orderId, transactionUuid]);

    const handleManualCheck = () => {
        setPollCount(0);
        checkStatus();
    };

    const handleRetryPayment = async () => {
        if (!orderId || isRetrying) return;

        setIsRetrying(true);

        try {
            // Recheck the order before offering a fresh attempt
            await checkStatus({ silent: true });

            const esewaResponse = await initiateEsewaPayment(orderId);
            const { payment_url, payload } = esewaResponse?.data || {};

            if (!payment_url || !payload) {
                throw new Error("Couldn't start a new eSewa payment.");
            }

            rememberEsewaAttempt({
                orderId,
                transactionUuid: payload.transaction_uuid,
            });

            toast.success("Redirecting to eSewa...");
            submitEsewaCheckoutForm({ payment_url, payload });
        } catch (err) {
            toast.error(
                typeof err?.message === "string"
                    ? err.message
                    : "Couldn't start a new payment attempt."
            );
        } finally {
            setIsRetrying(false);
        }
    };

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------

    if (!isLogin) {
        return (
            <div className="py-16">
                <div className="mx-auto max-w-md px-4 text-center">
                    <Iconify
                        icon="solar:lock-keyhole-bold"
                        className="mx-auto mb-4 h-12 w-12 text-gray-400"
                    />
                    <h1 className="mb-2 text-xl font-semibold text-gray-900">
                        Sign in to view this payment
                    </h1>
                    <p className="mb-6 text-sm text-gray-500">
                        We need to confirm it's your order before showing the payment
                        result.
                    </p>
                    <RouterLink
                        href={paths.auth.signIn}
                        className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        Sign in
                    </RouterLink>
                </div>
            </div>
        );
    }

    if (!hasUsableId) {
        return (
            <div className="py-16">
                <div className="mx-auto max-w-md px-4 text-center">
                    <Iconify
                        icon="solar:question-circle-bold"
                        className="mx-auto mb-4 h-12 w-12 text-gray-400"
                    />
                    <h1 className="mb-2 text-xl font-semibold text-gray-900">
                        We couldn't find this payment
                    </h1>
                    <p className="mb-6 text-sm text-gray-500">
                        {callbackReason ||
                            "This link is missing order details. Check your order history instead."}
                    </p>
                    <RouterLink
                        href={paths.order.root}
                        className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        View order history
                    </RouterLink>
                </div>
            </div>
        );
    }

    const content = STATE_CONTENT[uiState.key];
    const toneClass = ESEWA_TONE_CLASSES[content.tone];

    return (
        <div className="py-16">
            <div className="mx-auto max-w-md px-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                    <div
                        className={[
                            "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full",
                            toneClass,
                        ].join(" ")}
                    >
                        <Iconify icon={content.icon} className="h-8 w-8" />
                    </div>

                    <h1 className="mb-2 text-xl font-semibold text-gray-900">
                        {isLoading && !result ? "Confirming your payment..." : content.title}
                    </h1>

                    <p className="mb-6 text-sm text-gray-500">
                        {isLoading && !result
                            ? `eSewa redirected you to the ${resultType === "success" ? "success" : "failure"
                            } page — we're verifying the real status with the server before showing a result.`
                            : content.description}
                    </p>

                    {errorMessage && (
                        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {orderId && (
                            <RouterLink
                                href={paths.order.details(orderId)}
                                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                            >
                                View order
                            </RouterLink>
                        )}

                        {(uiState.key === "failed" || uiState.key === "abandoned") &&
                            orderId && (
                                <button
                                    type="button"
                                    onClick={handleRetryPayment}
                                    disabled={isRetrying}
                                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                                >
                                    {isRetrying ? "Starting new payment..." : "Retry payment"}
                                </button>
                            )}

                        {["pending", "errors_pending", "unknown", "abandoned"].includes(
                            uiState.key
                        ) && (
                                <button
                                    type="button"
                                    onClick={handleManualCheck}
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                                >
                                    {isLoading ? "Checking..." : "Check payment status"}
                                </button>
                            )}

                        {!orderId && (
                            <RouterLink
                                href={paths.order.root}
                                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                View order history
                            </RouterLink>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
