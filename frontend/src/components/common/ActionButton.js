// ActionButton.js
export const ActionButton = ({ 
    children, 
    variant = 'primary', 
    size = 'md',
    onClick,
    icon: Icon
  }) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    };
  
    const sizes = {
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    };
  
    return (
      <button
        onClick={onClick}
        className={`
          ${variants[variant]} 
          ${sizes[size]}
          rounded-lg font-medium flex items-center justify-center
          transition-colors duration-200
        `}
      >
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {children}
      </button>
    );
  };