import { RegisterPage } from "@/modules/auth/components"
import { cookies } from "next/headers";
import {redirect} from 'next/navigation'
// import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
// import { getQueryClient } from "../get-query-client"
// import axios from "axios"

export default async function register() {

   // const queryClient = getQueryClient()

   // await queryClient.prefetchQuery({
   //    queryKey: ["users"],
   //    queryFn: async () => {
   //       const { data } = await axios.post('http://localhost:3001/api/auth/signup')
   //       return data
   //    },
   // })
   
   const cookieStore = await cookies();
     const accessToken = cookieStore.get("accessToken"); 
   
     if (accessToken) {
       redirect("/home");
     }

   return (
      // <HydrationBoundary state={dehydrate(queryClient)}>
         <RegisterPage />
      // {/* </HydrationBoundary> */}
   )
} 