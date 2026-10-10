
"use client";

import { z as zod } from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoolean } from "minimal-shared/hooks";

import { useAppSelector } from "@/redux/hooks";
import { Form, Field, schemaHelper } from "@/components/hook-form";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";

import { useGetStates, updateOrderStatus, getLogisticCharge } from "@/api";
import { AddressNewForm } from "../address";
import { useGetMutateOrders, useGetMutateOrderDetail } from "@/api/order";

// ----------------------------------------------------------------------

export const schema = zod.object({
  customer_address_id: schemaHelper.nullableInput(
    zod.string().min(1, { message: "Address is required!" }),
    {
      message: "Address is required!",
    }
  ),
});

// ----------------------------------------------------------------------

export function OrderAddressUpdateForm({
  open,
  onClose,
  orderUpdateData,
}) {
  const openAddressForm = useBoolean();

  const mutateOrders = useGetMutateOrders();
  const mutateOrderDetail = useGetMutateOrderDetail(orderUpdateData?.id);

  const { states } = useGetStates();
  const { addresses } = useAppSelector((state) => state.profile);

  const [selectedCharge, setSelectedCharge] = useState(0);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: { customer_address_id: "" },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const selectedAddressId = watch("customer_address_id");

  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!selectedAddressId) {
      setSelectedCharge(0);
      return;
    }

    const address = addresses?.find(
      (a) => String(a.address_id) === String(selectedAddressId)
    );

    if (!address?.district?.district_id) return;

    (async () => {
      try {
        const res = await getLogisticCharge(
          address.district.district_id
        );
        setSelectedCharge(res.charge_amount);
      } catch {
        setSelectedCharge(0);
      }
    })();
  }, [selectedAddressId]);

  // ----------------------------------------------------------------------

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateOrderStatus({
        id: orderUpdateData.id,
        logistic_charge: selectedCharge,
        customer_address_id: data.customer_address_id,
      });

      toast.success("Address updated successfully");

      reset();
      onClose();
      mutateOrders();
      mutateOrderDetail();
    } catch (error) {
      toast.error(error?.message || "Update failed");
    }
  });

  if (!open) return null;

  // ----------------------------------------------------------------------

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

        {/* MODAL CARD */}
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Change Delivery Address
            </h2>

            <button
              type="button"
              onClick={openAddressForm.onTrue}
              className="flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              <Iconify icon="mingcute:add-line" />
              Add new
            </button>
          </div>

          {/* BODY */}
          <form onSubmit={onSubmit} className="space-y-4 p-5">

            {/* SELECT CARD */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">
                Select Address
              </label>

              <select
                value={selectedAddressId || ""}
                onChange={(e) =>
                  setValue(
                    "customer_address_id",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-300 focus:bg-white"
              >
                <option value="">Choose address</option>

                {addresses?.map((address) => (
                  <option
                    key={address.address_id}
                    value={String(address.address_id)}
                  >
                    {address.address},{" "}
                    {address.district?.district_name}
                  </option>
                ))}
              </select>
            </div>

            {/* LOGISTIC INFO */}
            {selectedCharge > 0 && (
              <div className="rounded-xl bg-[color-mix(in_srgb,var(--vendor-primary-color,#111827)_10%,white)] px-4 py-3 text-sm text-[var(--vendor-primary-color,#111827)]">
                Delivery charge:{" "}
                <span className="font-semibold">
                  Rs. {selectedCharge}
                </span>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[var(--vendor-primary-color,#111827)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-90 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Updating..."
                  : "Update Address"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ADDRESS FORM */}
      <AddressNewForm
        open={openAddressForm.value}
        onClose={openAddressForm.onFalse}
        states={states}
        onAddressAddSuccess={(addr) => {
          openAddressForm.onFalse();
          setValue(
            "customer_address_id",
            String(addr.address_id)
          );
        }}
      />
    </>
  );
}