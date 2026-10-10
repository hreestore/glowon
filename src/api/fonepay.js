"use client";

import { endpoints } from "./endpoints";

import { poster as clientPoster } from "@/lib/axios-client";

// ----------------------------------------------------------------------
// Customer Fonepay checkout — full-order QR flow. Requires an
// authenticated customer (Bearer token) + Vendor header, both attached
// automatically by the axios-client interceptor. Initiation always uses
// the full order total; never send a client-calculated amount.
// ----------------------------------------------------------------------

// `token` is for a just-created guest order, whose token isn't persisted to storage yet
export const initiateFonepayPayment = async (orderId, token = null) => {
  try {
    const url = endpoints.fonepay.initiate(orderId);
    const response = await clientPoster(
      token ? [url, { headers: { Authorization: `Bearer ${token}` } }] : url,
      {}
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const checkFonepayStatusByPrn = async (prn) => {
  try {
    const response = await clientPoster(endpoints.fonepay.statusByPrn(prn), {});

    return response;
  } catch (error) {
    throw error;
  }
};

export const checkFonepayStatusByOrder = async (orderId) => {
  try {
    const response = await clientPoster(
      endpoints.fonepay.statusByOrder(orderId),
      {}
    );

    return response;
  } catch (error) {
    throw error;
  }
};
