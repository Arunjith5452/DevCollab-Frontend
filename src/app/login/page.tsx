import { LoginPage } from "@/modules/auth/components/login-page"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Login() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken"); 

  if (accessToken) {
    redirect("/home");
  }

  return <LoginPage />;
}
