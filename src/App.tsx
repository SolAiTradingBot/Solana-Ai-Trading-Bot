import React, { useState } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SniperBot from './pages/SniperBot';
import MemeTokenBot from './pages/MemeTokenBot';
import ScalpingBot from './pages/ScalpingBot';
import ArbitrageBot from './pages/ArbitrageBot';
import AutoTrading from './pages/AutoTrading';
import Settings from './pages/Settings';
import Authentication from './pages/Authentication';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={
            !isAuthenticated ? (
              <Authentication onAuthenticate={() => setIsAuthenticated(true)} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/sniper" element={<SniperBot />} />
                  <Route path="/meme-token" element={<MemeTokenBot />} />
                  <Route path="/scalping" element={<ScalpingBot />} />
                  <Route path="/arbitrage" element={<ArbitrageBot />} />
                  <Route path="/auto-trading" element={<AutoTrading />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;