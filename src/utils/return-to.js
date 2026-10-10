import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------
// Send the user back to where they started login (e.g. checkout).
// Only same-site paths are accepted so the param can't be used as an open redirect.
// ----------------------------------------------------------------------

const STORAGE_KEY = "auth_return_to";

export function getSafeReturnTo(value) {
  if (!value || typeof value !== "string") return "";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "";
  // Returning to an auth page would just loop back into login
  if (value.startsWith("/auth")) return "";
  return value;
}

export function signInHrefWithReturnTo(returnTo) {
  const safe = getSafeReturnTo(returnTo);
  return safe ? `${paths.auth.signIn}?returnTo=${encodeURIComponent(safe)}` : paths.auth.signIn;
}

export function getReturnToFromLocation() {
  if (typeof window === "undefined") return "";
  return getSafeReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
}

// Google sign-in leaves the site, so the target is kept in sessionStorage across the round trip
export function rememberReturnTo(returnTo) {
  try {
    const safe = getSafeReturnTo(returnTo);
    if (safe) sessionStorage.setItem(STORAGE_KEY, safe);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable — user just lands on the default page
  }
}

export function consumeReturnTo() {
  try {
    const value = getSafeReturnTo(sessionStorage.getItem(STORAGE_KEY));
    sessionStorage.removeItem(STORAGE_KEY);
    return value;
  } catch {
    return "";
  }
}
