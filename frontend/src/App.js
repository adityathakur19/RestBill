import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Authentication
import Login from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Dashboard from './pages/Dashboard/Dashboard';
import GenerateBillPage from './pages/Table/GenerateBillPage';
import BillHistory from './pages/Table/BillHistory';


import Sales from './pages/Dashboard/Sales';
import Table from './pages/Table/Table';
import Party from './pages/Table/Party';
import Item from './pages/Item/Item'; 
import Product from './pages/Item/Product';
import ProductForm from './pages/Item/ProductForm';
import KOT from './pages/KOT/KOT';
import KOTDetails from './pages/KOT/KOTDetails';
import Estimate from './pages/Estimate/Estimate';
import NewEstimate from './pages/Estimate/NewEstimate';
import Sale from './pages/Sales/Sales';
import Report from './pages/Report/Report';
import Settings from './pages/Settings';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  
  useEffect(() => {
    // Keep sync if `localStorage` changes dynamically (optional)
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sales" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Sales />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/table" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Table />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/party" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Party />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/item" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Item />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/product" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Product />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/product/new" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kot" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <KOT />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kotDetails" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <KOTDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/estimate" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Estimate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-estimate" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NewEstimate />
            </ProtectedRoute>
          } 
        />
<Route 
  path="/generate-bill" 
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <GenerateBillPage />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/bill-history" 
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <BillHistory />
    </ProtectedRoute>
  } 
/>
        <Route 
          path="/sale" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Sale />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/report" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Report />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* Redirect to login if no match */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;