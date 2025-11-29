"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bell, Code, Menu, Search, X, LogOut, User,
  ChevronDown, Loader2
} from 'lucide-react';

interface NavLink { label: string; href: string; }
interface HeaderProps {
  navLinks?: NavLink[];
  showSearch?: boolean;
  showNotifications?: boolean;
  className?: string;
  /** Pass user if logged in, null if not */
  user?: { name: string; avatar?: string } | null;
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
  user = null // <-- null = not logged in
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click outside to close dropdown
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

  const logout = async () => {
    if (!confirm('Are you sure you want to log out?')) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error(err);
      alert('Logout failed');
    } finally {
      setLoggingOut(false);
      setDropdownOpen(false);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-sm'
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
              <a
                key={l.href}
                href={l.href}
                className={`font-medium transition-colors ${
                  active(l.href) ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">

            {showSearch && (
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
            )}

            {showNotifications && (
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-600 rounded-full" />
              </button>
            )}

            {/* === AUTH STATE === */}
            {user ? (
              /* LOGGED IN: Profile Dropdown */
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center space-x-2 rounded-full pr-3 pl-1 py-1 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <a
                      href="/user-profile"
                      className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">View Profile</span>
                    </a>
                    <button
                      onClick={logout}
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
              /* NOT LOGGED IN: Sign In + Sign Up */
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/login')}
                  className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/signup')}
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
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    active(l.href)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  {l.label}
                </a>
              ))}

              {/* Mobile Auth */}
              {user ? (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className="flex w-full items-center justify-between px-4 py-2 text-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="mt-2 space-y-1 px-4">
                      <a
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center space-x-2 py-2 text-gray-700 hover:text-green-600"
                      >
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </a>
                      <button
                        onClick={logout}
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
                    onClick={() => { router.push('/signup'); setMobileOpen(false); }}
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
  );
}