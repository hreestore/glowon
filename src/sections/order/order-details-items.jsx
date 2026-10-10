
"use client";

import { Scrollbar } from "@/components/scrollbar";
import { Iconify } from "@/components/iconify";
import { fCurrency } from "@/utils/format-number";
import { getItemNames, fixImageUrl } from "@/utils/item-display";

export function OrderDetailsItems({
  original_total_amount,
  taxDetails,
  shipping,
  discount,
  discountDetails,
  subtotal,
  items = [],
  totalAmount,
  className = "",
  ...other
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
      {...other}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h3 className="text-base font-semibold text-gray-800">Details</h3>
      </div>

      {/* Items */}
      <div className="max-h-[400px] overflow-y-auto">
        <Scrollbar>
          {items?.map((item) => {
            const itemTotal = Number(item.unit_price || item.price || 0);

            let displayAmount = itemTotal;
            if (taxDetails?.price_includes_tax && taxDetails?.percentage) {
              displayAmount = itemTotal / (1 + taxDetails.percentage / 100);
            }

            const { productName, variantName } = getItemNames(item);

            return (
              <div
                key={item.order_item_id}
                className="flex items-center gap-3 px-4 py-3 border-b border-dashed border-gray-200 min-w-[640px]"
              >
                {/* Image */}
                <img
                  src={fixImageUrl(item.item_image)}
                  alt={productName}
                  className="w-12 h-12 rounded-md object-cover"
                />

                {/* Name */}
                <div className="flex-1">
                  <div className="text-sm text-gray-700">{productName}</div>
                  {variantName && (
                    <div className="text-xs text-gray-500">
                      Variant: <span className="font-medium text-gray-700">{variantName}</span>
                    </div>
                  )}
                </div>

                {/* Qty */}
                <div className="text-sm text-gray-600">
                  x{item.quantity}
                </div>

                {/* Price */}
                <div className="w-[110px] text-right font-semibold text-gray-800">
                  {fCurrency(displayAmount)}
                </div>
              </div>
            );
          })}
        </Scrollbar>
      </div>

      {/* Totals */}
      <div className="p-4 space-y-3 text-sm text-right">
        {/* Subtotal */}
        {/* <div className="flex justify-end">
          <span className="text-gray-500 w-32 text-left">Subtotal</span>
          <span className="w-40 font-medium text-gray-800 text-right">
            {fCurrency(subtotal) || "-"}
          </span>
        </div> */}

        {/* Tax */}
        <div className="flex justify-end">
          <span className="text-gray-500 w-32 text-left">
            {taxDetails?.tax_name || "VAT"}
            {taxDetails?.percentage && ` (${taxDetails.percentage}%)`}
            {taxDetails?.price_includes_tax ? " (Included)" : ""}
          </span>

          <span
            className={`w-40 text-right ${(taxDetails?.tax_amount || 0) > 0
              ? "text-green-600"
              : "text-gray-400"
              }`}
          >
            {(taxDetails?.tax_amount || 0) > 0
              ? `+ ${fCurrency(taxDetails.tax_amount)}`
              : "-"}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-end">
          <span className="text-gray-500 w-32 text-left">Shipping</span>
          <span
            className={`w-40 text-right ${shipping > 0 ? "text-green-600" : "text-gray-400"
              }`}
          >
            {shipping > 0 ? `+ ${fCurrency(shipping)}` : "-"}
          </span>
        </div>

        {/* Discount */}
        <div className="flex justify-end">
          <span className="text-gray-500 w-32 text-left">Discount</span>
          <span
            className={`w-40 text-right ${discount > 0 ? "text-red-500" : "text-gray-400"
              }`}
          >
            {discount > 0 ? `- ${fCurrency(discount)}` : "-"}
          </span>
        </div>

        {/* Discount Details */}
        {discountDetails && discount > 0 && (
          <div className="p-3 rounded-lg border border-dashed border-green-500 bg-green-50 text-left">
            <div className="flex items-center gap-2">
              <Iconify
                icon="solar:ticket-sale-bold"
                className="text-green-600"
              />

              <span className="font-semibold text-green-700 text-sm">
                {discountDetails.discount_code}
              </span>

              <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded">
                {discountDetails.discount_type === "percentage"
                  ? `${discountDetails.discount_value}% OFF`
                  : `${fCurrency(discountDetails.discount_value)} OFF`}
              </span>
            </div>

            {discountDetails.description && (
              <p className="text-xs text-gray-500 mt-1 pl-6">
                {discountDetails.description}
              </p>
            )}

            <p className="text-xs text-green-700 font-medium mt-1 pl-6">
              Applied to:{" "}
              {discountDetails.applies_to === "all"
                ? "All items"
                : discountDetails.applies_to === "category"
                  ? "Category items"
                  : "Specific product"}
            </p>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-end pt-2 border-t">
          <span className="w-32 text-left font-semibold text-gray-800">
            Total
          </span>
          <span className="w-40 font-bold text-gray-900">
            {fCurrency(totalAmount) || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}