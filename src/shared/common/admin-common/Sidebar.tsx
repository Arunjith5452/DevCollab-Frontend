"use client";

import { useEffect, useState } from "react";
import { Activity, Code, DollarSign, Folder, Home, Settings, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/shared/hooks/useSidebar";
import { MobileMenuButton } from "@/shared/common/MobileMenuButton";
import { SidebarOverlay } from "@/shared/common/SidebarOverlay";
import { getDashboardStats } from "@/modules/admin/services/admin.api";

interface SidebarProps {
  activeItem?: string;
}

export function Sidebar({ activeItem }: SidebarProps) {
  const router = useRouter();
  const { isOpen, isMobile, toggle, close } = useSidebar();
  const [counts, setCounts] = useState({ users: 0, projects: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await getDashboardStats();
        // Handle different response structures gracefully
        const data = response?.data?.stats || response?.stats || response?.data || response;

        setCounts({
          users: data?.totalUsers || 0,
          projects: data?.totalProjects || 0
        });
      } catch (error) {
        console.error("Failed to fetch sidebar counts", error);
      }
    };
    fetchCounts();
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null, href: '/admin/dashboard' },
    { id: 'users', icon: Users, label: 'Users', badge: counts.users > 0 ? counts.users.toString() : null, href: '/admin/userManagement' },
    { id: 'projects', icon: Folder, label: 'Projects', badge: counts.projects > 0 ? counts.projects.toString() : null, href: '/admin/projectManagement' },
    { id: 'revenue', icon: DollarSign, label: 'Revenue', badge: null, href: '#' },
    { id: 'analytics', icon: Activity, label: 'Analytics', badge: null, href: '#' },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null, href: '#' },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile) {
      close();
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && <MobileMenuButton isOpen={isOpen} onClick={toggle} />}

      {/* Overlay */}
      <SidebarOverlay isOpen={isOpen} onClick={close} />

      {/* Sidebar */}
      <aside
        className={`
          w-72 bg-white border-r border-gray-200 flex flex-col
          fixed md:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">DevCollab</span>
              <p className="text-xs text-gray-500 mt-0.5">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <div className="space-y-1 mb-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${isActive
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className={isActive ? 'font-semibold' : 'font-medium'}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-700 group-hover:bg-teal-200 group-hover:text-teal-700'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
