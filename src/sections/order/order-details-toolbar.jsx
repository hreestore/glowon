
"use client";

import { useState } from "react";
import { useBoolean } from "minimal-shared/hooks";

import { fDateTime } from "@/utils/format-time";
import { Iconify } from "@/components/iconify";
import { Label } from "@/components/label";

import { OrderUpdateForm } from "./order-update-form";
import { OrderAddressUpdateForm } from "./order-address-update-form";

// ----------------------------------------------------------------------

export function OrderDetailsToolbar({
  status,
  backHref,
  createdAt,
  orderNumber,
  orderId,
}) {
  const openOrderUpdateForm = useBoolean();
  const openOrderAddressUpdateForm = useBoolean();

  const [updateStatus, setUpdateStatus] = useState("");

  const isDone = ["delivered", "completed"].includes(status);
  const isLocked = ["cancelled", "returned"].includes(status);

  const handleAction = (newStatus) => {
    setUpdateStatus(newStatus);
    openOrderUpdateForm.onTrue();
  };

  // ----------------------------------------------------------------------
  // STATUS STYLE (clean badge system)
  // ----------------------------------------------------------------------

  const statusStyles = {
    completed: "bg-emerald-50 text-emerald-600",
    delivered: "bg-emerald-50 text-emerald-600",
    confirmed:
      "bg-[color-mix(in_srgb,var(--vendor-primary-color,#111827)_10%,white)] text-[var(--vendor-primary-color,#111827)]",
    processing: "bg-indigo-50 text-indigo-600",
    pending: "bg-amber-50 text-amber-600",
    cancelled: "bg-red-50 text-red-600",
    returned: "bg-gray-100 text-gray-600",
  };

  const statusClass =
    statusStyles[status] ||
    "bg-gray-100 text-gray-600";

  // ----------------------------------------------------------------------

  return (
    <>
      {/* HEADER CARD */}
      <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">

        {/* LEFT */}
        <div className="flex items-start gap-3">

          {/* BACK */}
          <a
            href={backHref}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition hover:bg-gray-100"
          >
            <Iconify icon="eva:arrow-ios-back-fill" />
          </a>

          {/* INFO */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">

              <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
                Order #{orderNumber}
              </h1>

              <span
                className={[
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  statusClass,
                ].join(" ")}
              >
                {status}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Created {fDateTime(createdAt)}
            </p>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        {!isLocked && (
          <div className="flex flex-wrap items-center gap-2 md:justify-end">

            {isDone ? (
              <button
                onClick={() => handleAction("returned")}
                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Return Order
              </button>
            ) : (
              <>
                <button
                  onClick={() =>
                    handleAction("cancelled")
                  }
                  className="rounded-xl bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={openOrderAddressUpdateForm.onTrue}
                  className="rounded-xl bg-[var(--vendor-primary-color,#111827)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-90"
                >
                  Change Address
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {orderId && (
        <OrderUpdateForm
          open={openOrderUpdateForm.value}
          onClose={openOrderUpdateForm.onFalse}
          orderUpdateData={{
            id: orderId,
            status: updateStatus,
          }}
        />
      )}

      {orderId && (
        <OrderAddressUpdateForm
          open={openOrderAddressUpdateForm.value}
          onClose={openOrderAddressUpdateForm.onFalse}
          orderUpdateData={{
            id: orderId,
            status,
          }}
        />
      )}
    </>
  );
}