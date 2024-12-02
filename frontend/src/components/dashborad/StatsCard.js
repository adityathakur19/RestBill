// StatsCard.js
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({ title, value, change, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {trend && (
          <span className={`${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {change}
        </p>
      </div>
    </div>
  );
};



