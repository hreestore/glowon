"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fCurrency } from "@/utils/format-number";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";

import { checkFonepayStatusByPrn, initiateFonepayPayment } from "@/api";
import {
    rememberFonepayAttempt,
    forgetFonepayAttempt,
    generateFonepayQrDataUrl,
    resolveFonepayUiState,
} from "@/utils";

// ----------------------------------------------------------------------
// "Checkout by Fonepay" brand guideline (2026): logo center-aligned above
// the QR, "Check Status" button in Fonepay Red (#ce2027), and the fixed
// "How to pay using this QR code" step list — reproduced verbatim below.
// ----------------------------------------------------------------------

const FONEPAY_RED = "#ce2027";

const HOW_TO_STEPS = [
    "Open your mobile banking app or digital wallet.",
    "Log in, or simply tap the scan button (login not always required).",
    "Scan the QR code.",
    "Verify the payment details.",
    "Tap Confirm to complete your payment.",
];

const POLL_INTERVAL_MS = 4000;

export function FonepayQrDialog({ open, orderId, initialData, onClose, onSuccess }) {
    const [prn, setPrn] = useState(initialData?.prn || "");
    const [amount, setAmount] = useState(initialData?.amount || 0);
    const [qrMessage, setQrMessage] = useState(initialData?.qr_message || "");
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [status, setStatus] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [wsUrl, setWsUrl] = useState(initialData?.thirdparty_qr_websocket_url || "");
    const [isScanned, setIsScanned] = useState(false);

    const pollTimeoutRef = useRef(null);
    const resolvedRef = useRef(false);

    // Reset local state whenever a fresh attempt is opened
    useEffect(() => {
        if (!open) return;

        setPrn(initialData?.prn || "");
        setAmount(initialData?.amount || 0);
        setQrMessage(initialData?.qr_message || "");
        setWsUrl(initialData?.thirdparty_qr_websocket_url || "");
        setIsScanned(false);
        setStatus(null);
        setErrorMessage("");
        resolvedRef.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Render the gateway QR text as a scannable image
    useEffect(() => {
        let cancelled = false;

        if (!qrMessage) {
            setQrDataUrl("");
            return undefined;
        }

        generateFonepayQrDataUrl(qrMessage).then((url) => {
            if (!cancelled) setQrDataUrl(url);
        });

        return () => {
            cancelled = true;
        };
    }, [qrMessage]);

    // Fonepay reports an unscanned/unpaid QR as "failed", and a later status
    // check still re-queries the gateway — so while the QR is open, "failed"
    // just means "not paid yet": keep showing the QR and keep polling.
    const resolvedUiState = resolveFonepayUiState(status);
    const uiState = resolvedUiState.key === "failed" ? { key: "pending" } : resolvedUiState;

    const checkStatus = useCallback(
        async ({ silent } = {}) => {
            if (!prn) return null;

            if (!silent) setIsChecking(true);
            setErrorMessage("");

            try {
                const response = await checkFonepayStatusByPrn(prn);
                const data = response?.data || null;

                setStatus(data);

                return data;
            } catch (err) {
                setErrorMessage(
                    typeof err?.message === "string"
                        ? err.message
                        : "Verification unavailable. Please try again."
                );

                return null;
            } finally {
                setIsChecking(false);
            }
        },
        [prn]
    );

    // Latest callbacks in refs so the websocket isn't reconnected on every
    // parent render (onSuccess is an inline handler there).
    const checkStatusRef = useRef(checkStatus);
    const onSuccessRef = useRef(onSuccess);
    useEffect(() => {
        checkStatusRef.current = checkStatus;
        onSuccessRef.current = onSuccess;
    }, [checkStatus, onSuccess]);

    const verifyAndFinish = useCallback(async ({ silent } = {}) => {
        const data = await checkStatusRef.current({ silent });

        if (data?.payment_status === "paid" && data?.accounting_finalized && !resolvedRef.current) {
            resolvedRef.current = true;
            onSuccessRef.current?.(data);
        }
    }, []);

    // Only ask the backend for status once Fonepay's websocket reports the
    // payment succeeded. Checking an unscanned QR makes the backend record
    // Fonepay's "failed" as the final result. The websocket event is only a
    // trigger; the backend status response is the proof of payment.
    useEffect(() => {
        if (!open || !wsUrl) return undefined;

        let ws;
        try {
            ws = new WebSocket(wsUrl);
        } catch {
            return undefined;
        }

        ws.onmessage = (event) => {
            let tx;
            try {
                const message = JSON.parse(event.data);
                tx =
                    typeof message?.transactionStatus === "string"
                        ? JSON.parse(message.transactionStatus)
                        : message?.transactionStatus;
            } catch {
                return;
            }

            if (!tx) return;

            if (tx.qrVerified) setIsScanned(true);

            const paid =
                tx.paymentSuccess === true ||
                (tx.success === true && tx.message === "Request Complete");

            if (paid && !resolvedRef.current) verifyAndFinish();
        };

        return () => ws.close();
    }, [open, wsUrl, verifyAndFinish]);

    // Once the backend says "paid" but accounting isn't finalized yet, keep
    // checking until it is — a paid attempt can't be wrongly marked failed.
    useEffect(() => {
        if (!open || uiState.key !== "paid_pending_finalize" || resolvedRef.current) {
            return undefined;
        }

        pollTimeoutRef.current = setTimeout(() => verifyAndFinish({ silent: true }), POLL_INTERVAL_MS);

        return () => clearTimeout(pollTimeoutRef.current);
    }, [open, uiState.key, status, verifyAndFinish]);

    // A resolved attempt no longer needs to be recoverable from storage
    useEffect(() => {
        if (uiState.key === "success") {
            forgetFonepayAttempt();
        }
    }, [uiState.key]);

    const handleManualCheck = () => checkStatus();

    const handleRestart = async () => {
        if (!orderId || isRestarting) return;

        setIsRestarting(true);

        try {
            const response = await initiateFonepayPayment(orderId);
            const data = response?.data;

            if (!data?.qr_message || !data?.prn) {
                throw new Error("Couldn't get a new QR code.");
            }

            rememberFonepayAttempt({ orderId, prn: data.prn });

            setPrn(data.prn);
            setAmount(data.amount);
            setQrMessage(data.qr_message);
            setWsUrl(data.thirdparty_qr_websocket_url || "");
            setIsScanned(false);
            setStatus(null);
            resolvedRef.current = false;
        } catch (err) {
            toast.error(
                typeof err?.message === "string"
                    ? err.message
                    : "Couldn't start a new payment attempt."
            );
        } finally {
            setIsRestarting(false);
        }
    };

    if (!open) return null;

    const renderHeader = () => (
        <>
            <div className="mb-1 flex items-end gap-2 justify-center">
                <img
                    src="/assets/images/payment-vendors/connect.png"
                    alt="Checkout by Fonepay"
                    className="h-6 w-auto"
                />
                <img
                    src="/assets/images/payment-vendors/CheckoutByFonepay.webp"
                    alt="Checkout by Fonepay"
                    className="h-7 w-auto"
                />
            </div>
            <p className="mb-4 text-center text-sm text-gray-500">
                Use your <span className="font-semibold text-gray-700">Mobile Banking or Wallets App</span> to
                scan
            </p>
        </>
    );

    const renderBody = () => {
        if (uiState.key === "success") {
            return (
                <div className="flex flex-col items-center py-4 text-center">
                    <div
                        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                        style={{ backgroundColor: "#e9f9ef" }}
                    >
                        <Iconify icon="solar:check-circle-bold" className="h-9 w-9 text-emerald-600" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Payment successful</h3>
                    <p className="text-sm text-gray-500">Your Fonepay payment has been verified.</p>
                </div>
            );
        }

        if (!qrMessage) {
            return (
                <div className="flex flex-col items-center py-4 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Iconify icon="solar:qr-code-bold" className="h-9 w-9 text-gray-400" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">QR unavailable</h3>
                    <p className="mb-5 text-sm text-gray-500">
                        We couldn't get a QR code for this payment. Your order is saved — you can try again.
                    </p>
                    <button
                        type="button"
                        onClick={handleRestart}
                        disabled={isRestarting}
                        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-90 disabled:opacity-60"
                        style={{ backgroundColor: FONEPAY_RED }}
                    >
                        {isRestarting ? "Starting..." : "Get QR code"}
                    </button>
                </div>
            );
        }

        return (
            <>
                <div className="mb-4 flex justify-center">
                    {qrDataUrl ? (
                        <img
                            src={qrDataUrl}
                            alt="Fonepay QR code"
                            className="h-48 w-48 rounded-lg border border-gray-100"
                        />
                    ) : (
                        <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-gray-50 text-xs text-gray-400">
                            Generating QR...
                        </div>
                    )}
                </div>

                <p className="mb-4 text-center text-lg font-semibold text-gray-900">
                    {fCurrency(amount)}
                </p>

                {isScanned && uiState.key === "pending" && (
                    <div className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-center text-xs text-blue-700">
                        QR scanned — confirm the payment in your app.
                    </div>
                )}

                {uiState.key === "paid_pending_finalize" && (
                    <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
                        Payment received — finishing verification. No need to pay again.
                    </div>
                )}

                {uiState.key === "errors_pending" && (
                    <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                        Verification unavailable right now. Try checking again.
                    </div>
                )}

                {uiState.key === "abandoned" && (
                    <div className="mb-4 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs text-gray-600">
                        Automatic checks stopped. This isn't proof of failure — you can still check manually.
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleManualCheck}
                    disabled={isChecking}
                    className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-90 disabled:opacity-60"
                    style={{ backgroundColor: FONEPAY_RED }}
                >
                    {isChecking ? "Checking..." : "Check Status"}
                </button>

                <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold text-gray-700">
                        How to pay using this QR code:
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-gray-500">
                        {HOW_TO_STEPS.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ul>
                </div>
            </>
        );
    };

    return (
        <div
            className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 px-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-1 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-400 transition hover:text-gray-600"
                    >
                        <Iconify icon="mdi:close" className="h-5 w-5" />
                    </button>
                </div>

                {renderHeader()}
                {renderBody()}
            </div>
        </div>
    );
}
