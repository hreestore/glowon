
"use client";

import { z as zod } from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter, usePathname, useSearchParams } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";

import { fCurrency } from "@/utils/format-number";
import { signInHrefWithReturnTo } from "@/utils/return-to";
import { getErrorMessage } from "@/utils/error-message";
import { getCartItemPricing, getCartItemTotal, getOrderUnitPrice } from "@/utils/product-pricing";

import { Form, Field, schemaHelper } from "@/components/hook-form";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";

import {
    useGetStates,
    submitQuickOrder,
    verifyOtpAndCreateOrder,
    getLogisticCharge,
    calculateCart,
    initiateEsewaPayment,
    initiateFonepayPayment,
} from "@/api";

import {
    rememberEsewaAttempt,
    submitEsewaCheckoutForm,
    rememberFonepayAttempt,
} from "@/utils";

import { OtpVerificationDialog } from "./otp-verification-dialog";
import { getBuyNowPricing } from "./buy-now-product-display";
import { PaymentMethodSelector } from "../cart/cart-summary";
import { FonepayQrDialog } from "../payment/fonepay-qr-dialog";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser, resetCart } from "@/redux/actions";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

function getSubmitLabel(paymentMethod, isSubmitting) {
    if (isSubmitting) {
        if (paymentMethod === "esewa") return "Redirecting to eSewa...";
        if (paymentMethod === "fonepay") return "Generating QR...";
        return "Placing...";
    }
    if (paymentMethod === "esewa") return "Place Order & Pay with eSewa";
    if (paymentMethod === "fonepay") return "Place Order & Pay with Fonepay";
    return "Place Order";
}

