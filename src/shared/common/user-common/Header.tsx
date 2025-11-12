
"use client"
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Code, Menu, Search, X } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  navLinks?: NavLink[];
  showAuth?: boolean;
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
  showAuth = true,
  showSearch = true,
  showNotifications = true,
  className = ''
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveLink = (href: string): boolean => {
    return pathname === href;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-sm'
    } ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => router.push('/')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DevCollab</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isActiveLink(link.href)
                    ? 'text-green-600'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {link.label}
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
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-600 rounded-full"></span>
              </button>
            )}
            
            {showAuth && (
              <>
                <button 
                  onClick={() => router.push('/upgrade')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Upgrade to Pro
                </button>
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md"
                  aria-label="User profile"
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                    isActiveLink(link.href)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {showAuth && (
                <button 
                  onClick={() => {
                    router.push('/upgrade');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold mt-4 hover:shadow-lg transition-all"
                >
                  Upgrade to Pro
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}