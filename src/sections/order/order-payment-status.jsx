"use client";

import { useState } from "react";

import { useAppSelector } from "@/redux/hooks";

import { fCurrency } from "@/utils/format-number";

import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";

import { initiateEsewaPayment, checkEsewaStatusByOrder, initiateFonepayPayment } from "@/api";
import {
    getEsewaAttemptDisplay,
    ESEWA_TONE_CLASSES,
    rememberEsewaAttempt,
    submitEsewaCheckoutForm,
    rememberFonepayAttempt,
} from "@/utils";

import { FonepayQrDialog } from "../payment/fonepay-qr-dialog";

// ----------------------------------------------------------------------

const PAYMENT_METHOD_META = {
    cash: { label: "Cash on Delivery", icon: "solar:wallet-money-bold" },
    cod: { label: "Cash on Delivery", icon: "solar:wallet-money-bold" },
    bank: { label: "Bank Transfer", icon: "solar:card-bold" },
    fonepay: {
        label: "Checkout by Fonepay",
        image: "/assets/images/payment-vendors/CheckoutByFonepay.webp",
    },
    esewa: { label: "eSewa", image: "/assets/images/payment-vendors/esewa.png" },
};

function getPaymentMethodMeta(method) {
    const key = String(method || "").toLowerCase();

    return (
        PAYMENT_METHOD_META[key] || {
            label: method ? String(method) : "Not selected",
            icon: "solar:card-bold",
        }
    );
}

// ----------------------------------------------------------------------
// Renders whatever payment actually happened on the order — cash, bank,
// fonepay or eSewa — from the sale's own paid/due ledger, which is the
// accounting source of truth. Gateway attempts (esewa/fonepay) are shown
// underneath for reference, with eSewa refresh/retry where applicable.
// ----------------------------------------------------------------------

