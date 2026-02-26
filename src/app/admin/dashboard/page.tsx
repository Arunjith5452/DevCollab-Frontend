"use client"

import { Dashboard } from '../../../modules/admin/components/dashboard'
import AdminRouteGuard from '@/shared/common/guards/AdminRouteGuard'

export default function AdminDashboard() {
    return (
        <AdminRouteGuard>
            <Dashboard />
        </AdminRouteGuard>
    )
}