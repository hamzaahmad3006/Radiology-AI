import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-2.5 rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20",
    secondary: "bg-light-blue text-white hover:bg-blue-400 shadow-lg shadow-blue-400/20",
    glass: "glass text-white hover:bg-white/10 border-white/20",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
