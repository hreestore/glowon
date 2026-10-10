import { createSlice } from "@reduxjs/toolkit";

import { getCartItemTotal, hasAutomaticDiscount } from "@/utils/product-pricing";
import { getItemIds } from "@/utils/item-display";

const DISCOUNT_TYPES = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
};

const sumLines = (items) => items.reduce((sum, item) => sum + getCartItemTotal(item), 0);

// Manual/code discounts never apply to lines already carrying an automatic discount
const getManualDiscountItems = (items) => items.filter((item) => !hasAutomaticDiscount(item));

const toIdList = (list, key) =>
  Array.isArray(list) ? list.map((entry) => String(entry?.[key] ?? entry)) : [];

// A product discount targets exact simple products and/or exact variants: a variant
// target never matches its siblings or parent. Legacy single-target discounts use
// targetId + targetType.
const matchesProductTarget = (item, discount) => {
  const { productId, variantId } = getItemIds(item);
  const productIds = discount.productIds ?? [];
  const variantIds = discount.variantIds ?? [];

  if (productIds.length || variantIds.length) {
    if (variantId != null) return variantIds.includes(String(variantId));
    return productIds.includes(String(productId));
  }

  if (discount.targetType === "variant") {
    return variantId != null && String(variantId) === String(discount.targetId);
  }

  return String(productId ?? item.itemable_id) === String(discount.targetId);
};

// Helper function to recalculate discount based on current cart state
const recalculateDiscount = (state) => {
  // Persisted carts from older versions may not have a discount object
  if (!state.discount) {
    state.discount = { ...initialState.discount };
  }

  const { type, value, appliesTo, targetId, code } = state.discount;

  // If no discount code is applied, return 0
  if (!code) return 0;

  let discountAmount = 0;

  const eligibleItems = getManualDiscountItems(state.items);

  if (appliesTo === "all") {
    const eligibleSubtotal = sumLines(eligibleItems);

    if (type === DISCOUNT_TYPES.PERCENTAGE) {
      discountAmount = (eligibleSubtotal * value) / 100;
    } else if (type === DISCOUNT_TYPES.FIXED) {
      discountAmount = Math.min(value, eligibleSubtotal);
    }
  } else if (appliesTo === "category") {
    const categoryItemsSubtotal = sumLines(
      eligibleItems.filter((item) => item.category_id === targetId)
    );

    // If no items from the category remain, discount should be 0
    if (categoryItemsSubtotal === 0) return 0;

    if (type === DISCOUNT_TYPES.PERCENTAGE) {
      discountAmount = (categoryItemsSubtotal * value) / 100;
    } else if (type === DISCOUNT_TYPES.FIXED) {
      discountAmount = Math.min(value, categoryItemsSubtotal);
    }
  } else {
    const itemsSubtotal = sumLines(
      eligibleItems.filter((item) => matchesProductTarget(item, state.discount))
    );

    // If no qualifying items remain, discount should be 0
    if (itemsSubtotal === 0) return 0;

    if (type === DISCOUNT_TYPES.PERCENTAGE) {
      discountAmount = (itemsSubtotal * value) / 100;
    } else if (type === DISCOUNT_TYPES.FIXED) {
      discountAmount = Math.min(value, itemsSubtotal);
    }
  }

  // Cap discount at subtotal to prevent negative totals
  return Math.min(discountAmount, state.subtotal);
};

const initialState = {
  isLoading: false,
  items: [],
  subtotal: 0,
  total: 0,
  discount: {
    appliesTo: "",
    targetId: "",
    code: "",
    type: "",
    value: 0,
    amount: 0,
  },
  shipping: 0,
  totalItems: 0,
  activeStep: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    changeActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },

    getCartDataRequest: (state, action) => {
      state.isLoading = true;
    },

    getCartDataSuccess: (state, action) => {
      state.isLoading = false;

      state.items = action.payload;

      state.totalItems = state.items.length;

      state.subtotal = sumLines(state.items);

      state.discount.amount = recalculateDiscount(state);
      state.total = state.subtotal - state.discount.amount + state.shipping;
    },

    getCartDataFailure: (state) => {
      state.isLoading = false;
    },

    addToCart: (state, action) => {
      const newItem = action.payload;

      const existingItem = state.items.find(
        (item) => item.product_id == newItem.product_id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push(newItem);
      }

      state.totalItems = state.items.length;

      state.subtotal = sumLines(state.items);

      state.discount.amount = recalculateDiscount(state);
      state.total = state.subtotal - state.discount.amount + state.shipping;
    },

    removeCartItem: (state, action) => {
      const cartId = action.payload;

      state.items = state.items.filter((item) => item.cart_id !== cartId);

      state.totalItems = state.items.length;

      state.subtotal = sumLines(state.items);

      state.discount.amount = recalculateDiscount(state);
      state.total = state.subtotal - state.discount.amount + state.shipping;
    },

    changeItemQuantity: (state, action) => {
      const { cartId, quantity } = action.payload;

      const item = state.items.find((item) => item.cart_id === cartId);

      if (item) {
        item.quantity = quantity;
      }

      state.totalItems = state.items.length;

      state.subtotal = sumLines(state.items);

      state.discount.amount = recalculateDiscount(state);
      state.total = state.subtotal - state.discount.amount + state.shipping;
    },

    setShippingCharge: (state, action) => {
      state.shipping = action.payload;

      state.total =
        state.subtotal - (state.discount?.amount ?? 0) + state.shipping;
    },

    setDiscount: (state, action) => {
      const payload = action.payload;

      // Handle new cart calculation API format (discount_code is an object)
      const isNewFormat = typeof payload.discount_code === 'object' && payload.discount_code !== null;

      const applies_to = isNewFormat ? payload.discount_code.applies_to : (payload.applies_to ?? payload.discount_code);
      const discount_code = isNewFormat ? payload.discount_code.code : (typeof payload.discount_code === 'string' ? payload.discount_code : '');
      const discount_type = isNewFormat ? payload.discount_code.type : (payload.discount_type ?? '');
      const discount_value = isNewFormat ? payload.discount_code.value : (payload.discount_value ?? 0);
      const target_id = isNewFormat ? payload.discount_code.target : (payload.target_id ?? '');
      const source = isNewFormat ? payload.discount_code : payload;

      state.discount = {
        appliesTo: applies_to,
        code: discount_code,
        type: discount_type,
        value: discount_value,
        targetId: target_id,
        targetType: source.target_type ?? "product",
        productIds: toIdList(source.product_ids ?? source.products, "product_id"),
        variantIds: toIdList(source.variant_ids ?? source.variants, "variant_id"),
        amount: 0,
      };

      const discountAmount = recalculateDiscount(state);

      state.discount.amount = discountAmount;
      state.total = state.subtotal - discountAmount + state.shipping;
    },

    removeDiscount: (state, action) => {
      state.discount = {
        appliesTo: "",
        targetId: "",
        code: "",
        type: "",
        value: 0,
        amount: 0,
      };

      state.total = state.subtotal + state.shipping;
    },

    resetCart: (state) => {
      Object.assign(state, initialState);
    },

    // Like resetCart, but stays on the current checkout step so whatever is
    // mounted there (e.g. the Fonepay QR dialog) isn't torn down.
    clearCartItems: (state) => {
      Object.assign(state, initialState, { activeStep: state.activeStep });
    },

    changeStep: (state, action) => {
      state.activeStep = action.payload;
    },
  },
});
