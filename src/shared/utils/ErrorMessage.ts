// export function getErrorMessage(err: any): string {
//   const data = err?.response?.data;

//   if (data && typeof data === "object") {
//     if (data.error) return data.error;

//     if (data.message) return data.message;
//   }

//   const status = err?.response?.status;
//   if (status === 404) return "Requested resource not found.";
//   if (status === 500) return "Server error! Please try again later.";

//   return err.message || "Something went wrong. Please try again.";
// }


interface AxiosLikeError {
  response?: {
    data?: {
      error?: string
      message?: string
    };
    status?: number
  };
}

export function getErrorMessage(err: unknown): string {

  if (err != null && typeof err === "object" && "response" in err) {
    const axiosErr = err as AxiosLikeError
    const response = axiosErr.response

    if (response) {
      const data = response.data
      if (data?.error) return data.error
      if (data?.message) return data.message

      const status = response.status
      if (status === 404) return "Requested resource not found"
      if (status === 401) return "Please log in again"
      if (status === 403) return "You don't have permission"
      if (status != null && status >= 500) return "Server error! Please try again later"
    }
  }

  if (err instanceof Error && err.message.toLowerCase().includes("network")) {
    return "No internet connection"
  }

  if (err instanceof Error) {
    return err.message || "Something went wrong"
  }

  return "Something went wrong. Please try again"
}