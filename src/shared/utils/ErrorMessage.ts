export function getErrorMessage(err: any): string {
  const data = err?.response?.data;

  if (data && typeof data === "object") {
    if (data.error) return data.error;

    if (data.message) return data.message;
  }

  const status = err?.response?.status;
  if (status === 404) return "Requested resource not found.";
  if (status === 500) return "Server error! Please try again later.";

  return err.message || "Something went wrong. Please try again.";
}
