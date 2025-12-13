
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-100 text-emerald-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-orange-100 text-orange-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}