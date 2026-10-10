
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { fCurrency } from "@/utils/format-number";
import { getErrorMessage } from "@/utils/error-message";
import { getProductPricing, getCartPriceFields } from "@/utils/product-pricing";

import { CONFIG } from "@/global-config";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addToCart,
  addToWishlist,
  removeWishlistItem,
  getCartDataRequest,
} from "@/redux/actions";

import { Iconify } from "@/components/iconify";
import { NumberInput } from "@/components/number-input";
import { toast } from "@/components/snackbar";

import {
  addProductToCart,
  addProductToWishlist,
  removeProductFromWishlist,
} from "@/api";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

export function ProductDetailsSummary({
  product,
  carousel,
  carouselImages = [],
  onOpenChat = () => { },
  isQuickOrder = false,
  selectedVariant: controlledVariant,
  onVariantChange,
  ...other
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isLogin } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { vendor } = useAppSelector((state) => state.vendor);

  // Vendor primary color used inline where Tailwind can't handle dynamic values
  const primaryColor = vendor?.primary_color || null;

  const [quantity, setQuantity] = useState(1);
  const [internalVariant, setInternalVariant] = useState();

  // Support both controlled (from parent via onVariantChange) and uncontrolled
  const selectedVariant = controlledVariant !== undefined ? controlledVariant : internalVariant;
  const setSelectedVariant = (v) => {
    setInternalVariant(v);
    onVariantChange?.(v);
  };

  const {
    product_id,
    name,
    slug,
    brand,
    categories,
    variants,
    featured_image,
    is_out_of_stock,
  } = product || {};

  const isOutOfStock = !!is_out_of_stock;

  const hasVariant = variants?.length > 0;

  const pricing = getProductPricing(
    product,
    hasVariant ? (selectedVariant ?? variants[0]) : undefined
  );

  const productInWishlist = wishlistItems?.find(
    (wishlistItem) => wishlistItem.product_id == product_id
  );

  useEffect(() => {
    if (hasVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [hasVariant]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleRemoveFromWishlist = async () => {
    try {
      await removeProductFromWishlist(productInWishlist.wishlist_id);
      dispatch(removeWishlistItem(productInWishlist.wishlist_id));
      toast.success("Product removed from wishlist!");
    } catch {
      toast.error("Couldn't remove product! Try again.");
    }
  };

  const handleAddToWishlist = async () => {
    const newProduct = { product_id };
    if (hasVariant) {
      newProduct.variant_id = selectedVariant?.variant_id ?? variants[0].variant_id;
    }
    try {
      const response = await addProductToWishlist(newProduct);
      dispatch(addToWishlist(response[0]));
      toast.success("Product added to wishlist!");
    } catch {
      toast.error("Couldn't add to wishlist! Try again.");
    }
  };

  const handleAddToCart = async () => {
    let newProduct = { product_id, quantity };
    if (hasVariant) {
      newProduct.variant_id = selectedVariant?.variant_id ?? variants[0].variant_id;
    }
    try {
      if (isLogin) {
        await addProductToCart([newProduct]);
        dispatch(getCartDataRequest());
      } else {
        const variantImage = selectedVariant?.image || featured_image;
        const variantName = selectedVariant?.variant_name;
        newProduct = {
          ...newProduct,
          cart_id: items.length + 1,
          product_name: name,
          item_name: variantName ? `${name} - ${variantName}` : name,
          featured_image: variantImage,
          item_image: variantImage,
          variant_name: variantName,
          slug,
          ...getCartPriceFields(pricing),
        };
        dispatch(addToCart(newProduct));
      }
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("[ADD TO CART] Error:", error);
      toast.error(getErrorMessage(error, "Couldn't add product to cart! Try again"));
    }
  };

  const handleBuyNow = async () => {
    if (!isLogin) {
      const variantId = hasVariant
        ? (selectedVariant?.variant_id ?? variants[0]?.variant_id)
        : null;
      const variantParam = variantId ? `&variantId=${variantId}` : "";
      router.push(`${paths.checkout}?buyNow=true&productSlug=${slug}&quantity=1${variantParam}`);
      return;
    }
    let newProduct = { product_id, quantity: 1 };
    if (hasVariant) {
      newProduct.variant_id = selectedVariant?.variant_id ?? variants[0].variant_id;
    }
    try {
      await addProductToCart([newProduct]);
      dispatch(getCartDataRequest());
      toast.success("Product added to cart!");
      router.push(paths.cart);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't add product to cart! Try again"));
    }
  };

  // ── Render helpers ───────────────────────────────────────────────────────────

  const renderRating = () => (
    <div className="flex items-center gap-1 text-sm text-gray-400">
      {/* Star rating — 5 filled stars */}
      <div className="flex items-center mr-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-4 h-4 text-yellow-400 fill-yellow-400"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      (5 reviews)
    </div>
  );

  const renderPrice = () => (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
        {pricing.hasDiscount && (
          <span className="text-gray-400 line-through">{fCurrency(pricing.originalPrice)}</span>
        )}
        <span>{fCurrency(pricing.finalPrice)}</span>
      </div>

      {pricing.isAutomatic && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
          <Iconify icon="solar:tag-price-bold" width={14} />
          {pricing.activeDiscount?.type === "fixed"
            ? `${fCurrency(pricing.discountAmount)} off`
            : `${pricing.discountPercentage}% off`}
        </span>
      )}
    </div>
  );

  const renderQuantity = () => {
    if (isQuickOrder || isOutOfStock) return null;
    return (
      <div className="flex items-center">
        <span className="flex-1 text-[0.875rem] font-bold text-gray-800">
          Quantity
        </span>
        <div>
          <NumberInput
            hideDivider
            value={quantity}
            onChange={(event, qty) => setQuantity(qty)}
            min={1}
            max={100}
            sx={{ maxWidth: 112 }}
          />
        </div>
      </div>
    );
  };

  const renderBrand = () => (
    <div className="flex items-center">
      <span className="flex-1 text-[0.875rem] text-gray-700">Brand</span>
      <div className="flex  items-center gap-1">
        <span className="text-[0.8rem] font-bold text-gray-900">
          {brand?.brand_name}
        </span>
        <img
          alt={brand?.brand_name}
          title={brand?.brand_name}
          src={brand?.brand_image}
          className="w-12 h-12 shadow-lg border-gray-300 border-[2px] rounded-full object-cover"
        />
      </div>
    </div>
  );

  const renderCategory = () => {
    if (!categories || categories.length === 0) return null;
    return (
      <div className="flex items-center justify-between gap-4">
        <span className="flex-shrink-0 text-[0.875rem] text-gray-700">
          Categories
        </span>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {categories.map((cat) => (
            <div
              key={cat.category_id}
              className="flex  items-center justify-center gap-1"
            >
              {/* Tooltip via title attribute — lightweight replacement */}
              <span className="text-[0.8rem] text-gray-900 font-bold">
                {cat?.category_name}
              </span>

              <img
                alt={cat?.category_name}
                title={cat?.category_name}
                src={cat?.web_image}
                className="w-12 h-12 shadow-lg border-gray-300 border-[2px] rounded-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVariants = () => {
    if (!hasVariant) return null;
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-800">
          Variant: {selectedVariant?.variant_name}
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          {variants.map((variant) => {
            const isActive = selectedVariant?.variant_id === variant.variant_id;
            return (
              <img
                key={variant.variant_id}
                alt={variant.variant_name}
                src={variant.image}
                title={variant.variant_name}
                onClick={() => {
                  const slideIndex = carouselImages.findIndex(
                    (img) => img.id === variant.variant_id
                  );
                  if (slideIndex !== -1) carousel.thumbs.onClickThumb(slideIndex);
                  setSelectedVariant(variant);
                }}
                className={`w-12 h-12 rounded-full object-cover cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all ${isActive
                    ? "ring-2 ring-offset-2 ring-primary scale-110"
                    : "hover:ring-2 hover:ring-secondary opacity-70 hover:opacity-100"
                  }`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderChatAction = () => {
    if (isQuickOrder) return null;
    return (
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            Need more info?
          </span>
          <span className="text-xs text-gray-500">
            Chat with the product supplier
          </span>
        </div>
        <button
          onClick={(event) => onOpenChat(event)}
          className="ml-4 rounded-md border border-gray-300 px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          Chat now
        </button>
      </div>
    );
  };

  const renderActions = () => {
    if (isQuickOrder) return null;
    return (
      <div className="flex gap-3">
        {/* Wishlist button — only when logged in */}
        {isLogin && (
          <button
            onClick={productInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            <Iconify icon="solar:heart-bold" width={24} />
            {productInWishlist ? "Remove" : "Add to Wishlist"}
          </button>
        )}

        {isOutOfStock ? (
          <div className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 whitespace-nowrap">
            <Iconify icon="solar:box-minimalistic-bold" width={20} />
            Out of Stock
          </div>
        ) : (
          <>
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white whitespace-nowrap hover:opacity-90 transition-opacity"
              style={primaryColor ? { backgroundColor: primaryColor } : undefined}
            >
              <Iconify icon="solar:cart-plus-bold" width={24} />
              Add to Cart
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#000000]  px-4 py-2 text-sm font-semibold text-white whitespace-nowrap hover:opacity-90 transition-opacity"
            >
              <Iconify icon="solar:bolt-bold" width={16} />
              Buy Now
            </button>
          </>
        )}
      </div>
    );
  };

  // ── Root ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-2 pt-2" {...other}>
      {/* Name + rating + price */}
      <div className="flex flex-col gap-2 items-start">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 m-0">
          {name}
        </h1>
        {renderRating()}
        {renderPrice()}
      </div>

      <Divider />

      {renderBrand()}

      <Divider />

      {renderCategory()}

      <Divider />

      {renderVariants()}

      {hasVariant && <Divider />}

      {renderQuantity()}

      {!isQuickOrder && <Divider />}

      {renderChatAction()}

      {!isQuickOrder && <Divider />}

      {renderActions()}
    </div>
  );
}

// ── Dashed divider ────────────────────────────────────────────────────────────
function Divider() {
  return <hr className="border-t border-dashed border-gray-200 my-0 py-0" />;
}