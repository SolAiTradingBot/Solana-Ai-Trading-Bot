import React, { useState, useEffect } from 'react';
import './App.css';

// Bot type configurations
const BOT_TYPES = {
  sniper: {
    name: 'Sniper Bot',
    icon: '🎯',
    description: 'Automatically snipe new token launches',
    color: 'from-red-500 to-pink-500'
  },
  copy_trading: {
    name: 'Copy Trading Bot',
    icon: '📊',
    description: 'Follow and copy successful wallets',
    color: 'from-blue-500 to-cyan-500'
  },
  ai_trading: {
    name: 'AI Trading Bot',
    icon: '🤖',
    description: 'AI-powered automated trading decisions',
    color: 'from-purple-500 to-indigo-500'
  },
  arbitrage: {
    name: 'Arbitrage Bot',
    icon: '⚡',
    description: 'Profit from price differences across DEXs',
    color: 'from-yellow-500 to-orange-500'
  },
  dca: {
    name: 'DCA Bot',
    icon: '💰',
    description: 'Dollar Cost Averaging strategy',
    color: 'from-green-500 to-emerald-500'
  },
  volume: {
    name: 'Volume Bot',
    icon: '📈',
    description: 'Automated volume generation',
    color: 'from-teal-500 to-cyan-500'
  },
  liquidity: {
    name: 'Liquidity Bot',
    icon: '💧',
    description: 'Automated liquidity provision',
    color: 'from-indigo-500 to-blue-500'
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bots, setBots] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedBot, setSelectedBot] = useState(null);
  const [showCreateBot, setShowCreateBot] = useState(false);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    fetchDashboardStats();
    fetchBots();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats/dashboard`);
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchBots = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bots`);
      const data = await response.json();
      setBots(data);
    } catch (error) {
      console.error('Error fetching bots:', error);
    }
  };

  const connectWallet = async () => {
    try {
      // Mock wallet connection for now
      setWalletConnected(true);
      setWalletAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const createBot = async (botData) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/bots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...botData,
          wallet_address: walletAddress
        })
      });
      
      if (response.ok) {
        await fetchBots();
        setShowCreateBot(false);
        console.log('Bot created successfully!');
      } else {
        const error = await response.json();
        alert(`Error creating bot: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating bot:', error);
      alert('An error occurred while creating the bot');
    } finally {
      setLoading(false);
    }
  };

  const toggleBot = async (botId, currentStatus) => {
    try {
      const action = currentStatus === 'active' ? 'stop' : 'start';
      const response = await fetch(`${BACKEND_URL}/api/bots/${botId}/${action}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchBots();
      }
    } catch (error) {
      console.error('Error toggling bot:', error);
    }
  };

  const DashboardCard = ({ title, value, icon, color }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`text-3xl ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const BotCard = ({ bot }) => {
    const botType = BOT_TYPES[bot.bot_type];
    const isActive = bot.status === 'active';
    
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${botType.color} flex items-center justify-center text-white text-xl`}>
              {botType.icon}
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{bot.name}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{botType.name}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          {botType.description}
        </p>
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => toggleBot(bot.id, bot.status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
          
          <button
            onClick={() => setSelectedBot(bot)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Settings
          </button>
        </div>
      </div>
    );
  };

  const CreateBotModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      bot_type: 'sniper',
      config: {}
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        alert('Bot name is required');
        return;
      }
      createBot(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Create New Bot
            </h2>
            <button
              onClick={() => setShowCreateBot(false)}
              className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Bot Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Bot Type
              </label>
              <select
                value={formData.bot_type}
                onChange={(e) => setFormData({ ...formData, bot_type: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {Object.entries(BOT_TYPES).map(([key, bot]) => (
                  <option key={key} value={key}>
                    {bot.icon} {bot.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-3 pt-4 relative z-10">
              <button
                type="button"
                onClick={() => setShowCreateBot(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 relative z-20"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Solana Bot
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
              
              {walletConnected ? (
                <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'bots', label: 'Bots' },
              { key: 'transactions', label: 'Transactions' },
              { key: 'settings', label: 'Settings' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
              <img
                src="https://images.unsplash.com/photo-1660836709423-9e82461f957a"
                alt="Trading Dashboard"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl font-bold mb-4">Solana Trading Bot</h2>
                  <p className="text-xl mb-6">Automate your trading and maximize profits</p>
                  {walletConnected && (
                    <button
                      onClick={() => setShowCreateBot(true)}
                      className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Create New Bot
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Bots"
                value={dashboardStats.total_bots || 0}
                icon="🤖"
                color="text-blue-500"
              />
              <DashboardCard
                title="Active Bots"
                value={dashboardStats.active_bots || 0}
                icon="🚀"
                color="text-green-500"
              />
              <DashboardCard
                title="Total Transactions"
                value={dashboardStats.total_transactions || 0}
                icon="📊"
                color="text-purple-500"
              />
              <DashboardCard
                title="Total Volume"
                value={`$${dashboardStats.total_volume?.toLocaleString() || 0}`}
                icon="💰"
                color="text-yellow-500"
              />
            </div>

            {/* Bot Types Grid */}
            <div>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Bot Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(BOT_TYPES).map(([key, bot]) => (
                  <div
                    key={key}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
                    onClick={() => {
                      if (walletConnected) {
                        setShowCreateBot(true);
                      }
                    }}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${bot.color} flex items-center justify-center text-white text-lg mb-3`}>
                      {bot.icon}
                    </div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                      {bot.name}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {bot.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                My Bots
              </h2>
              {walletConnected && (
                <button
                  onClick={() => setShowCreateBot(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Create New Bot
                </button>
              )}
            </div>

            {bots.length === 0 ? (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-medium mb-2">No bots found</h3>
                <p>Create your first bot to start trading</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bots.map((bot) => (
                  <BotCard key={bot.id} bot={bot} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Transaction History
            </h2>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-medium mb-2">No transactions yet</h3>
                <p>Transactions will appear here when your bots start trading</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h2>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Theme
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setDarkMode(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        !darkMode
                          ? 'bg-blue-500 text-white'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      ☀️ Light Mode
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        darkMode
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      🌙 Dark Mode
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Bot Modal */}
      {showCreateBot && <CreateBotModal />}
    </div>
  );
}

export default App;