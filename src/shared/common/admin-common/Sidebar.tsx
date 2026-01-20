"use client";

import { Activity, Code, DollarSign, Folder, Home, Settings, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeItem?: string;
}

export function Sidebar({ activeItem }: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null, href: '/admin/dashboard' },
    { id: 'users', icon: Users, label: 'Users', badge: '1.2K', href: '/admin/userManagement' },
    { id: 'projects', icon: Folder, label: 'Projects', badge: '567', href: '/admin/projectManagement' },
    { id: 'revenue', icon: DollarSign, label: 'Revenue', badge: null, href: '#' },
    { id: 'analytics', icon: Activity, label: 'Analytics', badge: null, href: '#' },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null, href: '#' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
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
                onClick={() => router.push(item.href)}
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
  );
}
