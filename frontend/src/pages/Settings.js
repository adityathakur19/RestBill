// Example for Settings.js - apply same pattern to other components
import React from 'react';
import { ActionButton } from '../components/common/ActionButton';
import { Users } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings Management</h1>
        <ActionButton icon={Users}>Add New Settings</ActionButton>
      </div>
      {/* Add your party management content here */}
    </div>
  );
};

export default Settings;

// Do the same for other components:
// KOT.js, Estimate.js, Sale.js, Purchase.js, Expense.js, MoneyIn.js, MoneyOut.js, Settings.js
// Change 'export const ComponentName' to 'export default ComponentName'