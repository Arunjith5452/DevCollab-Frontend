"use client";

import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-lg p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-95"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
        >
            <div className="relative w-6 h-6">
                <Menu
                    className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                        }`}
                />
                <X
                    className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                        }`}
                />
            </div>
        </button>
    );
}
