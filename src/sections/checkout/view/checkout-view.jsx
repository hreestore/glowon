
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";

import { useAppSelector } from "@/redux/hooks";

import { BuyNowProductDisplay } from "../buy-now-product-display";
import { CartItemsDisplay } from "../cart-items-display";
import { QuickOrderForm } from "../quick-order-form";

// ----------------------------------------------------------------------

export function CheckoutView() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [checkoutMode, setCheckoutMode] = useState(null); // 'buyNow' | 'cart'
    const [buyNowProduct, setBuyNowProduct] = useState(null);
    const [buyNowQuantity, setBuyNowQuantity] = useState(1);
    const [buyNowVariantId, setBuyNowVariantId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Only access cart from Redux when in cart mode
    const { items: storeCartItems } = useAppSelector((state) => state.cart);

    // Placing an order logs the guest in, which refetches the (empty) server cart.
    // Freeze the items checkout started with so that doesn't bounce the user to
    // /cart or unmount the Fonepay QR dialog mid-payment.
    const [checkoutCartItems, setCheckoutCartItems] = useState(null);
    const isOrderStartedRef = useRef(false);
    const cartItems = checkoutCartItems ?? storeCartItems;

    useEffect(() => {
        if (isOrderStartedRef.current) return;

        const isBuyNow = searchParams.get("buyNow") === "true";
        const productSlug = searchParams.get("productSlug");
        const quantity = searchParams.get("quantity");

        if (isBuyNow && productSlug) {
            // Buy Now mode
            setCheckoutMode("buyNow");
            setBuyNowQuantity(parseInt(quantity) || 1);
            const variantId = searchParams.get("variantId");
            setBuyNowVariantId(variantId ? parseInt(variantId) : null);

            // Fetch product details
            fetchProductForBuyNow(productSlug);
        } else {
            // Cart checkout mode
            setCheckoutMode("cart");

            if (!cartItems || cartItems.length === 0) {
                setError("Your cart is empty");

                setTimeout(() => {
                    router.push(paths.cart);
                }, 2000);
            } else {
                setIsLoading(false);
            }
        }
    }, [searchParams, storeCartItems, router]);

    const handleOrderStart = () => {
        isOrderStartedRef.current = true;
        setCheckoutCartItems(storeCartItems);
    };

    const fetchProductForBuyNow = async (productSlug) => {
        try {
            setIsLoading(true);
            setError("");

            // Import product API function
            const { getProductDetails } = await import("@/api");

            const product = await getProductDetails(productSlug);

            if (product) {
                setBuyNowProduct(product);
            } else {
                setError("Product not found");

                setTimeout(() => {
                    router.push(paths.home);
                }, 2000);
            }
        } catch (err) {
            console.error("Error fetching product:", err);

            setError("Failed to load product. Redirecting...");

            setTimeout(() => {
                router.push(paths.home);
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuantityChange = (newQuantity) => {
        setBuyNowQuantity(newQuantity);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="py-20">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 text-center">
                    {/* Spinner */}
                    <div
                        className="
              h-10 w-10 animate-spin rounded-full
              border-4 border-gray-200 border-t-black
            "
                    />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading checkout...
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="py-20">
                <div className="mx-auto max-w-4xl px-4">
                    <div
                        className="
              rounded-xl border border-red-200
              bg-red-50 px-4 py-3
              text-sm text-red-700
            "
                    >
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="mx-auto max-w-5xl px-4">
                {/* Heading */}
                <h1 className="mb-8 text-3xl font-bold tracking-tight">
                    Checkout
                </h1>

                {/* Buy Now */}
                {checkoutMode === "buyNow" && buyNowProduct && (
                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-semibold">
                            Your Selected Item
                        </h2>

                        <BuyNowProductDisplay
                            product={buyNowProduct}
                            variantId={buyNowVariantId}
                            quantity={buyNowQuantity}
                            onQuantityChange={handleQuantityChange}
                        />
                    </div>
                )}

                {/* Cart Items */}
                {checkoutMode === "cart" &&
                    cartItems &&
                    cartItems.length > 0 && (
                        <div className="mb-8">
                            <h2 className="mb-4 text-xl font-semibold">
                                Your Cart Items ({cartItems.length})
                            </h2>

                            <CartItemsDisplay items={cartItems} />
                        </div>
                    )}

                {/* Checkout Form */}
                <QuickOrderForm
                    mode={checkoutMode}
                    buyNowProduct={buyNowProduct}
                    buyNowQuantity={buyNowQuantity}
                    buyNowVariantId={buyNowVariantId}
                    cartItems={cartItems}
                    onOrderStart={handleOrderStart}
                />
            </div>
        </div>
    );
}