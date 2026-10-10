import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";

import { useAppSelector } from "@/redux/hooks";
import { selectAuthState, selectWishlistState } from "@/redux/selectors";

import { fCurrency } from "@/utils/format-number";
import { getItemNames, getItemIds, fixImageUrl } from "@/utils/item-display";
import { getCartItemPricing } from "@/utils/product-pricing";

import { Iconify } from "@/components/iconify";
import { NumberInput } from "@/components/number-input";

// ----------------------------------------------------------------------

export function CartProduct({
  row,
  onDeleteCartItem,
  onChangeItemQuantity,
  onMoveToWishlist,
}) {
  const { isLogin } = useAppSelector(selectAuthState);

  const { items: wishlistItems } = useAppSelector(selectWishlistState);

  // console.log("Cart row data:", row);

  const {
    cart_id,
    slug,
    featured_image,
    item_image,
    quantity,
    is_flash_sale,
    flash_sale_remaining_qty,
  } = row;

  const { productId, variantId } = getItemIds(row);
  const { productName, variantName } = getItemNames(row);
  const productSlug = slug || row.product?.slug || row.itemable?.product?.slug;

  const productImage = fixImageUrl(item_image || featured_image);

  const pricing = getCartItemPricing(row);
  const lineTotal = pricing.getLineTotal(quantity);
  // An automatic discount beats the flash price when lower; badges follow the winner
  const isFlashSale = Boolean(is_flash_sale) && !pricing.isAutomatic;
  const flashSaleRemaining = Number(flash_sale_remaining_qty) || 0;

  const isProductInWishlist = wishlistItems?.some(
    (wishlistItem) =>
      wishlistItem.product_id == productId &&
      (wishlistItem.variant_id ?? null) == (variantId ?? null)
  );

  // console.log(
  //   "Cart Product - productId:",
  //   productId,
  //   "isProductInWishlist:",
  //   isProductInWishlist,
  //   "isLogin:",
  //   isLogin
  // );

  return (
    <tr className="border-b border-gray-200">
      {/* Product */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img
              src={productImage || undefined}
              alt={productName}
              title={productName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2>
                <RouterLink
                  href={paths.product.details(productSlug)}
                  className="max-w-[240px] text-sm font-semibold text-inherit no-underline hover:underline"
                >
                  {productName}
                </RouterLink>
              </h2>

              {pricing.isAutomatic && (
                <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                  <Iconify icon="solar:tag-price-bold" width={14} />
                  {pricing.activeDiscount?.type === "fixed"
                    ? `${fCurrency(pricing.activeDiscount.value)} off`
                    : `${pricing.discountPercentage}% off`}
                </div>
              )}

              {isFlashSale && (
                <div
                  className="
                    inline-flex items-center gap-1 rounded-full
                    bg-red-100 px-2 py-0.5 text-[11px]
                    font-medium text-red-600
                  "
                >
                  <Iconify
                    icon="solar:fire-bold"
                    width={16}
                  />
                  Flash Sale
                </div>
              )}
            </div>

            {variantName && (
              <span className="text-xs text-gray-500">
                Variant: <span className="font-medium text-gray-700">{variantName}</span>
              </span>
            )}

            {isFlashSale && flashSaleRemaining > 0 && (
              <div className="flex items-center gap-1 text-xs text-amber-700">
                <Iconify
                  icon="solar:clock-circle-bold"
                  width={14}
                />
                {flashSaleRemaining} left at this price
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-4">
        <div className="flex flex-col items-start gap-1">
          {pricing.hasDiscount ? (
            <>
              <span className="text-xs text-gray-400 line-through">
                {fCurrency(pricing.originalPrice)}
              </span>

              <span className="text-sm font-bold text-red-600">
                {fCurrency(pricing.finalPrice)}
              </span>

              <span className="text-xs font-semibold text-green-600">
                Save {fCurrency(pricing.discountAmount)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold">
              {fCurrency(pricing.finalPrice)}
            </span>
          )}
        </div>
      </td>

      {/* Quantity */}
      <td className="px-4 py-4">
        <div className="w-[140px] text-right">
          <NumberInput
            hideDivider
            value={Number(quantity)}
            onChange={(event, quantity) =>
              onChangeItemQuantity(cart_id, quantity)
            }
            min={1}
          />
        </div>
      </td>

      {/* Total */}
      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold">
        {fCurrency(lineTotal)}
      </td>

      {/* Actions */}
      <td className="px-2 py-4">
        <div className="flex items-center justify-end gap-2">
          {isLogin && !isProductInWishlist && (
            <button
              type="button"
              onClick={() => onMoveToWishlist(row)}
              className="
                whitespace-nowrap rounded-md border border-gray-300
                px-3 py-1.5 text-sm font-medium
                transition hover:bg-gray-100
              "
            >
              To Wishlist
            </button>
          )}

          <button
            type="button"
            onClick={() => onDeleteCartItem(cart_id)}
            className="
              inline-flex h-10 w-10 items-center justify-center
              rounded-full text-red-600 transition
              hover:bg-red-50
            "
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </button>
        </div>
      </td>
    </tr>
  );
}