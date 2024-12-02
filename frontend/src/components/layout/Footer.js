import React from 'react';

const Footer = () => {
  return (
    <footer className="h-12 bg-white border-t flex items-center justify-between px-6">
      <div className="text-sm text-gray-500">
         {new Date().getFullYear()} Restaurant Manager.
      </div>
      <div className="text-sm text-gray-500">
        Testing
      </div>
    </footer>
  );
};

export default Footer;