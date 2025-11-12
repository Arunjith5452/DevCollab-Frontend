"use client"

import { useRouter } from "next/navigation"

export function useRoleRedirect() {

    const router = useRouter()

    const redirectByRole = (role: string) => {
        const roleRedirects: Record<string, string> = {
            ADMIN: "/admin/dashboard",
            USER: "/home"
        }
        const redirectPath = roleRedirects[role] || "/home"
        router.push(redirectPath)
    }
    return { redirectByRole }
}