import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
    } else if (agent.title === 'AI Voice Agent') {
      navigate('/dashboard');
    }
  };

  console.log('Current path:', location.pathname);

  // Normalize path: lowercase and remove trailing slash
  const normalizedPath = location.pathname.toLowerCase().replace(/\/$/, "");
  const isDashboard = normalizedPath.includes('dashboard');

  // DEBUG: Visual indicator of path state - remove after fixing
  // console.log('Current path:', location.pathname, 'Is Dashboard:', isDashboard);

  return (
    <ThemeProvider>
      <div className={isDashboard ? 'bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300' : 'bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300'}>
        {/* Temporary Debug Banner
        <div className="fixed top-0 left-0 bg-red-500 text-white z-[100] text-xs p-1">
          Path: {location.pathname} | isDashboard: {isDashboard.toString()}
        </div> 
        */}
        {!isDashboard && <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/agents" element={<AgentsPage onAgentSelect={handleAgentSelect} />} />
          <Route path="/broadcast" element={<BroadcastPage />} />
          <Route path="/dashboard" element={<SalesDashboard />} />
        </Routes>
        {!isDashboard && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;

