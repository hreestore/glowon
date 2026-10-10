// ----------------------------------------------------------------------

// Collects every string message from an API validation payload such as
// { data: { customization: ["Insufficient stock for ..."] } }.
export function getValidationMessages(error) {
  const source = [error?.data, error?.errors, error?.message].find(
    (value) => value && typeof value === "object"
  );
  if (!source) return [];

  return Object.values(source)
    .flat()
    .filter((msg) => typeof msg === "string" && msg.trim());
}

// Turns an API error into a user-facing message, preferring the specific
// validation messages over a generic "Validation failed".
export function getErrorMessage(error, fallback = "Something went wrong! Please try again.") {
  const messages = getValidationMessages(error);
  if (messages.length) return messages.join(" ");

  if (typeof error === "string" && error.trim()) return error;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;

  return fallback;
}
