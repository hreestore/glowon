
"use client";

import { NumberInput } from "@/components/number-input";
import { useAppSelector } from "@/redux/hooks";
import { fCurrency } from "@/utils/format-number";
import { getProductPricing, getOrderUnitPrice } from "@/utils/product-pricing";

// ----------------------------------------------------------------------

// Shared with QuickOrderForm so the shown price and the ordered price always match.
export function getBuyNowPricing(product, variantId) {
    const { variants } = product || {};

    const variant = variantId
        ? variants?.find(
            (v) => String(v.variant_id) === String(variantId) && v.is_active !== false
        )
        : null;

    const pricing = getProductPricing(product, variant ?? undefined);

    return {
        variant,
        regularPrice: pricing.originalPrice,
        isOnSale: pricing.hasDiscount,
        finalPrice: pricing.finalPrice,
        // Automatic discounts are applied by the server, so submit the normal price
        orderUnitPrice: getOrderUnitPrice(pricing),
        getLineTotal: pricing.getLineTotal,
    };
}

export function BuyNowProductDisplay({
    product,
    variantId,
    quantity,
    onQuantityChange,
}) {
    if (!product) return null;

    const { name, featured_image } = product;

    const { variant, regularPrice, isOnSale, finalPrice, getLineTotal } = getBuyNowPricing(product, variantId);

    const image = variant?.image || featured_image;

    const subtotal = getLineTotal(quantity);

    const { vendor } = useAppSelector((state) => state.vendor);

    const primaryColor = vendor?.primary_color || "#7C3AED";

    return (
        <div className="rounded-xl bg-white shadow-md border border-gray-100">
            <div className="p-5">

                <div className="flex flex-col gap-4">

                    {/* PRODUCT ROW */}
                    <div className="flex items-center gap-4">

                        {/* IMAGE */}
                        <div className="w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                alt={name}
                                title={name}
                                src={image || "/assets/placeholder.png"}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* INFO */}
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900">
                                {name}
                            </h3>

                            {variant?.variant_name && (
                                <p className="mt-1 text-sm text-gray-500">
                                    Variant:{" "}
                                    <span className="font-medium text-gray-700">
                                        {variant.variant_name}
                                    </span>
                                </p>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                                {isOnSale && (
                                    <span className="text-sm text-gray-400 line-through">
                                        {fCurrency(regularPrice)}
                                    </span>
                                )}

                                <span className="text-lg font-bold text-red-600">
                                    {fCurrency(finalPrice)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="border-t border-gray-200" />

                    {/* QUANTITY */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Quantity:
                        </span>

                        <div className="w-[120px]">
                            <NumberInput
                                value={quantity}
                                onChange={(event, value) =>
                                    onQuantityChange(value)
                                }
                                min={1}
                                max={100}
                            />
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="border-t border-gray-200" />

                    {/* SUBTOTAL */}
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-900">
                            Subtotal:
                        </span>

                        <span className="text-lg font-bold" style={{ color: primaryColor }}>
                            {fCurrency(subtotal)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
