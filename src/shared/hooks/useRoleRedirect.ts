"use client"

import { useRouter } from "next/router"

export function useRoleRedirect() {

    const router = useRouter()

    const redirectByRole = (role: string) => {
        const roleRedirects: Record<string, string> = {
            ADMIN: "/admin",
            USER: "/"
        }
        const redirectPath = roleRedirects[role] || "/"
        router.push(redirectPath)
    }
    return { redirectByRole }
}