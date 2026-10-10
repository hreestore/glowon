
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart, addToWishlist, removeWishlistItem, getCartDataRequest } from "@/redux/actions";

import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";

import { fCurrency } from "@/utils/format-number";
import { getErrorMessage } from "@/utils/error-message";
import { getProductPricing, getCartPriceFields } from "@/utils/product-pricing";

import { Image } from "@/components/image";
import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";

import {
  addProductToCart,
  addProductToWishlist,
  removeProductFromWishlist,
} from "@/api";

// ----------------------------------------------------------------------

export function ProductItem({ product, detailsHref, isTrending = false }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isLogin } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { vendor } = useAppSelector((state) => state.vendor);

  const primaryColor = vendor?.primary_color || "#6366f1"; // fallback indigo

  const {
    product_id,
    name,
    slug,
    featured_image,
    is_active,
    variants,
  } = product;

  // Only active variants can be ordered; the card flips to let the user pick one
  const activeVariants = variants?.filter((variant) => variant.is_active !== false) ?? [];
  const hasVariants = !!variants?.length;
  const hasActiveVariants = activeVariants.length > 0;
  const firstAvailableVariant =
    activeVariants.find((variant) => !variant.is_out_of_stock) ?? activeVariants[0];

  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(firstAvailableVariant);

  // Card shows the first orderable variant; the picker shows the selected one
  const cardPricing = getProductPricing(product, hasActiveVariants ? firstAvailableVariant : undefined);
  const selectedPricing = getProductPricing(product, hasActiveVariants ? selectedVariant : undefined);

  const canOrderSelected =
    !hasActiveVariants || (selectedVariant && !selectedVariant.is_out_of_stock);
  const isUnavailable = hasVariants && !hasActiveVariants;
  // Out of stock when flagged, or when every orderable variant is out of stock
  const isProductOutOfStock =
    !!product.is_out_of_stock ||
    (hasActiveVariants && activeVariants.every((variant) => variant.is_out_of_stock));

  const productInWishlist = wishlistItems?.find(
    (wishlistItem) => wishlistItem.product_id == product_id
  );

  const handleRemoveFromWishlist = async () => {
    try {
      await removeProductFromWishlist(productInWishlist.wishlist_id);
      dispatch(removeWishlistItem(productInWishlist.wishlist_id));
      toast.success("Product removed from wishli  st!");
    } catch (error) {
      toast.error("Couldn't remove product! Try again.");
    }
  };

  const handleAddToWishlist = async () => {
    const newProduct = { product_id };
    if (hasActiveVariants) newProduct.variant_id = firstAvailableVariant.variant_id;
    try {
      const response = await addProductToWishlist(newProduct);
      dispatch(addToWishlist(response[0]));
      toast.success("Product added to wishlist!");
    } catch (error) {
      toast.error("Couldn't add to wishlist! Try again.");
    }
  };

  const handleAddToCart = async () => {
    let newProduct = { product_id, quantity: 1 };
    if (hasActiveVariants) newProduct.variant_id = selectedVariant.variant_id;
    try {
      if (isLogin) {
        await addProductToCart([newProduct]);
        dispatch(getCartDataRequest());
      } else {
        const variantName = hasActiveVariants ? selectedVariant.variant_name : "";
        const itemImage = (hasActiveVariants && selectedVariant.image) || featured_image;
        newProduct = {
          ...newProduct,
          cart_id: items.length + 1,
          product_name: name,
          item_name: variantName ? `${name} - ${variantName}` : name,
          variant_name: variantName,
          featured_image: itemImage,
          item_image: itemImage,
          slug,
          ...getCartPriceFields(selectedPricing),
        };
        dispatch(addToCart(newProduct));
      }
      toast.success("Product added to cart!");
      setIsFlipped(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't add product to cart! Try again"));
    }
  };

  const handleBuyNow = async () => {
    if (!isLogin) {
      const variantParam = hasActiveVariants ? `&variantId=${selectedVariant.variant_id}` : "";
      router.push(`${paths.checkout}?buyNow=true&productSlug=${slug}&quantity=1${variantParam}`);
      return;
    }
    let newProduct = { product_id, quantity: 1 };
    if (hasActiveVariants) newProduct.variant_id = selectedVariant.variant_id;
    try {
      await addProductToCart([newProduct]);
      dispatch(getCartDataRequest());
      toast.success("Product added to cart!");
      router.push(paths.cart);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't add product to cart! Try again"));
    }
  };

  // Variant products open the picker on the back of the card instead of ordering directly
  const handleFrontAction = (action) => () => {
    if (hasActiveVariants) {
      setIsFlipped(true);
      return;
    }
    action();
  };

  // Strike the original only when a discount actually lowers the payable price
  const renderPrice = (pricing) => (
    <>
      {pricing.hasDiscount && (
        <span className="text-gray-400 line-through">{fCurrency(pricing.originalPrice)}</span>
      )}
      <span>{fCurrency(pricing.finalPrice)}</span>
    </>
  );

  const renderImage = () => {
    const imageUrl = featured_image
      ? featured_image.startsWith("http")
        ? featured_image
        : `${process.env.NEXT_PUBLIC_API_URL}/${featured_image.replace(/^\/+/, "")}`
      : "/assets/placeholder.png";

    return (
      <RouterLink
        href={detailsHref}
        className="relative block bg-gray-50 overflow-hidden group"
      >
        {/* Trending Badge */}
        {/* {isTrending && (
          <span className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-red-500 text-white text-[0.65rem] font-semibold px-2 py-0.5 rounded-full">
            <Iconify icon="solar:fire-bold" width={12} />
            Trending
          </span>
        )} */}

        {/* Sale Badge */}
        {cardPricing.hasDiscount && cardPricing.discountPercentage > 0 && (
          <span
            className="absolute top-2 right-2 z-10 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: primaryColor }}
          >
            -{cardPricing.discountPercentage}%
          </span>
        )}

        <img
          alt={name}
          title={name}
          src={imageUrl}
          className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105 rounded-xl"
          onError={(e) => {
            e.currentTarget.src = "/assets/placeholder.png";
          }}
        />
      </RouterLink>
    );
  };
  const renderContent = () => (
    <div className="flex flex-col flex-grow py-2.5 gap-2">
      {/* Product Name */}
      <RouterLink
        href={detailsHref}
        title={name}
        className="text-sm font-semibold text-gray-800 truncate hover:text-[var(--primary-color)] transition-colors duration-200"
        style={{ "--primary-color": primaryColor }}
      >
        {name}
      </RouterLink>

      {/* Price + Wishlist row */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-1 text-sm font-semibold"
          style={{ color: primaryColor }}
        >
          {renderPrice(cardPricing)}
        </div>

        {/* Wishlist — hidden on small screens */}
        {isLogin && (
          <button
            onClick={productInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
            className="hidden sm:flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: primaryColor }}
          >
            <Iconify
              icon={`solar:heart-${productInWishlist ? "bold" : "outline"}`}
              width={18}
            />
          </button>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex gap-1.5">
          {isProductOutOfStock ? (
            <button
              type="button"
              disabled
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-gray-400 py-1.5 px-2 rounded-lg cursor-not-allowed"
            >
              <Iconify icon="solar:box-minimalistic-bold" width={15} />
              Out of Stock
            </button>
          ) : (
            /* Add to Cart */
            <button
              onClick={handleFrontAction(handleAddToCart)}
              disabled={isUnavailable}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white py-1.5 px-2 rounded-lg transition-shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
            >
              <Iconify icon="solar:cart-plus-bold" width={15} />
              <span className="sm:hidden">Cart</span>
              <span className="hidden sm:inline">Add to Cart</span>
            </button>
          )}

          {/* Wishlist icon — visible only on small screens */}
          {isLogin && (
            <button
              onClick={productInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
              className="sm:hidden flex items-center justify-center p-1.5 rounded-lg transition-colors"
              style={{
                color: primaryColor,
                backgroundColor: `${primaryColor}15`,
              }}
            >
              <Iconify
                icon={`solar:heart-${productInWishlist ? "bold" : "outline"}`}
                width={18}
              />
            </button>
          )}
        </div>

        {/* Buy Now */}
        {!isProductOutOfStock && (
          <button
            onClick={handleFrontAction(handleBuyNow)}
            disabled={isUnavailable}
            className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold py-1.5 px-2 rounded-lg border transition-colors hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: primaryColor,
              color: primaryColor,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${primaryColor}15`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Iconify icon="solar:bolt-bold" width={15} />
            Buy Now
          </button>
        )}
      </div>
    </div>
  );

  const renderVariantPicker = () => {
    const variantTypeName =
      activeVariants[0]?.variant_values?.[0]?.variant_type?.name || "Variant";

    return (
      <div className="flex h-full flex-col gap-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800" title={name}>
              {name}
            </p>
            <p className="text-xs text-gray-500">
              Select {variantTypeName.toLowerCase()}:{" "}
              <span className="font-medium text-gray-700">{selectedVariant?.variant_name}</span>
            </p>
          </div>

          <button
            type="button"
            aria-label="Close variant selection"
            onClick={() => setIsFlipped(false)}
            className="flex shrink-0 items-center justify-center rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <Iconify icon="mingcute:close-line" width={18} />
          </button>
        </div>

        {/* Variant options */}
        <div className="grid flex-1 auto-rows-min grid-cols-3 gap-2 overflow-y-auto p-1">
          {activeVariants.map((variant) => {
            const isSelected = selectedVariant?.variant_id === variant.variant_id;
            const isOutOfStock = !!variant.is_out_of_stock;

            return (
              <button
                key={variant.variant_id}
                type="button"
                disabled={isOutOfStock}
                onClick={() => setSelectedVariant(variant)}
                title={isOutOfStock ? `${variant.variant_name} - out of stock` : variant.variant_name}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${isSelected ? "" : "border-gray-200 hover:border-gray-400"
                  }`}
                style={isSelected ? { borderColor: primaryColor } : undefined}
              >
                <img
                  alt={variant.variant_name}
                  src={variant.image || featured_image || "/assets/placeholder.png"}
                  className="aspect-square w-full rounded-md object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/placeholder.png";
                  }}
                />
                <span
                  className={`w-full truncate text-[0.65rem] font-medium ${isOutOfStock ? "line-through" : ""
                    }`}
                >
                  {variant.variant_name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected price */}
        <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: primaryColor }}>
          {renderPrice(selectedPricing)}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canOrderSelected}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-white transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            <Iconify icon="solar:cart-plus-bold" width={15} />
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!canOrderSelected}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{ borderColor: primaryColor, color: primaryColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${primaryColor}15`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Iconify icon="solar:bolt-bold" width={15} />
            Buy Now
          </button>
        </div>
      </div>
    );
  };

  const faceClassName =
    "h-full flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 lg:p-3.5 backface-hidden";

  return (
    <div
      className="h-full perspective-[1200px]"
      style={{
        "--tw-shadow-color": `${primaryColor}3d`,
        "--primary-color": primaryColor
      }}
    >
      <div
        className={`relative h-full rounded-2xl transition-[transform,box-shadow] duration-500 transform-3d hover:shadow-lg ${isFlipped ? "rotate-y-180" : ""
          }`}
      >
        {/* Front */}
        <div className={faceClassName} inert={isFlipped}>
          {renderImage()}
          {renderContent()}
        </div>

        {/* Back — variant picker */}
        {hasActiveVariants && (
          <div className={`${faceClassName} absolute inset-0 rotate-y-180`} inert={!isFlipped}>
            {renderVariantPicker()}
          </div>
        )}
      </div>
    </div>
  );
}