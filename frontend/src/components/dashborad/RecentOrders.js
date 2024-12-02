// RecentOrders.js
import StatusBadge from './StatusBadge'; // Import StatusBadge component

export const RecentOrders = () => {
  const orders = [
    { id: 1, table: 'Table 5', items: 4, total: '₹1,200', status: 'Preparing' },
    { id: 2, table: 'Table 2', items: 2, total: '₹450', status: 'Served' },
    { id: 3, table: 'Table 8', items: 6, total: '₹2,100', status: 'Pending' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Table
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.table}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.items} items
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge 
                  status={
                    order.status === 'Served' ? 'success' :
                    order.status === 'Preparing' ? 'warning' : 'info'
                  } 
                  text={order.status} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
