// AlertBanner.js
export const AlertBanner = ({ type = 'info', message }) => {
    const types = {
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      error: 'bg-red-50 text-red-800 border-red-200',
      success: 'bg-green-50 text-green-800 border-green-200'
    };
  
    return (
      <div className={`${types[type]} border rounded-lg p-4`}>
        <p className="text-sm">{message}</p>
      </div>
    );
  };