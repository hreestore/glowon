
import { useState } from "react";
import { useBoolean, usePopover } from "minimal-shared/hooks";

import { RouterLink } from "@/routes/components";
import { fCurrency } from "@/utils/format-number";
import { fDate, fTime } from "@/utils/format-time";
import { getItemNames, fixImageUrl } from "@/utils/item-display";

import { OrderUpdateForm } from "./order-update-form";
import { OrderAddressUpdateForm } from "./order-address-update-form";

// ----------------------------------------------------------------------

export function OrderTableRow({ row, detailsHref }) {
  const {
    order_date,
    order_id,
    id,
    order_items = [],
    status,
    total_amount,
    created_at,
  } = row;

  const collapseRow = useBoolean();
  const openOrderUpdateForm = useBoolean();
  const openOrderAddressUpdateForm = useBoolean();

  const menuActions = usePopover();
  const [updateStatus, setUpdateStatus] = useState("");

  const isFinalStatus = ["delivered", "completed"].includes(status);

  // ----------------------------------------------------------------------
  // STATUS STYLE (frontend friendly pills)
  // ----------------------------------------------------------------------

  const statusStyles = {
    completed: "bg-emerald-50 text-emerald-600",
    delivered: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    cancelled: "bg-red-50 text-red-600",
  };

  const statusColor =
    statusStyles[status] || "bg-gray-100 text-gray-600";

  const handleAction = (newStatus) => {
    setUpdateStatus(newStatus);
    openOrderUpdateForm.onTrue();
    menuActions.onClose();
  };

  // ----------------------------------------------------------------------

  return (
    <>
      {/* ROW */}
      <tr className="group border-b border-gray-100 transition hover:bg-gray-50/60">

        {/* ORDER ID */}
        <td className="px-4 py-3">
          {/* <RouterLink
            href={detailsHref}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            #{order_id}
          </RouterLink> */}
        </td>
        <td className="px-4 py-3">
          <RouterLink
            href={detailsHref}
            className="text-sm font-semibold text-[var(--vendor-primary-color,#111827)] hover:underline hover:opacity-80"
          >
            #{order_id}
          </RouterLink>
        </td>

        {/* DATE */}
        <td className="px-4 py-3">
          <div className="text-sm font-medium text-gray-900">
            {fDate(order_date)}
          </div>
          <div className="text-xs text-gray-500">
            {fTime(created_at)}
          </div>
        </td>

        {/* ITEMS */}
        <td className="px-4 py-3 text-center text-sm text-gray-600">
          {order_items.length}
        </td>

        {/* TOTAL */}
        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
          {fCurrency(total_amount)}
        </td>

        {/* STATUS */}
        <td className="px-4 py-3">
          <span
            className={[
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
              statusColor,
            ].join(" ")}
          >
            {status}
          </span>
        </td>

        {/* ACTIONS */}
        <td className="px-4 py-3">
          <div className="flex justify-end gap-2 opacity-70 transition group-hover:opacity-100">

            {/* VIEW */}
            <RouterLink
              href={detailsHref}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
            >
              View
            </RouterLink>

            {/* TOGGLE DETAILS */}
            <button
              onClick={collapseRow.onToggle}
              className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
            >
              Details
            </button>

            {/* MENU */}
            {!isFinalStatus && (
              <div className="relative">
                <button
                  onClick={menuActions.onOpen}
                  className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  ⋯
                </button>

                {/* FLOATING MENU (modern popover style) */}
                {menuActions.open && (
                  <div
                    className="
                      absolute right-0 mt-2 w-44
                      rounded-xl border border-gray-200
                      bg-white p-1
                      shadow-[0_20px_50px_rgba(0,0,0,0.12)]
                      backdrop-blur
                      z-50
                    "
                  >
                    {!isFinalStatus && (
                      <button
                        onClick={() => {
                          openOrderAddressUpdateForm.onTrue();
                          menuActions.onClose();
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Change Address
                      </button>
                    )}

                    {isFinalStatus && (
                      <button
                        onClick={() => handleAction("returned")}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                      >
                        Return
                      </button>
                    )}

                    <div className="my-1 h-px bg-gray-100" />

                    {!isFinalStatus && (
                      <button
                        onClick={() => handleAction("cancelled")}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </td>
      </tr>

      {/* COLLAPSE */}
      {collapseRow.value && (
        <tr>
          <td colSpan={6} className="bg-gray-50/60 px-4 py-3">
            <div className="space-y-2">
              {order_items.map((item) => {
                const { productName, variantName } = getItemNames(item);
                return (
                <div
                  key={item.order_item_id ?? item.item_sku}
                  className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 shadow-sm"
                >
                  <img
                    src={fixImageUrl(item.item_image)}
                    alt={productName}
                    className="h-10 w-10 rounded-md object-cover"
                  />

                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {productName}
                    </div>
                    {variantName && (
                      <div className="text-xs text-gray-500">
                        Variant: <span className="font-medium text-gray-700">{variantName}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      {item.item_sku}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    x{item.quantity}
                  </div>

                  <div className="w-24 text-right text-sm font-semibold text-gray-900">
                    {fCurrency(
                      Number(item.price) *
                      Number(item.quantity)
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </td>
        </tr>
      )}

      {/* MODALS */}
      {openOrderUpdateForm.value && (
        <OrderUpdateForm
          open={openOrderUpdateForm.value}
          onClose={openOrderUpdateForm.onFalse}
          orderUpdateData={{
            id,
            status: updateStatus,
          }}
        />
      )}

      {openOrderAddressUpdateForm.value && (
        <OrderAddressUpdateForm
          open={openOrderAddressUpdateForm.value}
          onClose={openOrderAddressUpdateForm.onFalse}
          orderUpdateData={{ id }}
        />
      )}
    </>
  );
}