export function OrderPaymentStatus({
    orderId,
    orderStatus,
    orderTotal,
    sale,
    esewaPayment,
    fonepayPayment,
    onRefresh,
}) {
    const { vendor } = useAppSelector((state) => state.vendor);
    const [currentEsewa, setCurrentEsewa] = useState(esewaPayment);
    const [isChecking, setIsChecking] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);
    const [fonepayDialogOpen, setFonepayDialogOpen] = useState(false);
    const [payNowFonepay, setPayNowFonepay] = useState(null); // QR data for the "Pay now" flow
    const [startingGateway, setStartingGateway] = useState(""); // "fonepay" | "esewa" | ""

    // Online payment can only start before a sale is linked (the backend
    // rejects initiation otherwise), and never for a cancelled order or one
    // whose gateway payment already went through.
    const hasPaidAttempt =
        currentEsewa?.payment_status === "paid" || fonepayPayment?.payment_status === "paid";
    const isCancelled = /cancel|reject/i.test(String(orderStatus || ""));
    const canPayOnline = !sale && !isCancelled && !hasPaidAttempt;
    const showPayFonepay = canPayOnline && vendor?.has_fonepay_checkout;
    const showPayEsewa = canPayOnline && vendor?.has_esewa_checkout;

    const handlePayFonepay = async () => {
        if (startingGateway) return;

        // Customer initiation always issues a new PRN, so reopen a still-pending
        // QR instead of creating a duplicate attempt.
        if (
            fonepayPayment?.payment_status === "pending" &&
            fonepayPayment?.prn &&
            fonepayPayment?.qr_message
        ) {
            setPayNowFonepay({
                prn: fonepayPayment.prn,
                amount: fonepayPayment.payment_amount,
                qr_message: fonepayPayment.qr_message,
                thirdparty_qr_websocket_url: fonepayPayment.thirdparty_qr_websocket_url,
            });
            return;
        }

        setStartingGateway("fonepay");

        try {
            const response = await initiateFonepayPayment(orderId);
            const data = response?.data;

            if (!data?.qr_message || !data?.prn) {
                throw new Error("Couldn't get a Fonepay QR code.");
            }

            rememberFonepayAttempt({ orderId, prn: data.prn });

            setPayNowFonepay({
                prn: data.prn,
                amount: data.amount,
                qr_message: data.qr_message,
                thirdparty_qr_websocket_url: data.thirdparty_qr_websocket_url,
            });
        } catch (err) {
            toast.error(err?.message || "Couldn't start Fonepay payment.");
        } finally {
            setStartingGateway("");
        }
    };

    const handlePayEsewa = async () => {
        if (startingGateway) return;

        setStartingGateway("esewa");

        try {
            // Recheck an earlier attempt first so a paid order is never charged twice
            if (currentEsewa) {
                const statusResponse = await checkEsewaStatusByOrder(orderId);
                const attempt = statusResponse?.data?.esewa_payment;

                if (attempt?.payment_status === "paid") {
                    setCurrentEsewa(attempt);
                    toast.success("This order is already paid.");
                    onRefresh?.();
                    return;
                }
            }

            const response = await initiateEsewaPayment(orderId);
            const { payment_url, payload } = response?.data || {};

            if (!payment_url || !payload) {
                throw new Error("Couldn't start eSewa payment.");
            }

            rememberEsewaAttempt({
                orderId,
                transactionUuid: payload.transaction_uuid,
            });

            toast.success("Redirecting to eSewa...");
            submitEsewaCheckoutForm({ payment_url, payload });
        } catch (err) {
            toast.error(err?.message || "Couldn't start eSewa payment.");
        } finally {
            setStartingGateway("");
        }
    };

    const handlePayNowFonepaySuccess = () => {
        setPayNowFonepay(null);
        toast.success("Payment successful!");
        onRefresh?.();
    };

    if (!sale) {
        return (
            <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Payment</h3>
                    {hasPaidAttempt ? (
                        <span className={["rounded-full px-2.5 py-1 text-xs font-medium", ESEWA_TONE_CLASSES.success].join(" ")}>
                            Payment received
                        </span>
                    ) : (
                        canPayOnline && (
                            <span className={["rounded-full px-2.5 py-1 text-xs font-medium", ESEWA_TONE_CLASSES.pending].join(" ")}>
                                Unpaid
                            </span>
                        )
                    )}
                </div>

                {showPayFonepay || showPayEsewa ? (
                    <>
                        <p className="mb-4 text-sm text-gray-500">
                            Pay {orderTotal ? <span className="font-semibold text-gray-800">{fCurrency(orderTotal)}</span> : "for this order"} online now.
                        </p>

                        <div className="flex flex-col gap-2">
                            {showPayFonepay && (
                                <button
                                    type="button"
                                    onClick={handlePayFonepay}
                                    disabled={Boolean(startingGateway)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-[#ce2027] hover:bg-red-50 disabled:opacity-60"
                                >
                                    <div className="flex items-end gap-2">


                                        <img
                                            src="/assets/images/payment-vendors/connect.png"
                                            alt=""
                                            className="h-5 w-auto"
                                        />
                                        <img
                                            src="/assets/images/payment-vendors/CheckoutByFonepay.webp"
                                            alt=""
                                            className="h-5 w-auto"
                                        />
                                    </div>
                                    {startingGateway === "fonepay" ? "Generating QR..." : "Pay with Fonepay"}
                                </button>
                            )}

                            {showPayEsewa && (
                                <button
                                    type="button"
                                    onClick={handlePayEsewa}
                                    disabled={Boolean(startingGateway)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-[#60bb46] hover:bg-green-50 disabled:opacity-60"
                                >
                                    <img
                                        src="/assets/images/payment-vendors/esewa.png"
                                        alt=""
                                        className="h-5 w-auto"
                                    />
                                    {startingGateway === "esewa" ? "Redirecting to eSewa..." : "Pay with eSewa"}
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-gray-500">
                        {hasPaidAttempt
                            ? "Your payment was received. It will reflect here once your order is confirmed."
                            : "Payment will be processed once your order is confirmed."}
                    </p>
                )}

                <FonepayQrDialog
                    open={Boolean(payNowFonepay)}
                    orderId={orderId}
                    initialData={payNowFonepay}
                    onClose={() => {
                        setPayNowFonepay(null);
                        onRefresh?.();
                    }}
                    onSuccess={handlePayNowFonepaySuccess}
                />
            </div>
        );
    }

    const methodMeta = getPaymentMethodMeta(sale.payment_method);

    const totalAmount = Number(sale.total_amount || 0);
    const paidAmount = Number(sale.paid_amount || 0);
    const dueAmount = Number(sale.due_amount ?? totalAmount - paidAmount);

    const overallTone =
        dueAmount <= 0 ? "success" : paidAmount > 0 ? "warning" : "pending";
    const overallLabel =
        dueAmount <= 0
            ? "Paid"
            : paidAmount > 0
                ? "Partially paid"
                : "Payment pending";

    const gatewayAttempt = currentEsewa || fonepayPayment;
    const gatewayName = currentEsewa ? "eSewa" : fonepayPayment ? "Fonepay" : null;
    const attemptDisplay = gatewayAttempt
        ? getEsewaAttemptDisplay(gatewayAttempt)
        : null;

    const canRetryEsewa =
        vendor?.has_esewa_checkout &&
        sale.payment_method === "esewa" &&
        currentEsewa &&
        (currentEsewa.payment_status === "failed" ||
            currentEsewa.lifecycle_status === "abandoned");

    // Only offer Fonepay interaction while the vendor has it enabled —
    // otherwise a retry would initiate against missing credentials.
    const canOpenFonepay =
        vendor?.has_fonepay_checkout &&
        sale.payment_method === "fonepay" &&
        fonepayPayment &&
        fonepayPayment.payment_status !== "paid";

    const handleRefresh = async () => {
        setIsChecking(true);
        try {
            const response = await checkEsewaStatusByOrder(orderId);
            setCurrentEsewa(response?.data?.esewa_payment || currentEsewa);
            onRefresh?.();
        } catch (err) {
            toast.error(err?.message || "Couldn't refresh payment status.");
        } finally {
            setIsChecking(false);
        }
    };

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            const response = await initiateEsewaPayment(orderId);
            const { payment_url, payload } = response?.data || {};

            if (!payment_url || !payload) {
                throw new Error("Couldn't start eSewa payment.");
            }

            rememberEsewaAttempt({
                orderId,
                transactionUuid: payload.transaction_uuid,
            });

            toast.success("Redirecting to eSewa...");
            submitEsewaCheckoutForm({ payment_url, payload });
        } catch (err) {
            toast.error(err?.message || "Couldn't start a new payment attempt.");
        } finally {
            setIsRetrying(false);
        }
    };

    const handleFonepaySuccess = () => {
        setFonepayDialogOpen(false);
        toast.success("Payment successful!");
        onRefresh?.();
    };

    return (
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Payment</h3>
                <span
                    className={[
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        ESEWA_TONE_CLASSES[overallTone],
                    ].join(" ")}
                >
                    {overallLabel}
                </span>
            </div>

            {/* Method */}
            <div className="mb-4 flex items-center gap-3">
                <span
                    className={[
                        "flex h-10 w-14 shrink-0 items-center justify-center rounded-lg",
                        methodMeta.image ? "border border-gray-200 bg-white" : "bg-gray-100 text-gray-600",
                    ].join(" ")}
                >
                    {methodMeta.image ? (
                        <img
                            src={methodMeta.image}
                            alt={methodMeta.label}
                            className="h-6 w-auto max-w-full object-contain"
                        />
                    ) : (
                        <Iconify icon={methodMeta.icon} className="h-5 w-5" />
                    )}
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                        {methodMeta.label}
                    </p>
                    {sale.invoice_number && (
                        <p className="truncate text-xs text-gray-500">
                            Invoice {sale.invoice_number}
                        </p>
                    )}
                </div>
            </div>

            {/* Amounts — the ledger is the source of truth, not the gateway attempt */}
            <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                    <dt className="text-gray-500">Total</dt>
                    <dd className="font-medium text-gray-900">
                        {fCurrency(totalAmount)}
                    </dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-gray-500">Paid</dt>
                    <dd className="font-medium text-gray-900">
                        {fCurrency(paidAmount)}
                    </dd>
                </div>
                {dueAmount > 0 && (
                    <div className="flex justify-between">
                        <dt className="text-gray-500">Due</dt>
                        <dd className="font-medium text-red-600">
                            {fCurrency(dueAmount)}
                        </dd>
                    </div>
                )}
            </dl>

            {/* Gateway attempt detail (eSewa / Fonepay) */}
            {gatewayAttempt && attemptDisplay && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            {gatewayName} attempt
                        </p>
                        <span
                            className={[
                                "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                                ESEWA_TONE_CLASSES[attemptDisplay.tone],
                            ].join(" ")}
                        >
                            {attemptDisplay.label}
                        </span>
                    </div>

                    {(gatewayAttempt.esewa_ref_id || gatewayAttempt.transaction_uuid) && (
                        <p
                            className="truncate text-xs text-gray-500"
                            title={gatewayAttempt.transaction_uuid}
                        >
                            Ref: {gatewayAttempt.esewa_ref_id || gatewayAttempt.transaction_uuid}
                        </p>
                    )}

                    {currentEsewa && (
                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={isChecking}
                                className="flex-1 rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                            >
                                {isChecking ? "Refreshing..." : "Refresh"}
                            </button>

                            {canRetryEsewa && (
                                <button
                                    type="button"
                                    onClick={handleRetry}
                                    disabled={isRetrying}
                                    className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-60"
                                >
                                    {isRetrying ? "Starting..." : "Retry payment"}
                                </button>
                            )}
                        </div>
                    )}

                    {canOpenFonepay && (
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => setFonepayDialogOpen(true)}
                                className="w-full rounded-lg px-3 py-2 text-xs font-semibold text-white transition hover:brightness-90"
                                style={{ backgroundColor: "#ce2027" }}
                            >
                                {fonepayPayment.payment_status === "failed"
                                    ? "Retry with Fonepay"
                                    : "View QR / Check status"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {canOpenFonepay && (
                <FonepayQrDialog
                    open={fonepayDialogOpen}
                    orderId={orderId}
                    initialData={{
                        prn: fonepayPayment.prn,
                        amount: fonepayPayment.payment_amount,
                        qr_message: fonepayPayment.qr_message,
                        thirdparty_qr_websocket_url: fonepayPayment.thirdparty_qr_websocket_url,
                    }}
                    onClose={() => setFonepayDialogOpen(false)}
                    onSuccess={handleFonepaySuccess}
                />
            )}
        </div>
    );
}
