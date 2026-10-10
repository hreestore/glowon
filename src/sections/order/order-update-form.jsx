import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@/components/snackbar";
import {
  updateOrderStatus,
  useGetMutateOrders,
  useGetMutateOrderDetail,
  useGetOrderDetail,
} from "@/api";

export const schema = zod.object({
  remarks: zod
    .string()
    .min(1, { message: "Remarks are required" })
    .max(300),
});

export function OrderUpdateForm({ open, onClose, orderUpdateData }) {
  const orderId = orderUpdateData?.id;
  const status = orderUpdateData?.status;

  const isCancelRequested = status === "cancelled";

  const mutateOrders = useGetMutateOrders();
  const mutateOrderDetail = useGetMutateOrderDetail(orderId);

  const { order } = useGetOrderDetail(orderId, {
    enabled: !!orderId,
  });

  const title = isCancelRequested
    ? "Are you sure you want to cancel your order?"
    : "Are you sure you want to return your order?";

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      remarks: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updateData = {
        id: orderId,
        status,
        customer_address_id:
          order?.customer_address?.address_id ??
          order?.customer_address_id,
        remarks: data.remarks,
      };

      const response = await updateOrderStatus(updateData);

      toast.success(
        response?.message ||
        `Order successfully ${isCancelRequested ? "cancelled" : "returned"
        }`
      );

      reset();

      await mutateOrderDetail();
      await mutateOrders();

      onClose();
    } catch (error) {
      toast.error(
        error?.message ||
        error?.data?.message ||
        "Something went wrong. Try again."
      );
    }
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <textarea
              {...register("remarks")}
              placeholder="Enter reason..."
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-gray-500"
            />

            {errors?.remarks && (
              <p className="mt-1 text-xs text-red-500">
                {errors.remarks.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-lg px-4 py-2 text-sm text-white transition ${isCancelRequested
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[var(--vendor-primary-color,#111827)] hover:brightness-90"
                } disabled:opacity-50`}
            >
              {isSubmitting
                ? "Processing..."
                : isCancelRequested
                  ? "Cancel Order"
                  : "Return Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}