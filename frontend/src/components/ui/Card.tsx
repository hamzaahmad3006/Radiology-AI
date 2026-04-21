import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const hasPadding = /p-\d|px-\d|py-\d|pb-\d|pt-\d|pl-\d|pr-\d/.test(className);
  return (
    <div className={`glass rounded-2xl shadow-xl ${!hasPadding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
