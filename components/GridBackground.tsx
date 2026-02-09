import React from 'react';

const GridBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-12 w-full h-full">
      {/* Vertical Lines */}
      <div className="w-px h-full bg-white opacity-[0.03]"></div>
      <div className="w-px h-full bg-white opacity-[0.03] hidden md:block"></div>
      <div className="w-px h-full bg-white opacity-[0.03]"></div>
      <div className="w-px h-full bg-white opacity-[0.03] hidden md:block"></div>
      <div className="w-px h-full bg-white opacity-[0.03]"></div>
    </div>
  );
};

export default GridBackground;
