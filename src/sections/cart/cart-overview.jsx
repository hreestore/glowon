import { useBoolean } from "minimal-shared/hooks";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  resetCart,
  changeActiveStep,
  removeCartItem,
  changeItemQuantity,
  addToWishlist,
} from "@/redux/actions";

import { useRouter } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";

import { Iconify } from "@/components/iconify";
import { EmptyContent } from "@/components/empty-content";
import { toast } from "@/components/snackbar";
import { ConfirmDialog } from "@/components/custom-dialog";

import { CartSummary } from "./cart-summary";
import { CartProductList } from "./cart-product-list";

import {
  removeProductFromCart,
  updateProductInCart,
  clearCartData,
  addProductToWishlist,
} from "@/api";
import { paths } from "@/routes/paths";
import { getItemIds } from "@/utils/item-display";
import { getErrorMessage } from "@/utils/error-message";

// ----------------------------------------------------------------------

export function CartOverview() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const confirmDialog = useBoolean(false);

  const { isLoading, items, totalItems } = useAppSelector((state) => state.cart);
  const { isLogin } = useAppSelector((state) => state.auth);

  const isCartEmpty = !items.length;

  const handleProceedToAddress = () => {
    if (!isLogin) {
      router.push(paths.checkout);
      return;
    }
    dispatch(changeActiveStep(1));
  };

  const handleDeleteCartItem = async (id) => {
    try {
      if (isLogin) await removeProductFromCart(id);
      dispatch(removeCartItem(id));
      toast.success("Product removed from cart!");
    } catch {
      toast.error("Couldn't remove product! Try again.");
    }
  };

  const handleChangeCartItemQuantity = async (id, quantity) => {
    const product = { cartId: id, quantity: Number(quantity) };
    try {
      if (isLogin) await updateProductInCart(product);
      dispatch(changeItemQuantity(product));
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't update quantity! Try again."));
    }
  };

  const handleMoveToWishlist = async (row) => {
    if (!isLogin) {
      toast.error("Please log in to move items to wishlist.");
      return;
    }

    const { productId, variantId } = getItemIds(row);
    const cartId = row.cart_id || row.id;

    if (!productId) {
      toast.error("Unable to identify product. Try again.");
      return;
    }
    if (!cartId) {
      toast.error("Unable to identify cart item. Try again.");
      return;
    }

    const newProduct = {
      product_id: productId,
      ...(variantId && { variant_id: variantId }),
    };

    try {
      const response = await addProductToWishlist(newProduct);
      await removeProductFromCart(cartId);
      dispatch(addToWishlist(response[0]));
      dispatch(removeCartItem(cartId));
      toast.success("Product moved to wishlist!");
    } catch (error) {
      toast.error(error?.message || "Couldn't move to wishlist! Try again.");
    }
  };

  const handleClearCart = async () => {
    try {
      if (isLogin) await clearCartData();
      dispatch(resetCart());
      confirmDialog.onFalse();
      toast.success("Cart cleared sucessfully!");
    } catch {
      toast.error("Couldn't clear cart! Try again.");
    }
  };

  const renderLoading = () => (
    <div className="h-[340px] flex items-center justify-center">
      <div className="w-full max-w-[320px]">
        <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
          <div className="h-full bg-gray-800 animate-[loading_1.5s_ease-in-out_infinite] rounded" />
        </div>
      </div>
    </div>
  );

  const renderEmpty = () => (
    <EmptyContent
      title="Cart is empty!"
      description="Look like you have no items in your shopping cart."
      imgUrl="/assets/icons/empty/ic-cart.svg"
      className="h-[50px]"
    />
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Cart items — 8/12 cols */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-xl shadow-md mb-2 py-3">
            {/* Card Header */}
            <div className="flex items-center justify-between p-2">
              <p className="text-base font-medium">
                Cart{" "}
                <span className="text-gray-500">({totalItems} items)</span>
              </p>

              {!isCartEmpty && (
                <button
                  onClick={confirmDialog.onTrue}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Iconify icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Card Body */}
            {isLoading ? (
              renderLoading()
            ) : isCartEmpty ? (
              renderEmpty()
            ) : (
              <CartProductList
                items={items}
                onDeleteCartItem={handleDeleteCartItem}
                onChangeItemQuantity={handleChangeCartItemQuantity}
                onMoveToWishlist={handleMoveToWishlist}
              />
            )}
          </div>

          {/* Continue Shopping */}
          <RouterLink
            href={paths.product.root}
            className="inline-flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Iconify icon="eva:arrow-ios-back-fill" className="w-4 h-4" />
            Continue shopping
          </RouterLink>
        </div>

        {/* Right: Summary — 4/12 cols */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <CartSummary />

          <button
            type="submit"
            disabled={isCartEmpty}
            onClick={handleProceedToAddress}
            className="w-full py-2 rounded-lg text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Clear Cart"
        content={<>Are you sure you want to clear the cart?</>}
        action={
          <button
            onClick={handleClearCart}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Clear
          </button>
        }
      />
    </>
  );
}