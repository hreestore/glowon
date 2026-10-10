import { cartSlice } from "../reducer/cart/cart-slice";

export const {
  changeActiveStep,
  getCartDataRequest,
  getCartDataSuccess,
  getCartDataFailure,
  addToCart,
  removeCartItem,
  changeItemQuantity,
  resetCart,
  clearCartItems,
  setShippingCharge,
  setDiscount,
  removeDiscount,
} = cartSlice.actions;
