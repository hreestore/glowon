
"use client";

import { useEffect, useState, useRef } from "react";

import { paths } from "@/routes/paths";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/actions";

import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";

import { addProductToCart, googleExchange } from "@/api";
import { consumeReturnTo } from "@/utils/return-to";

export function GoogleCallbackView() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { items } = useAppSelector((state) => state.cart);

    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState(null);
    const hasProcessedRef = useRef(false);

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const code = searchParams.get("code");
            const token = searchParams.get("token");
            const sessionKey = `google_oauth_processed_${code || token}`;

            if (
                typeof window !== "undefined" &&
                window.sessionStorage.getItem(sessionKey)
            ) {
                setIsProcessing(false);
                return;
            }

            if (hasProcessedRef.current) return;
            hasProcessedRef.current = true;

            if (typeof window !== "undefined" && (code || token)) {
                window.sessionStorage.setItem(sessionKey, "true");
            }

            try {
                const errorParam = searchParams.get("error");

                if (errorParam) {
                    const msg = decodeURIComponent(errorParam);
                    setError(msg);
                    toast.error(msg || "Google authentication failed.");
                    setIsProcessing(false);

                    setTimeout(() => router.push(paths.auth.signIn), 3000);
                    return;
                }

                const tokenParam = searchParams.get("token");
                const customerIdParam = searchParams.get("customer_id");
                const messageParam = searchParams.get("message");

                if (tokenParam) {
                    dispatch(
                        setUser({
                            customer: { id: customerIdParam },
                            token: tokenParam,
                            token_type: "Bearer",
                        })
                    );

                    if (items?.length > 0) {
                        try {
                            await addProductToCart(items, tokenParam);
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    toast.success(messageParam || "Successfully signed in with Google!");

                    const returnTo = consumeReturnTo();
                    setTimeout(() => router.push(returnTo || paths.home), 1500);
                    return;
                }

                if (!code) {
                    const msg = "No authorization code or token received";
                    setError(msg);
                    toast.error(msg);
                    setIsProcessing(false);

                    setTimeout(() => router.push(paths.auth.signIn), 3000);
                    return;
                }

                const response = await googleExchange(code);

                if (response.success && response.customer && response.token) {
                    dispatch(
                        setUser({
                            customer: response.customer,
                            token: response.token,
                            token_type: response.token_type,
                        })
                    );

                    if (items?.length > 0) {
                        try {
                            await addProductToCart(items, response.token);
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    toast.success(
                        response.message || "Successfully signed in with Google!"
                    );

                    // Customers without a phone number still go to profile to complete it
                    const returnTo = consumeReturnTo();
                    setTimeout(() => {
                        router.push(
                            response.customer.phone_number
                                ? returnTo || paths.home
                                : paths.profile.root
                        );
                    }, 1500);
                } else {
                    throw new Error("Invalid response from server");
                }
            } catch (err) {
                const msg =
                    err?.message || "Failed to complete Google sign-in";

                setError(msg);
                toast.error(msg);

                setIsProcessing(false);

                setTimeout(() => router.push(paths.auth.signIn), 3000);
            }
        };

        handleGoogleCallback();
    }, []);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
            {isProcessing && !error && (
                <>
                    {/* Spinner */}
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

                    <p className="text-lg text-gray-600">
                        Completing Google sign-in...
                    </p>
                </>
            )}

            {error && (
                <>
                    <Iconify
                        icon="eva:alert-circle-fill"
                        width={80}
                        className="text-red-500"
                    />

                    <h2 className="text-2xl font-semibold">
                        Authentication Failed
                    </h2>

                    <p className="text-gray-600">{error}</p>

                    <div className="mt-4 flex gap-3">
                        <RouterLink
                            href={paths.auth.signIn}
                            className="rounded-lg bg-black px-4 py-2 text-white"
                        >
                            Back to Sign In
                        </RouterLink>
                    </div>
                </>
            )}
        </div>
    );
}