"use client";

import { Calendar, Clipboard, Home, MessageSquare, Bell, ArrowLeft, Code } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSidebar } from '@/shared/hooks/useSidebar';
import { MobileMenuButton } from '@/shared/common/MobileMenuButton';
import { SidebarOverlay } from '@/shared/common/SidebarOverlay';

interface SidebarProps {
    activeItem?: string;
}

export default function ContributorSidebar({ activeItem = 'dashboard' }: SidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    const { isOpen, isMobile, toggle, close } = useSidebar();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, href: '/contributor-dashboard', includeTab: false },
        { id: 'tasks', label: 'Tasks', icon: <Clipboard size={20} />, href: '/contributor-tasks', includeTab: true },
        { id: 'meetings', label: 'Meetings', icon: <Calendar size={20} />, href: '/contributor-meetings', includeTab: false },
        // { id: 'chat', label: 'Chat', icon: <MessageSquare size={20} />, href: '/contributor-chat', includeTab: false },
    ];

    const handleNavigation = (href: string, includeTab: boolean = false) => {
        if (projectId) {
            const tabParam = includeTab ? '&tab=todo' : '';
            router.push(`${href}?projectId=${projectId}${tabParam}`);
        } else {
            router.push(href);
        }
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
                    w-64 bg-white border-r border-[#e6f4f2] flex flex-col min-h-screen
                    fixed md:static inset-y-0 left-0 z-40
                    transform transition-transform duration-300 ease-in-out
                    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[#e6f4f2]">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Code className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[#0c1d1a] font-bold text-lg">DevCollab</span>
                </div>
                {/* Navigation */}
                <nav className="flex-1 py-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.href, item.includeTab)}
                            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${activeItem === item.id
                                ? 'text-[#006b5b] bg-[#e6f4f2]'
                                : 'text-[#6b7280] hover:bg-[#f8fcfb] hover:text-[#0c1d1a]'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="border-t border-[#e6f4f2]">
                    {/* Back to Home Button */}
                    <button
                        onClick={() => {
                            router.push('/home');
                            if (isMobile) close();
                        }}
                        className="w-full flex items-center gap-2 px-6 py-4 text-[#006b5b] text-sm font-medium hover:bg-[#f8fcfb] transition-colors border-b border-[#e6f4f2]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </button>

                    {/* Notifications */}
                    <div className="px-6 py-4">
                        <button className="flex items-center gap-2 text-[#6b7280] text-sm hover:text-[#0c1d1a] transition-colors">
                            <Bell className="w-5 h-5" />
                            Notifications
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}