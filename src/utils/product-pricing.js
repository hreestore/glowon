// Storefront price resolution for automatic selected-product discounts.
//
// The API exposes, on products, variants, flash-sale products and cart rows:
//   price            - original/base price (kept for compatibility)
//   original_price   - original/base price
//   discounted_price - payable price after the automatic discount
//   discount_amount  - automatic discount (only render a strike-through when > 0)
//   active_discount  - { id, code, type: "percentage" | "fixed", value }
//
// When an automatic discount and a flash sale both apply, the lower payable price
// wins — the two never stack. Fixed discounts apply once per line, not per unit.
// These values are for display only: checkout totals always come from the server.

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

// Variable products report a 0 base price, so only a positive price counts
const firstPositive = (...values) => {
  for (const value of values) {
    const number = toNumber(value);
    if (number !== null && number > 0) return number;
  }
  return null;
};

// First orderable variant, preferring one in stock
const getDefaultVariant = (product) => {
  const active = product?.variants?.filter((variant) => variant.is_active !== false) ?? [];
  return active.find((variant) => !variant.is_out_of_stock) ?? active[0];
};

const getAutomaticDiscount = (source) => {
  const discountAmount = toNumber(source?.discount_amount) ?? 0;
  const discountedPrice = toNumber(source?.discounted_price);

  if (discountAmount <= 0 || discountedPrice === null) return null;

  return {
    price: Math.max(0, discountedPrice),
    amount: discountAmount,
    discount: source?.active_discount ?? source?.automatic_discount ?? null,
  };
};

// Resolve unit pricing and line totals from an original price plus optional
// automatic-discount and flash-sale candidates.
const buildPricing = ({ original, automatic, flashPrice }) => {
  const originalPrice = Math.max(0, original ?? 0);

  const automaticPrice =
    automatic && originalPrice > 0 && automatic.price < originalPrice ? automatic.price : null;
  const salePrice =
    flashPrice !== null && flashPrice !== undefined && flashPrice < originalPrice
      ? flashPrice
      : null;

  // Lower payable price wins; on a tie prefer the flash sale (existing behaviour)
  const isAutomatic = automaticPrice !== null && (salePrice === null || automaticPrice < salePrice);
  const isFlashSale = salePrice !== null && !isAutomatic;

  const finalPrice = isAutomatic ? automaticPrice : isFlashSale ? salePrice : originalPrice;
  const discountAmount = originalPrice - finalPrice;

  const activeDiscount = isAutomatic ? automatic.discount : null;
  const isFixedAutomatic = isAutomatic && activeDiscount?.type === "fixed";

  const getLineTotal = (quantity = 1) => {
    const qty = Math.max(0, Number(quantity) || 0);
    if (!isFixedAutomatic) return finalPrice * qty;

    // A fixed discount is taken once from the line, never multiplied per unit
    const fixedValue = toNumber(activeDiscount.value) ?? discountAmount;
    return Math.max(0, originalPrice * qty - fixedValue);
  };

  return {
    originalPrice,
    finalPrice,
    discountAmount,
    hasDiscount: discountAmount > 0,
    isAutomatic,
    isFlashSale,
    activeDiscount,
    discountPercentage:
      originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0,
    getLineTotal,
  };
};

// ----------------------------------------------------------------------

/**
 * Pricing for a catalogue product, optionally for one of its variants.
 * Variants carry their own price fields and inherit the parent's selected-product
 * discount; the flash sale is a product-level price. Without a variant, a product
 * with no price of its own (variable product) is priced by its default variant.
 */
export function getProductPricing(product, selectedVariant) {
  const { price, selling_price, flash_sale_products } = product || {};

  const ownOriginal = firstPositive(product?.original_price, price);
  const variant =
    selectedVariant ?? (ownOriginal === null ? getDefaultVariant(product) : undefined);

  const productOriginal = firstPositive(ownOriginal, selling_price?.regularPrice) ?? 0;

  const original = variant
    ? firstPositive(variant.original_price, variant.price) ?? productOriginal
    : productOriginal;

  const automatic = getAutomaticDiscount(variant ?? product);

  const hasFlashSale = flash_sale_products && flash_sale_products.length > 0;
  const flashPrice = hasFlashSale ? toNumber(selling_price?.flashSalePrice) : null;

  return buildPricing({ original, automatic, flashPrice });
}

/**
 * Pricing for a flash-sale entry ({ product, flash_price }) from the home feed.
 */
export function getFlashSalePricing(item) {
  const { product, flash_price } = item || {};

  return buildPricing({
    original:
      firstPositive(product?.original_price, product?.price) ??
      getProductPricing(product).originalPrice,
    automatic: getAutomaticDiscount(product),
    flashPrice: toNumber(flash_price),
  });
}

/**
 * Pricing for a cart row. `regular_price` is the original for flash-sale rows and
 * `price` the flash price; `original_price` / `discounted_price` carry the
 * automatic discount.
 */
export function getCartItemPricing(item) {
  const original = firstPositive(item?.original_price, item?.regular_price, item?.price) ?? 0;
  const price = toNumber(item?.price);
  const automatic = getAutomaticDiscount(item);

  // A reduced `price` is a flash price when the row says so, or when there is no
  // automatic discount it could merely be mirroring
  const isReducedPrice = price !== null && price < (original ?? 0);
  const flashPrice = isReducedPrice && (item?.is_flash_sale || !automatic) ? price : null;

  return buildPricing({ original, automatic, flashPrice });
}

/** Payable total for a cart row, honouring per-line fixed discounts. */
export function getCartItemTotal(item) {
  return getCartItemPricing(item).getLineTotal(item?.quantity);
}

/** True when the row carries an automatic discount (manual codes must skip it). */
export function hasAutomaticDiscount(item) {
  if (item?.automatic_discount) return true;
  return getCartItemPricing(item).isAutomatic;
}

/**
 * Unit price to submit with an order line. The server applies automatic discounts
 * itself, so such lines are submitted at their normal price to avoid stacking.
 */
export function getOrderUnitPrice(pricing) {
  return pricing.isAutomatic ? pricing.originalPrice : pricing.finalPrice;
}

/** Fields stored on a guest cart row so it renders like a server cart row. */
export function getCartPriceFields(pricing) {
  return {
    price: getOrderUnitPrice(pricing),
    regular_price: pricing.originalPrice,
    original_price: pricing.originalPrice,
    discounted_price: pricing.isAutomatic ? pricing.finalPrice : pricing.originalPrice,
    discount_amount: pricing.isAutomatic ? pricing.discountAmount : 0,
    active_discount: pricing.activeDiscount,
  };
}
