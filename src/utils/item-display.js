import { CONFIG } from "@/global-config";

// ----------------------------------------------------------------------

// Works for guest cart rows, server cart rows and order items.
export function getItemNames(item) {
  const { itemable } = item;

  const variantName =
    item.variant_name ||
    itemable?.variant_name ||
    (itemable?.variant_values || item.variant_values || [])
      .map((v) => v.value)
      .filter(Boolean)
      .join(" / ") ||
    "";

  const productName =
    item.product_name ||
    item.product?.name ||
    item.product?.product_name ||
    itemable?.product?.name ||
    item.item_name ||
    item.name ||
    "";

  return {
    productName,
    variantName: variantName && variantName !== productName ? variantName : "",
  };
}

// Server cart rows only carry itemable_id, which is the variant id when itemable_type is "ProductVariant".
export function getItemIds(item) {
  const { itemable } = item;
  const isVariant = item.itemable_type === "ProductVariant";

  const productId =
    item.product_id ?? itemable?.product_id ?? (isVariant ? undefined : item.itemable_id);
  const variantId =
    item.variant_id ?? itemable?.variant_id ?? (isVariant ? item.itemable_id : undefined);

  return { productId, variantId };
}

// Cart/order APIs return images as ".../uploads/..." but files are served from ".../storage/uploads/..."
export function fixImageUrl(url) {
  if (!url) return url;

  let fixed = url;
  if (!fixed.includes("/storage/uploads/")) {
    fixed = fixed.replace(/\/?uploads\//, "/storage/uploads/");
  }
  if (!fixed.startsWith("http")) {
    fixed = `${new URL(CONFIG.serverUrl).origin}${fixed.startsWith("/") ? "" : "/"}${fixed}`;
  }
  return fixed;
}
