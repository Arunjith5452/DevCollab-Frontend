"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Bell, Code, Menu, Search, X, LogOut, User,
  ChevronDown, Loader2, Sparkles
} from 'lucide-react';
import { useAuthStore, useUser } from '@/store/useUserStore';
import { logout as logoutApi } from "@/modules/auth/services/auth.api"
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/shared/utils/ErrorMessage';

interface NavLink { label: string; href: string; }
interface HeaderProps {
  navLinks?: NavLink[];
  showSearch?: boolean;
  showNotifications?: boolean;
  className?: string;
}

export function Header({
  navLinks = [
    { label: 'Home', href: '/home' },
    { label: 'Project', href: '/project-list' },
    { label: 'Create Project', href: '/create-project' }
  ],
  showSearch = true,
  showNotifications = true,
  className = '',
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const user = useUser()
  const fetchUser = useAuthStore((state) => state.fetchUser)
  const storeLogout = useAuthStore((state) => state.logout)

  const isPro = user?.subscription?.status === 'active' && !['free', 'free tier', 'free plan', 'basic'].includes(user?.subscription?.plan?.toLowerCase() || '');

  useEffect(() => {
    const loadUser = async () => {
      if (user) {
        // User already loaded from persisted store — no network call needed
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        await fetchUser();
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const active = (href: string) => pathname === href;

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      setLoggingOut(true);
      storeLogout();
      await logoutApi();
      toast.success('Logged out');
      router.push('/login');
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-sm'
          } ${className}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <button
              onClick={() => router.push('/home')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DevCollab</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`font-medium transition-colors ${active(l.href) ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                    }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoading ? (
                <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 hover:bg-gray-100/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 group"
                    aria-label="User menu"
                  >
                    {/* Avatar with Pro ring */}
                    <div className="relative flex-shrink-0">
                      {isPro ? (
                        <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-500 shadow-sm">
                          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white flex items-center justify-center text-sm font-semibold text-gray-700">
                            {user.profileImage
                              ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                              : user.name.charAt(0).toUpperCase()
                            }
                          </div>
                          {/* Elegant small pro badge */}
                          <div className="absolute -bottom-1 -right-1 flex h-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 border-[1.5px] border-white shadow-sm">
                            <span className="text-[8px] font-bold text-white tracking-wider">PRO</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-sm">
                          {user.profileImage
                            ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                            : user.name.charAt(0).toUpperCase()
                          }
                        </div>
                      )}
                    </div>

                    {/* Name section */}
                    <div className="hidden md:flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-700">
                        {user.name}
                      </span>
                    </div>
                    <ChevronDown className={`hidden md:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden" style={{ animation: 'fadeSlideDown 0.15s ease' }}>
                      {/* Dropdown header */}
                      {isPro ? (
                        <div className="mx-2 mb-2 rounded-xl px-3 py-3 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {user.profileImage
                                ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                : user.name.charAt(0).toUpperCase()
                              }
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2 bg-amber-500/20 border border-amber-400/30 rounded-lg px-2 py-1">
                            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <span className="text-xs font-semibold text-amber-300 tracking-wide">PRO MEMBER</span>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-3 border-b border-gray-100 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <Link href="/subscription" className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                            <Sparkles className="w-3 h-3" />
                            Upgrade to Pro
                          </Link>
                        </div>
                      )}

                      <Link
                        href="/user-profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">View Profile</span>
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        disabled={loggingOut}
                        className="flex w-full items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                        <span className="text-sm font-medium">
                          {loggingOut ? 'Logging out...' : 'Logout'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => router.push('/login')}
                    className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-3">
                {navLinks.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${active(l.href)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                      }`}
                  >
                    {l.label}
                  </Link>
                ))}

                {/* Mobile Auth */}
                {isLoading ? (
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                ) : user ? (
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <button
                      onClick={() => setDropdownOpen(v => !v)}
                      className="flex w-full items-center justify-between px-4 py-2 text-gray-800"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          {isPro ? (
                            <div className="relative w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-500 shadow-sm">
                              <div className="w-full h-full rounded-full overflow-hidden border-[1.5px] border-white bg-white flex items-center justify-center text-gray-700 text-sm font-semibold">
                                {user.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 flex h-3.5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1 border-[1.5px] border-white shadow-sm">
                                <span className="text-[7px] font-bold text-white tracking-wider">PRO</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="mt-2 space-y-1 px-4">
                        {!isPro && (
                          <Link href="/subscription" onClick={() => setMobileOpen(false)} className="block text-center text-xs font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 py-2 rounded-lg mb-3">
                            Upgrade to Pro
                          </Link>
                        )}
                        <Link
                          href="/user-profile"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center space-x-2 py-2 text-gray-700 hover:text-green-600"
                        >
                          <User className="w-4 h-4" />
                          <span>View Profile</span>
                        </Link>
                        <button
                          onClick={handleLogoutClick}
                          disabled={loggingOut}
                          className="flex w-full items-center space-x-2 py-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                          <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-3 mt-3 border-t border-gray-200">
                    <button
                      onClick={() => { router.push('/login'); setMobileOpen(false); }}
                      className="w-full py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { router.push('/register'); setMobileOpen(false); }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
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
              You are about to log out of your DevCollab account.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:text-gray-900 transition-all focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={loggingOut}
                className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 transition-all focus:ring-2 focus:ring-red-600 focus:outline-none disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {loggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {loggingOut ? 'Logging out...' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}