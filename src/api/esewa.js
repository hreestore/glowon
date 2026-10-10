"use client";

import { endpoints } from "./endpoints";

import { poster as clientPoster } from "@/lib/axios-client";

// ----------------------------------------------------------------------
// Customer eSewa checkout — full-order redirect flow.
// Requires an authenticated customer (Bearer token) + Vendor header,
// both attached automatically by the axios-client interceptor.
// ----------------------------------------------------------------------

// `token` is for a just-created guest order, whose token isn't persisted to storage yet
export const initiateEsewaPayment = async (orderId, token = null) => {
  try {
    const url = endpoints.esewa.initiate(orderId);
    const response = await clientPoster(
      token ? [url, { headers: { Authorization: `Bearer ${token}` } }] : url,
      {}
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const checkEsewaStatusByUuid = async (transactionUuid) => {
  try {
    const response = await clientPoster(
      endpoints.esewa.statusByUuid(transactionUuid),
      {}
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const checkEsewaStatusByOrder = async (orderId) => {
  try {
    const response = await clientPoster(
      endpoints.esewa.statusByOrder(orderId),
      {}
    );

    return response;
  } catch (error) {
    throw error;
  }
};
