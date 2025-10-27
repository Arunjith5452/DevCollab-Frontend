export function getErrorMessage(err: any): string {
  const data = err?.response?.data;

  if (typeof data === "string") return data;

  if (typeof data === "object") {
    return (
      data.message ||
      Object.values(data)[0] || 
      "Something went wrong"
    );
  }

  return "Something went wrong";
}
