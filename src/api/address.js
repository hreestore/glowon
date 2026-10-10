"use client";

import useSWR from "swr";

import { endpoints } from "./endpoints";
import { fetcher } from "@/lib/axios-server";

// import { fetcher } from "@/lib/axios-client";

// Stable fallback: a fresh `[]` each render re-triggers effects that depend on `states`
const EMPTY_STATES = [];

export const useGetStates = () => {
  const { data, error, isLoading } = useSWR(
    endpoints.address.getStates,
    fetcher
  );

  return {
    states: data?.data || EMPTY_STATES,
    error,
    isLoading,
  };
};