export function QuickOrderForm({
    mode,
    buyNowProduct,
    buyNowQuantity,
    buyNowVariantId,
    cartItems,
    onOrderStart,
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Login returns here with the same buy-now product/variant/quantity
    const query = searchParams.toString();
    const signInHref = signInHrefWithReturnTo(query ? `${pathname}?${query}` : pathname);
    const dispatch = useAppDispatch();
    const { states } = useGetStates();
    const { vendor } = useAppSelector((state) => state.vendor);
    const primaryColor = vendor?.primary_color || "#6B46C1";
    console.log(primaryColor, "primaryColor");
    const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' | 'esewa' | 'fonepay'
    const [fonepayCheckout, setFonepayCheckout] = useState(null); // { orderId, prn, amount, qr_message }

    const [districts, setDistricts] = useState([]);
    const [logisticCharge, setLogisticCharge] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [cartCalculation, setCartCalculation] = useState(null);
    const [otpDialogOpen, setOtpDialogOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [orderPreview, setOrderPreview] = useState(null);
    const [otpExpiryMinutes, setOtpExpiryMinutes] = useState(5);

    const defaultValues = {
        customer_name: "",
        customer_contact_info: "",
        customer_email: "",
        password: "",
        state_id: "",
        district_id: "",
        address: "",
        discount_code: "",
        remarks: "",
    };

    const methods = useForm({
        resolver: zodResolver(
            zod.object({
                customer_name: zod.string().min(1),
                customer_email: zod.string().email(),
                customer_contact_info: zod.string().min(10),
                state_id: schemaHelper.nullableInput(zod.string().min(1)),
                district_id: schemaHelper.nullableInput(zod.string().min(1)),
                address: zod.string().min(1),
                password: zod.string().optional(),
                discount_code: zod.string().optional(),
                remarks: zod.string().optional(),
            })
        ),
        defaultValues,
    });

    const { handleSubmit, formState, watch, setValue, setError } = methods;

    const selectedStateId = watch("state_id");
    const selectedDistrictId = watch("district_id");

    // Update districts when state_id changes
    useEffect(() => {
        if (selectedStateId && states) {
            const selectedState = states.find(
                (s) => String(s.state_id) === String(selectedStateId)
            );
            if (selectedState) {
                setDistricts(selectedState.districts || []);
            } else {
                setDistricts([]);
            }
        } else {
            setDistricts([]);
        }
        setValue("district_id", "");
    }, [selectedStateId, states, setValue]);

    // Update shipping charge when district_id changes
    useEffect(() => {
        const fetchLogisticCharge = async () => {
            if (selectedDistrictId) {
                try {
                    const charge = await getLogisticCharge(selectedDistrictId);
                    if (charge && typeof charge.charge_amount !== "undefined") {
                        setLogisticCharge(charge.charge_amount);
                    }
                } catch (error) {
                    console.error("Failed to fetch logistic charge:", error);
                    toast.error("Couldn't fetch shipping charge! Try again.");
                }
            } else {
                setLogisticCharge(0);
            }
        };
        fetchLogisticCharge();
    }, [selectedDistrictId]);

    // Calculate subtotal
    const calculateSubtotal = () => {
        if (mode === "buyNow" && buyNowProduct) {
            const { getLineTotal } = getBuyNowPricing(buyNowProduct, buyNowVariantId);

            return getLineTotal(buyNowQuantity);
        }

        if (mode === "cart" && cartItems) {
            return cartItems.reduce((total, item) => total + getCartItemTotal(item), 0);
        }

        return 0;
    };

    const subtotal = calculateSubtotal();

    const totalAmount = logisticCharge + subtotal;

    // Build order items based on mode
    const buildOrderItems = () => {
        if (mode === "buyNow" && buyNowProduct) {
            const { variant, orderUnitPrice } = getBuyNowPricing(buyNowProduct, buyNowVariantId);

            return [
                {
                    item_type: variant ? "ProductVariant" : "Product",
                    item_id: variant ? variant.variant_id : buyNowProduct.product_id,
                    quantity: buyNowQuantity,
                    price: orderUnitPrice,
                },
            ];
        }

        if (mode === "cart" && cartItems) {
            return cartItems.map((item) => ({
                item_type: item.variant_id ? "ProductVariant" : "Product",
                item_id: item.variant_id || item.product_id,
                quantity: parseInt(item.quantity),
                price: getOrderUnitPrice(getCartItemPricing(item)),
            }));
        }

        return [];
    };

    const clearCheckedOutCart = () => {
        if (mode === "cart") dispatch(resetCart());
    };

    const goToOrder = (orderId) => {
        router.push(orderId ? `/order/${orderId}` : "/order");
    };

    const handleOrderSuccess = async (orderData) => {
        onOrderStart?.();

        // Store user and token details in Redux to log the customer in
        dispatch(setUser(orderData));

        const orderId = orderData.order?.order_id || orderData.order_id;
        // redux-persist writes the new token to storage asynchronously, so pass it explicitly
        const token = orderData.token;

        // The quick order endpoint only saves the order — the gateway attempt is a
        // separate authenticated call. Re-check the vendor flags in case config changed.
        if (orderId && paymentMethod === "fonepay" && vendor?.has_fonepay_checkout) {
            try {
                const fonepayResponse = await initiateFonepayPayment(orderId, token);
                const data = fonepayResponse?.data;

                if (!data?.qr_message || !data?.prn) {
                    throw new Error("Couldn't get a Fonepay QR code.");
                }

                rememberFonepayAttempt({ orderId, prn: data.prn });

                // Keep the cart until the dialog closes: emptying it makes the checkout
                // view show "cart is empty" and unmount this form along with the dialog.
                setFonepayCheckout({
                    orderId,
                    prn: data.prn,
                    amount: data.amount,
                    qr_message: data.qr_message,
                    thirdparty_qr_websocket_url: data.thirdparty_qr_websocket_url,
                });
            } catch (fonepayError) {
                clearCheckedOutCart();
                toast.error(
                    fonepayError?.message ||
                    "Order saved, but the Fonepay QR couldn't be generated. You can retry payment from your order page."
                );
                goToOrder(orderId);
            }
            return;
        }

        if (orderId && paymentMethod === "esewa" && vendor?.has_esewa_checkout) {
            try {
                const esewaResponse = await initiateEsewaPayment(orderId, token);
                const { payment_url, payload: esewaPayload } = esewaResponse?.data || {};

                if (!payment_url || !esewaPayload) {
                    throw new Error("Couldn't start eSewa payment.");
                }

                rememberEsewaAttempt({
                    orderId,
                    transactionUuid: esewaPayload.transaction_uuid,
                });

                clearCheckedOutCart();
                toast.success("Order created! Redirecting to eSewa...");

                // Real browser form POST that navigates away — never fetch it as JSON
                submitEsewaCheckoutForm({ payment_url, payload: esewaPayload });
            } catch (esewaError) {
                clearCheckedOutCart();
                toast.error(
                    esewaError?.message ||
                    "Order saved, but eSewa payment couldn't start. You can retry payment from your order page."
                );
                goToOrder(orderId);
            }
            return;
        }

        clearCheckedOutCart();

        toast.success("Order placed successfully! You are now logged in.");
        setTimeout(() => goToOrder(orderId), 1500);
    };

    const handleFonepayDone = (isPaid) => () => {
        const orderId = fonepayCheckout?.orderId;
        setFonepayCheckout(null);
        clearCheckedOutCart();
        if (isPaid) toast.success("Payment successful!");
        // Closing doesn't cancel the attempt — it stays checkable from the order page
        goToOrder(orderId);
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            setErrorMessage("");

            const orderItems = buildOrderItems();
            if (orderItems.length === 0) {
                setErrorMessage("No items to checkout");
                return;
            }

            const orderData = {
                customer_name: data.customer_name,
                customer_email: data.customer_email,
                customer_contact_info: data.customer_contact_info,
                password: data.password || undefined,
                state_id: parseInt(data.state_id),
                district_id: parseInt(data.district_id),
                address: data.address,
                order_items: orderItems,
                logistic_charge: logisticCharge,
                // Code-only discounts apply only when their code is submitted; the server validates it
                discount_code: data.discount_code?.trim().toUpperCase() || undefined,
                remarks: data.remarks || undefined,
            };

            const res = await submitQuickOrder(orderData);

            if (res.success) {
                if (res.data.requires_otp) {
                    setUserEmail(res.data.email);
                    setOrderPreview(res.data.order_preview);
                    setOtpExpiryMinutes(res.data.expires_in_minutes || 5);
                    setOtpDialogOpen(true);
                    toast.success("OTP sent to your email!");
                } else {
                    await handleOrderSuccess(res.data);
                }
            }
        } catch (err) {
            console.error("Order submission error:", err);
            if (err?.status === 422 && err?.data && typeof err.data === "object") {
                const validationErrors = err.data;
                const generalMessages = [];
                Object.keys(validationErrors).forEach((field) => {
                    const messages = [validationErrors[field]].flat();
                    if (!messages.length) return;
                    // Errors for fields not in this form (e.g. stock) have nowhere to render inline
                    if (field in defaultValues) {
                        setError(field, { type: "server", message: messages[0] });
                    } else {
                        generalMessages.push(...messages);
                    }
                });
                setErrorMessage(
                    generalMessages.length
                        ? generalMessages.join(" ")
                        : "Validation failed. Please check the errors below."
                );
            } else if (err?.message && typeof err.message === "string") {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("Something went wrong");
            }
        }
    });

    const handleVerifyOtp = async (otp) => {
        try {
            setIsVerifying(true);
            setOtpError("");

            if (!orderPreview) {
                setOtpError("Order data not found. Please try again.");
                return;
            }

            const verifyData = {
                email: userEmail,
                otp_code: otp,
                ...orderPreview,
            };

            const response = await verifyOtpAndCreateOrder(verifyData);

            if (response.success) {
                setOtpDialogOpen(false);
                await handleOrderSuccess(response.data);
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            if (error?.message && typeof error.message === "string") {
                setOtpError(error.message);
            } else {
                setOtpError("Invalid OTP. Please try again.");
            }
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <>
            {/* LOGIN INFO */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-center text-sm">
                Already have account?{" "}
                <RouterLink
                    href={signInHref}
                    style={{
                        color: primaryColor,
                    }}
                    className="font-semibold hover:underline"
                >
                    Login here
                </RouterLink>
            </div>

            {/* MAIN CARD */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Delivery & Payment Details
                    </h2>

                    <Form methods={methods} onSubmit={onSubmit}>
                        <div className="space-y-6">
                            {errorMessage && (
                                <div className="rounded-lg bg-red-50 p-2 text-sm text-red-600">
                                    {errorMessage}
                                </div>
                            )}

                            {/* CUSTOMER */}
                            <div>
                                <h3 className="mb-3 font-medium text-gray-800">
                                    Customer Info
                                </h3>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <Field.Text name="customer_name" label="Full Name" />
                                    <Field.Text name="customer_contact_info" label="Phone" />
                                    <Field.Text name="customer_email" label="Email" />

                                    <div className="relative">
                                        <Field.Text
                                            name="password"
                                            label="Password (required for new customers)"
                                            type={showPassword ? "text" : "password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-9 text-sm text-gray-500"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ADDRESS */}
                            <div>
                                <h3 className="mb-3 font-medium text-gray-800">
                                    Delivery Address
                                </h3>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <Field.Select name="state_id" label="State">
                                        <option value="">Select State</option>
                                        {states?.map((s) => (
                                            <option key={s.state_id} value={s.state_id}>
                                                {s.state_name}
                                            </option>
                                        ))}
                                    </Field.Select>

                                    <Field.Select name="district_id" label="District">
                                        <option value="">Select District</option>
                                        {districts?.map((d) => (
                                            <option key={d.district_id} value={d.district_id}>
                                                {d.district_name}
                                            </option>
                                        ))}
                                    </Field.Select>
                                </div>

                                <div className="mt-3">
                                    <Field.Text
                                        name="address"
                                        label="Full Address"
                                        multiline
                                        rows={3}
                                    />
                                </div>

                                <div className="mt-3">
                                    <Field.Text
                                        name="discount_code"
                                        label="Discount code (optional)"
                                        helperText="Validated and applied when your order is placed."
                                        onChange={(e) =>
                                            setValue("discount_code", e.target.value.toUpperCase())
                                        }
                                    />
                                </div>
                            </div>

                            {/* PAYMENT */}
                            <PaymentMethodSelector
                                value={paymentMethod}
                                onChange={setPaymentMethod}
                                vendor={vendor}
                            />

                            {/* SUMMARY */}
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 gap-3">
                                <h3 className="mb-3 font-medium text-gray-800">
                                    Order Summary
                                </h3>

                                <div className="flex justify-between text-sm mb-3">
                                    <span>Subtotal</span>
                                    <span>{fCurrency(subtotal)}</span>
                                </div>

                                <div className="flex justify-between text-sm mb-1">
                                    <span>Shipping</span>
                                    <span>{logisticCharge ? fCurrency(logisticCharge) : "Free"}</span>
                                </div>

                                <div className="my-2 border-t" />

                                <div className="flex justify-between font-semibold" style={{ color: primaryColor }}>
                                    <span>Total</span>
                                    <span>{fCurrency(totalAmount)}</span>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={formState.isSubmitting}
                                    style={{ backgroundColor: primaryColor }}
                                    className="rounded-xl px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                                >
                                    {getSubmitLabel(paymentMethod, formState.isSubmitting)}
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            {/* FONEPAY QR */}
            <FonepayQrDialog
                open={Boolean(fonepayCheckout)}
                orderId={fonepayCheckout?.orderId}
                initialData={fonepayCheckout}
                onClose={handleFonepayDone(false)}
                onSuccess={handleFonepayDone(true)}
            />

            {/* OTP */}
            <OtpVerificationDialog
                open={otpDialogOpen}
                onClose={() => setOtpDialogOpen(false)}
                email={userEmail}
                onVerify={handleVerifyOtp}
                isVerifying={isVerifying}
                error={otpError}
            />
        </>
    );
}