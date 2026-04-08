'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-accent text-accent-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-transparent border border-border text-text-primary hover:bg-bg-tertiary hover:border-border-light',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
    icon: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary p-2',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${variant !== 'icon' ? sizeClasses[size] : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
