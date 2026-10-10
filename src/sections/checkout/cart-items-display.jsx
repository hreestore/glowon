
"use client";

import { Image } from "@/components/image";
import { fCurrency } from "@/utils/format-number";

import { getItemNames, fixImageUrl } from "@/utils/item-display";
import { getCartItemPricing, getCartItemTotal } from "@/utils/product-pricing";

// ----------------------------------------------------------------------

export function CartItemsDisplay({ items }) {
    if (!items || items.length === 0) return null;

    const subtotal = items.reduce((total, item) => total + getCartItemTotal(item), 0);

    return (
        <div className="rounded-xl bg-white shadow-md border border-gray-100">
            <div className="p-5 space-y-4">

                {/* ITEMS */}
                <div className="space-y-4">

                    {items.map((item, index) => {
                        const { productName, variantName } = getItemNames(item);
                        const pricing = getCartItemPricing(item);
                        return (
                        <div key={item.cart_id || index}>

                            <div className="flex items-center gap-4">

                                {/* IMAGE */}
                                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        alt={productName}
                                        src={fixImageUrl(item.item_image || item.featured_image) || "/assets/placeholder.png"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* INFO */}
                                <div className="flex-1">

                                    <h3 className="text-sm font-semibold text-gray-900">
                                        {productName}
                                    </h3>

                                    {variantName && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Variant: {variantName}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 mt-1">

                                        <span className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </span>

                                        <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                            {pricing.hasDiscount && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    {fCurrency(pricing.originalPrice)}
                                                </span>
                                            )}
                                            {fCurrency(pricing.finalPrice)}
                                        </span>

                                    </div>
                                </div>

                                {/* TOTAL */}
                                <div className="text-sm font-bold text-blue-600 whitespace-nowrap">
                                    {fCurrency(pricing.getLineTotal(item.quantity))}
                                </div>

                            </div>

                            {/* DIVIDER */}
                            {index < items.length - 1 && (
                                <div className="border-t border-gray-200 mt-4" />
                            )}

                        </div>
                        );
                    })}

                </div>

                {/* FINAL DIVIDER */}
                <div className="border-t border-gray-200" />

                {/* SUBTOTAL */}
                <div className="flex items-center justify-between pt-1">
                    <span className="text-base font-semibold text-gray-900">
                        Cart Subtotal:
                    </span>

                    <span className="text-lg font-bold text-blue-600">
                        {fCurrency(subtotal)}
                    </span>
                </div>

            </div>
        </div>
    );
}