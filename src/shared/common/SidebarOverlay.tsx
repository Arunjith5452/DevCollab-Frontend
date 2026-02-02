"use client";

interface SidebarOverlayProps {
    isOpen: boolean;
    onClick: () => void;
}

export function SidebarOverlay({ isOpen, onClick }: SidebarOverlayProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 animate-fadeIn"
            onClick={onClick}
            aria-hidden="true"
        />
    );
}
