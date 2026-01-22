import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AgentsPage from './pages/AgentsPage';
import BroadcastPage from './pages/BroadcastPage';
import SalesDashboard from './pages/SalesDashboard';
import './index.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAgentSelect = (agent) => {
    if (agent.title === 'Social Media Automation') {
      navigate('/broadcast');
    }
  };

  // Hide global navbar on dashboard
  const showNavbar = location.pathname !== '/dashboard';

  return (
    <div className={location.pathname === '/dashboard' ? 'bg-slate-900 min-h-screen' : 'bg-gray-50 min-h-screen'}>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agents" element={<AgentsPage onAgentSelect={handleAgentSelect} />} />
        <Route path="/broadcast" element={<BroadcastPage />} />
        <Route path="/dashboard" element={<SalesDashboard />} />
      </Routes>
    </div>
  );
}

export default App;

