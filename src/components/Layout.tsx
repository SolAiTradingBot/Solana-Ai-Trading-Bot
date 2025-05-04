import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bot, 
  LayoutDashboard, 
  Crosshair, 
  Rocket, 
  TrendingUp, 
  Repeat, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Brain, 
  ChevronRight 
} from 'lucide-react';
import StatusBar from './StatusBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Sniper', path: '/sniper', icon: <Crosshair size={20} /> },
    { name: 'Meme Token', path: '/meme-token', icon: <Rocket size={20} /> },
    { name: 'Scalping', path: '/scalping', icon: <TrendingUp size={20} /> },
    { name: 'Arbitrage', path: '/arbitrage', icon: <Repeat size={20} /> },
    { name: 'Auto Trading', path: '/auto-trading', icon: <Brain size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // In a real app, this would handle authentication logout
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-[var(--bg-dark)] text-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <div 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[var(--bg-card)] hidden md:block transition-all duration-300 ease-in-out h-full`}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            <Bot className="text-[var(--solana-purple)] mr-2" size={24} />
            {sidebarOpen && <h1 className="text-xl font-bold solana-gradient-text">SolanaBot</h1>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-gray-400 hover:text-white"
          >
            <ChevronRight size={20} className={`transition-transform duration-300 ${!sidebarOpen && 'rotate-180'}`} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-[var(--solana-purple)] to-[var(--solana-green)] text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[var(--bg-dark)] z-10 md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center p-4 h-16 border-b border-gray-700">
              <Bot className="text-[var(--solana-purple)] mr-2" size={24} />
              <h1 className="text-xl font-bold solana-gradient-text">SolanaBot</h1>
            </div>
            <nav className="p-4 flex-grow">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigate(item.path)}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                        location.pathname === item.path 
                          ? 'bg-gradient-to-r from-[var(--solana-purple)] to-[var(--solana-green)] text-white' 
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <StatusBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;