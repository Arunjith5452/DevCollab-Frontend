"use client";

import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { ReactNode, useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useUserStore";
import { logout as logoutApi } from "@/modules/auth/services/auth.api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { user, logout: clearAuth, fetchUser } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await logoutApi();
      clearAuth();
      router.push("/admin/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center space-x-3">
            {/* {actions} */}

            {/* Notification Button */}
            {/* <button
            type="button"
            className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse" />
          </button> */}

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center space-x-3 p-1 pr-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-200"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="text-left flex flex-col justify-center">
                  <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                    {user?.name || user?.email?.split('@')[0] || "Admin"}
                  </p>
                  <p className="text-[10px] font-medium text-teal-600 uppercase tracking-wider leading-none">
                    {user?.role || "Administrator"}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-xs text-gray-500 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative z-10 w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5 ring-8 ring-red-50/50">
              <LogOut className="w-8 h-8 text-red-500 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Ready to leave?</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              You are about to log out of your Admin session.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:text-gray-900 transition-all focus:ring-2 focus:ring-gray-200 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 transition-all focus:ring-2 focus:ring-red-600 focus:outline-none flex items-center justify-center gap-2"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
