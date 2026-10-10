
import { z as zod } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setDiscount, removeDiscount } from "@/redux/actions";

import { fCurrency } from "@/utils/format-number";

import { Form, Field } from "@/components/hook-form";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";

import { calculateCart } from "@/api";

// ----------------------------------------------------------------------

export const DiscountCodeSchema = zod.object({
  discount_code: zod.string().min(1, { message: "Discount code is required!" }),
});

const PAYMENT_OPTIONS = [
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order arrives",
    icon: "solar:wallet-money-bold",
  },
  {
    value: "esewa",
    label: "eSewa",
    description: "Secure online payment via eSewa",
    image: "/assets/images/payment-vendors/esewa.png",
    accentColor: "#60BB46",
    vendorFlag: "has_esewa_checkout",
  },
  {
    value: "fonepay",
    label: "Checkout by Fonepay",
    description: "Scan & pay with your mobile banking app or wallet",
    image: "/assets/images/payment-vendors/CheckoutByFonepay.webp",
    image2: "/assets/images/payment-vendors/connect.png",
    accentColor: "#DC1E25",
    vendorFlag: "has_fonepay_checkout",
  },
];

export function PaymentMethodSelector({ value, onChange, vendor }) {
  const availableOptions = PAYMENT_OPTIONS.filter(
    (option) => !option.vendorFlag || vendor?.[option.vendorFlag]
  );

  // If the previously selected method is no longer offered (vendor config
  // just loaded, or disabled it), fall back to Cash on Delivery.
  useEffect(() => {
    if (value !== "cod" && !availableOptions.some((option) => option.value === value)) {
      onChange("cod");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, availableOptions.map((option) => option.value).join(",")]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-900">
        Payment Method
      </span>

      <div className="flex flex-col gap-2">
        {availableOptions.map((option) => {
          const isSelected = value === option.value;
          // COD has no gateway branding, so it follows the vendor's theme
          const accentColor = option.accentColor || vendor?.primary_color || "#111827";

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={[
                "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-150",
                isSelected
                  ? "bg-gray-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60",
              ].join(" ")}
              style={isSelected ? { borderColor: accentColor } : undefined}
            >
              <span
                className={[
                  "flex h-10 w-20 shrink-0 items-center justify-center rounded-lg  transition-colors",
                  option.image ? "bg-white" : "border-transparent",
                  !option.image &&
                  (isSelected
                    ? "text-white"
                    : "bg-gray-100 text-gray-500 group-hover:text-gray-700"),
                ].join(" ")}
                style={!option.image && isSelected ? { backgroundColor: accentColor } : undefined}
              >
                <div className="flex items-end gap-1">


                  {option.image2 ? (
                    <img
                      src={option.image2}
                      alt={option.label}
                      className="h-5 w-auto max-w-full object-contain"
                    />
                  ) : (
                    ""
                  )}
                  {option.image ? (
                    <img
                      src={option.image}
                      alt={option.label}
                      className="h-6 w-auto max-w-full object-contain"
                    />
                  ) : (
                    <Iconify icon={option.icon} className="h-5 w-5" />
                  )}
                </div>
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-gray-900">
                  {option.label}
                </span>
                <span className="block truncate text-xs text-gray-500">
                  {option.description}
                </span>
              </span>

              <span
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  !isSelected && "border-gray-300",
                ].join(" ")}
                style={
                  isSelected
                    ? { borderColor: accentColor, backgroundColor: accentColor }
                    : undefined
                }
              >
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CartSummary({
  isAddressSelected,
  selectedAddressId,
  paymentMethod,
  onPaymentMethodChange,
}) {
  const dispatch = useAppDispatch();

  const { total, subtotal, shipping, discount, items } = useAppSelector(
    (state) => state.cart
  );
  const { isLogin } = useAppSelector((state) => state.auth);
  const { vendor } = useAppSelector((state) => state.vendor);

  const [calculation, setCalculation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const defaultValues = { discount_code: "" };

  const methods = useForm({
    resolver: zodResolver(DiscountCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const runCalculation = async (discountCode) => {
    if (!isLogin) return;
    if (!items || items.length === 0) {
      setCalculation(null);
      return;
    }

    try {
      setIsCalculating(true);

      const safeDiscountCode =
        typeof discountCode === "string"
          ? discountCode
          : typeof discountCode === "object" && discountCode?.code
            ? String(discountCode.code)
            : undefined;

      const payload = {
        ...(safeDiscountCode ? { discount_code: safeDiscountCode } : {}),
        ...(isAddressSelected &&
          selectedAddressId &&
          selectedAddressId !== "guest-address"
          ? { customer_address_id: selectedAddressId }
          : {}),
      };

      const response = await calculateCart(payload);
      if (response?.success && response?.data) {
        setCalculation(response.data);
      }
    } catch (error) {
      if (discountCode) {
        toast.error(
          error?.message || "Couldn't apply discount code! Please try again."
        );
      }
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    runCalculation(discount?.code || undefined);
  }, [isLogin, isAddressSelected, selectedAddressId, subtotal, items?.length]);

  const handleRemoveDiscount = async () => {
    dispatch(removeDiscount());
    await runCalculation(undefined);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const discountCode = data.discount_code?.trim()?.toUpperCase();
      const payload = {
        discount_code: discountCode,
        ...(isAddressSelected &&
          selectedAddressId &&
          selectedAddressId !== "guest-address"
          ? { customer_address_id: selectedAddressId }
          : {}),
      };

      const response = await calculateCart(payload);

      if (!response?.success || !response?.data) {
        toast.error(
          response?.message ||
          "Couldn't apply discount code! Please try again."
        );
        return;
      }

      setCalculation(response.data);
      dispatch(setDiscount(response.data));
      reset();
      toast.success("Discount applied!");
    } catch (error) {
      toast.error(
        error?.message || "Couldn't apply discount code! Please try again."
      );
    }
  });

  const subtotalAmount = calculation?.original_total_amount;
  const taxableAmount = calculation?.tax?.taxable_amount ?? subtotal;
  const discountAmount = calculation?.discount?.amount ?? discount?.amount ?? 0;
  const shippingAmount = calculation?.additional_charges_total ?? shipping;
  const totalAmount = calculation?.total_amount ?? total;

  const extractDiscountCode = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (typeof value.code === "string") return value.code;
      if (typeof value.discount_code === "string") return value.discount_code;
      return "";
    }
    return "";
  };

  // Automatic product discounts are already in each line's final price — shown as
  // savings only, never subtracted again like a code discount
  const automaticSavings = (calculation?.items ?? []).reduce(
    (sum, item) =>
      item?.automatic_discount ? sum + (Number(item.discount_amount) || 0) : sum,
    0
  );

  const appliedDiscountCode =
    extractDiscountCode(calculation?.discount_code) ||
    extractDiscountCode(discount?.code);

  return (
    <div className="bg-white rounded-xl shadow-sm mb-1 pb-3">
      {/* Card Header */}
      <div className="p-3">
        <h6 className="text-base font-semibold">Order summary</h6>
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-3 py-2 p-3">

        {/* Sub Total */}
        <div className="flex items-center">
          <span className="flex-1 text-sm text-gray-500">Sub Total</span>
          <span className="text-sm font-semibold">{fCurrency(subtotalAmount)}</span>
        </div>

        {/* Discount */}
        <div className="flex items-center">
          <span className="flex-1 text-sm text-gray-500">Discount</span>
          <span className="text-sm font-semibold">
            {discountAmount ? fCurrency(-discountAmount) : "-"}
          </span>
        </div>

        {/* Tax */}
        {calculation?.tax?.applied && (
          <div className="flex items-center">
            <span className="flex-1 text-sm text-gray-500">
              {calculation.tax.tax_name} ({calculation.tax.percentage}%)
              {calculation.tax.price_includes_tax ? " (Included)" : ""}
            </span>
            <span className="text-sm font-semibold">
              {fCurrency(calculation.tax.tax_amount)}
            </span>
          </div>
        )}

        {/* Shipping */}
        {isAddressSelected && (
          <div className="flex items-center">
            <span className="flex-1 text-sm text-gray-500">Shipping</span>
            <span className="text-sm font-semibold">
              {shippingAmount || fCurrency(shippingAmount)}
            </span>
          </div>
        )}

        {/* Flash Sale */}
        {calculation?.flash_sale?.has_flash_sale_items &&
          calculation?.flash_sale?.total_flash_sale_savings > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-dashed border-red-500">
              <Iconify icon="solar:fire-bold" className="w-5 h-5 text-red-600 shrink-0" />
              <span className="flex-1 text-sm font-semibold text-red-800">
                Flash Sale Savings
              </span>
              <span className="text-sm font-bold text-red-600">
                {fCurrency(calculation.flash_sale.total_flash_sale_savings)}
              </span>
            </div>
          )}

        {/* Automatic product discounts */}
        {automaticSavings > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-dashed border-green-500">
            <Iconify icon="solar:tag-price-bold" className="w-5 h-5 text-green-600 shrink-0" />
            <span className="flex-1 text-sm font-semibold text-green-800">
              Product Discount Savings
            </span>
            <span className="text-sm font-bold text-green-600">
              {fCurrency(automaticSavings)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300" />

        {/* Payment Method — chosen on the billing step only, not the cart page */}
        {typeof onPaymentMethodChange === "function" &&
          (isLogin ? (
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={onPaymentMethodChange}
              vendor={vendor}
            />
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-dashed border-green-500">
              <Iconify icon="solar:wallet-money-bold" className="w-6 h-6 text-green-600 shrink-0" />
              <span className="text-sm font-semibold text-green-800">
                Cash on Delivery
              </span>
            </div>
          ))}

        {/* Total */}
        <div className="flex items-center">
          <span className="flex-1 text-md font-bold">Total</span>
          <span className="text-md font-bold text-red-700">
            {fCurrency(totalAmount)}
          </span>
        </div>

        {/* Discount Code Section */}
        {isLogin && (
          <>
            {appliedDiscountCode ? (
              <div className="flex flex-col gap-2">
                {/* Success Alert */}
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-green-50 border border-green-200">
                  <Iconify
                    icon="eva:checkmark-circle-2-fill"
                    className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                  />
                  <div className="flex-1 text-sm text-green-800">
                    Discount code &quot;{appliedDiscountCode}&quot; applied!
                    {discountAmount > 0 && (
                      <p className="text-xs mt-0.5">
                        You saved {fCurrency(discountAmount)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleRemoveDiscount}
                    className="text-xs font-medium text-green-800 hover:text-green-900 underline shrink-0"
                  >
                    Remove
                  </button>
                </div>

                {/* Discount applies to product */}
                {calculation?.discount_code?.applies_to === "product" &&
                  calculation?.discount_info?.target && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                      <Iconify
                        icon="solar:tag-price-bold"
                        className="w-4 h-4 text-green-600 shrink-0"
                      />
                      <p className="text-xs text-gray-500">
                        Discount applied on{" "}
                        <span className="font-bold text-gray-800">
                          {calculation.discount_info.target.name}
                        </span>{" "}
                        ({fCurrency(discountAmount)} off)
                      </p>
                    </div>
                  )}

                {/* Discount applies to category */}
                {calculation?.discount_code?.applies_to === "category" && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                    <Iconify
                      icon="solar:tag-price-bold"
                      className="w-4 h-4 text-green-600 shrink-0"
                    />
                    <p className="text-xs text-gray-500">
                      Discount applied on category items (
                      {fCurrency(discountAmount)} off)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Form methods={methods} onSubmit={onSubmit}>
                <Field.Text
                  fullWidth
                  name="discount_code"
                  label="Discount code"
                  onChange={(e) => {
                    const upperValue = e.target.value.toUpperCase();
                    setValue("discount_code", upperValue, {
                      shouldValidate: true,
                    });
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <div className="mr-[-4px]">
                          <button
                            type="submit"
                            disabled={isSubmitting || isCalculating}
                            className="px-3 py-1.5 text-sm font-medium bg-black text-white rounded-lg hover:bg-[#d6ad89]! pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isSubmitting || isCalculating ? (
                              <span className="flex items-center gap-1">
                                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Applying...
                              </span>
                            ) : (
                              "Apply"
                            )}
                          </button>
                        </div>
                      ),
                    },
                  }}
                />
              </Form>
            )}
          </>
        )}
      </div>
    </div>
  );
}