'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    onClick?: () => void;
    label?: string;
    className?: string;
}

export function BackButton({ onClick, label = 'Back', className = '' }: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`inline-flex items-center gap-2 px-0 py-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors duration-200 group ${className}`}
            aria-label={label}
        >
            <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="font-medium text-sm">{label}</span>
        </button>
    );
}
