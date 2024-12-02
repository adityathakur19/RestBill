import React, { useState } from "react";

const KOT = () => {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [activeFilter, setActiveFilter] = useState("Today");

  const filters = ["Today", "7 Days", "30 Days", "Month", "Year", "Custom"];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    // Handle filter logic here
  };

  return (
    <div className="h-screen bg-gray-100">
      <header className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <button className="text-xl">&#8592;</button>
        <h1 className="text-lg font-semibold">KOT List</h1>
        <span>Total Count: 0</span>
        <span className="text-sm">Last Sync at {new Date().toLocaleString()}</span>
      </header>

      <div className="p-4">
        {/* Filters */}
        <div className="flex items-center space-x-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 border rounded-md ${
                activeFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Date Inputs */}
        {activeFilter === "Custom" && (
          <div className="mt-4 flex space-x-4">
            <div>
              <label className="block text-sm font-medium">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex justify-center items-center h-96 bg-gray-50 text-gray-500">
        No Data Available
      </div>
    </div>
  );
};

export default KOT;
