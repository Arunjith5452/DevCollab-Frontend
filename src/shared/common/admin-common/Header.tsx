"use client";

import { Bell, User } from "lucide-react";
import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-3">
          {actions}

          {/* Notification Button */}
          <button
            type="button"
            className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse" />
          </button>

          {/* User Icon */}
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg transition-all">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
