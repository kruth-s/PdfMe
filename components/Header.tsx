import React from 'react';

export const Header = (): React.ReactElement => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2 cursor-default">
               <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5v4h3l-4 5z"/></svg>
              <span className="text-2xl font-bold text-gray-800">
                PDF Suite
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
