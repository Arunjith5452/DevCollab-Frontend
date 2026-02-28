import { AdminLoginPage } from "@/modules/auth/components/admin/login-page";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Admin login page.
 *
 * Server-side: If ANY token exists, we decode the role from the JWT payload.
 * - Admin token   → redirect to /admin/dashboard
 * - Non-admin token → redirect to /home (they are a regular user)
 * - No token       → show the login form
 */
function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );
    return payload;
  } catch {
    return null;
  }
}

export default async function AdminLoginRoute() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const token = accessToken || refreshToken;

  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload?.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/home");
    }
  }

  return <AdminLoginPage />;
}