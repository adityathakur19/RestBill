// StatusBadge.js
const StatusBadge = ({ status, text }) => {
    const statusClasses = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
    };
  
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
        {text}
      </span>
    );
  };
  
  export default StatusBadge;
  