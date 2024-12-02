// Card.js
import React from 'react';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-gray-100 border-b px-6 py-4 font-medium ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 className={`text-lg font-bold ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-gray-100 border-t px-6 py-4 flex justify-end ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;