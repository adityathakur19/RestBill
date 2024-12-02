import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import '../../styles/Report.css';
const Report = () => {
  // State for report configuration
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('today');
  const [chartType, setChartType] = useState('line');
  const [customDateRange, setCustomDateRange] = useState({
    from: null,
    to: null
  });

  // State for report data
  const [reportData, setReportData] = useState([]);
  const [isCustomDatePickerOpen, setIsCustomDatePickerOpen] = useState(false);

  // Fetch report data based on selected parameters
  const fetchReportData = async () => {
    try {
      let endpoint = '';
      switch (reportType) {
        case 'sales':
          endpoint = '/api/sales';
          break;
        case 'purchases':
          endpoint = '/api/purchases';
          break;
        case 'estimates':
          endpoint = '/api/estimates';
          break;
      }

      const response = await fetch(`${endpoint}?range=${dateRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  // Fetch data when report parameters change
  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  // Handle custom date selection
  const handleCustomDateSelect = (type, date) => {
    setCustomDateRange(prev => ({
      ...prev,
      [type]: date
    }));
    
    if (type === 'to' && customDateRange.from) {
      setDateRange('custom');
      setIsCustomDatePickerOpen(false);
    }
  };

  // Render chart based on selected type
  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    const DataComponent = chartType === 'line' ? Line : Bar;

    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <ChartComponent data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <DataComponent 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              fill="#8884d8" 
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="reports-dashboard">
      <div className="reports-header">
        <h1>Reports Dashboard</h1>
      </div>
      
      <div className="reports-controls">
        {/* Report Type Selector */}
        <div className="control-group">
          <label htmlFor="report-type">Report Type</label>
          <select 
            id="report-type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="sales">Sales Report</option>
            <option value="purchases">Purchase Report</option>
            <option value="estimates">Estimate Report</option>
          </select>
        </div>

        {/* Date Range Selector */}
        <div className="control-group">
          <label htmlFor="date-range">Date Range</label>
          <select 
            id="date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Custom Date Picker */}
        {dateRange === 'custom' && (
          <div className="custom-date-picker">
            <div className="date-input">
              <label>From:</label>
              <input 
                type="date" 
                value={customDateRange.from || ''}
                onChange={(e) => handleCustomDateSelect('from', e.target.value)}
              />
            </div>
            <div className="date-input">
              <label>To:</label>
              <input 
                type="date" 
                value={customDateRange.to || ''}
                onChange={(e) => handleCustomDateSelect('to', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Chart Type Selector */}
        <div className="control-group">
          <label htmlFor="chart-type">Chart Type</label>
          <select 
            id="chart-type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>

      {/* Chart Rendering */}
      {renderChart()}
    </div>
  );
};

export default Report;