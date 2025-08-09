import React from 'react';

const Spinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'h-8 w-8 border-2',
    default: 'h-16 w-16 border-4',
    large: 'h-24 w-24 border-[6px]'
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[400px]">
      <div className={`
        animate-spin 
        rounded-full 
        border-solid 
        border-yellow-400 
        border-t-transparent 
        ${sizeClasses[size]} 
        ${className}
      `}>
      </div>
    </div>
  );
};

export default Spinner; 