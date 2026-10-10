import { call, put, takeLatest } from "redux-saga/effects";

import {
  getCartDataRequest,
  getCartDataSuccess,
  getCartDataFailure,
} from "../actions";

import { getCartData } from "@/api";

function* fetchCartSaga() {
  try {
    const response = yield call(getCartData);

    // Handle the API response which may have data wrapped in response.data,
    // or nested under a `data.items`/`data.cart_items` list.
    const cartItems = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response?.data?.items)
            ? response.data.items
            : Array.isArray(response?.cart_items)
              ? response.cart_items
              : Array.isArray(response?.data?.cart_items)
                ? response.data.cart_items
                : null;

    if (cartItems) {
      yield put(getCartDataSuccess(cartItems));
    } else {
      // Unrecognized shape — surface it instead of silently wiping a cart
      // that may have just been successfully added to.
      console.error("[CART] Unexpected cart response shape:", response);
      yield put(getCartDataFailure());
    }
  } catch (error) {
    // Leave existing cart items in place on a failed refresh (network blip,
    // transient auth hiccup, etc.) — a fetch failure right after a
    // successful add-to-cart must never look like the add silently failed.
    console.error("[CART] Failed to refresh cart:", error);
    yield put(getCartDataFailure());
  }
}

export function* watchCartSaga() {
  yield takeLatest(getCartDataRequest, fetchCartSaga);
}
