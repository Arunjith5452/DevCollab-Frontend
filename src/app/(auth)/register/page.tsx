import { RegisterPage } from "@/modules/auth/components"
import { cookies } from "next/headers";
import {redirect} from 'next/navigation'


export default async function register() {
   
   const cookieStore = await cookies();
     const accessToken = cookieStore.get("accessToken"); 
   
     if (accessToken) {
       redirect("/home");
     }

   return (
         <RegisterPage />
   )
} 