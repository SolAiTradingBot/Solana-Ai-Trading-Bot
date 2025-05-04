import React, { useState } from 'react';
import { TrendingUp, Settings, Zap, Gauge, Activity, ArrowDownUp, AlertTriangle, Info } from 'lucide-react';
import ActivityLog from '../components/ActivityLog';

const ScalpingBot: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState('volatility');
  const [settings, setSettings] = useState({
    tradeSize: '0.5',
    maxTrades: '10',
    profitTarget: '0.3',
    stopLoss: '0.15',
    interval: '1',
    volatilityThreshold: '2.5'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const handleActivate = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="glass-panel solana-gradient-border">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <TrendingUp size={20} className="text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold">Scalping Bot</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-400/20 text-green-400' : 'bg-gray-600 text-gray-300'}`}>
                <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'} mr-1.5 animate-pulse`}></span>
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <button 
                onClick={handleActivate}
                className={`solana-button text-sm py-1 px-3 ${isActive ? 'bg-red-500 hover:bg-red-600' : ''}`}
              >
                {isActive ? 'Stop Bot' : 'Start Bot'}
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Info size={16} className="text-blue-400 mr-2" />
              <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">Bu sayfa main.py ile entegre çalışabilir</span>
            </div>
            <div className="mb-6">
              <h3 className="text-md font-medium mb-4 flex items-center">
                <Settings size={16} className="text-gray-400 mr-2" />
                Strategy Selection
              </h3>
              <div className="flex space-x-4 mb-6">
                <button
                  className={`p-4 rounded-lg flex-1 flex flex-col items-center ${
                    activeStrategy === 'volatility' 
                      ? 'bg-[var(--solana-purple)] bg-opacity-20 border border-[var(--solana-purple)]' 
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                  onClick={() => setActiveStrategy('volatility')}
                >
                  <Activity size={24} className={`mb-2 ${activeStrategy === 'volatility' ? 'text-[var(--solana-purple)]' : 'text-gray-400'}`} />
                  <h4 className="font-medium">Volatility</h4>
                  <p className="text-xs text-gray-400 mt-1 text-center">Trade on rapid price movements</p>
                </button>
                
                <button
                  className={`p-4 rounded-lg flex-1 flex flex-col items-center ${
                    activeStrategy === 'range' 
                      ? 'bg-[var(--solana-purple)] bg-opacity-20 border border-[var(--solana-purple)]' 
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                  onClick={() => setActiveStrategy('range')}
                >
                  <ArrowDownUp size={24} className={`mb-2 ${activeStrategy === 'range' ? 'text-[var(--solana-purple)]' : 'text-gray-400'}`} />
                  <h4 className="font-medium">Range</h4>
                  <p className="text-xs text-gray-400 mt-1 text-center">Trade within defined price ranges</p>
                </button>
                
                <button
                  className={`p-4 rounded-lg flex-1 flex flex-col items-center ${
                    activeStrategy === 'momentum' 
                      ? 'bg-[var(--solana-purple)] bg-opacity-20 border border-[var(--solana-purple)]' 
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                  onClick={() => setActiveStrategy('momentum')}
                >
                  <Gauge size={24} className={`mb-2 ${activeStrategy === 'momentum' ? 'text-[var(--solana-purple)]' : 'text-gray-400'}`} />
                  <h4 className="font-medium">Momentum</h4>
                  <p className="text-xs text-gray-400 mt-1 text-center">Follow short-term price trends</p>
                </button>
              </div>
            </div>
            
            <div className="bg-[var(--bg-dark)] p-4 rounded-lg mb-6">
              <h3 className="text-md font-medium mb-4 flex items-center">
                <Zap size={16} className="text-yellow-400 mr-2" />
                General Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Trade Size (SOL)</label>
                  <input 
                    type="text" 
                    name="tradeSize"
                    className="solana-input"
                    value={settings.tradeSize}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-400">Amount per individual trade</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Max Concurrent Trades</label>
                  <input 
                    type="text" 
                    name="maxTrades"
                    className="solana-input"
                    value={settings.maxTrades}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-400">Maximum number of open trades</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Profit Target (%)</label>
                  <input 
                    type="text" 
                    name="profitTarget"
                    className="solana-input"
                    value={settings.profitTarget}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-400">Close trade at this profit percentage</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stop Loss (%)</label>
                  <input 
                    type="text" 
                    name="stopLoss"
                    className="solana-input"
                    value={settings.stopLoss}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-400">Close trade at this loss percentage</p>
                </div>
              </div>
            </div>
            
            {activeStrategy === 'volatility' && (
              <div className="bg-[var(--bg-dark)] p-4 rounded-lg mb-6">
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <Activity size={16} className="text-blue-400 mr-2" />
                  Volatility Strategy Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Timeframe (minutes)</label>
                    <input 
                      type="text" 
                      name="interval"
                      className="solana-input"
                      value={settings.interval}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-xs text-gray-400">Candle interval for volatility analysis</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Volatility Threshold (%)</label>
                    <input 
                      type="text" 
                      name="volatilityThreshold"
                      className="solana-input"
                      value={settings.volatilityThreshold}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-xs text-gray-400">Minimum volatility to trigger trades</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeStrategy === 'range' && (
              <div className="bg-[var(--bg-dark)] p-4 rounded-lg mb-6">
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <ArrowDownUp size={16} className="text-purple-400 mr-2" />
                  Range Strategy Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Upper Bound (%)</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="1.5"
                    />
                    <p className="mt-1 text-xs text-gray-400">Sell when price reaches this percentage above baseline</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Lower Bound (%)</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="1.5"
                    />
                    <p className="mt-1 text-xs text-gray-400">Buy when price reaches this percentage below baseline</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Range Calculation Period (hours)</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="4"
                    />
                    <p className="mt-1 text-xs text-gray-400">Time period to determine price range</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeStrategy === 'momentum' && (
              <div className="bg-[var(--bg-dark)] p-4 rounded-lg mb-6">
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <Gauge size={16} className="text-green-400 mr-2" />
                  Momentum Strategy Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">RSI Period</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="14"
                    />
                    <p className="mt-1 text-xs text-gray-400">Period for RSI calculation</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">RSI Overbought</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="70"
                    />
                    <p className="mt-1 text-xs text-gray-400">RSI level to consider selling</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">RSI Oversold</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="30"
                    />
                    <p className="mt-1 text-xs text-gray-400">RSI level to consider buying</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Confirmation Candles</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="2"
                    />
                    <p className="mt-1 text-xs text-gray-400">Minimum candles to confirm trend</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-yellow-500/10 border border-yellow-600/30 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400">Risk Warning</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Scalping involves rapid trading with small profit targets. This strategy can be profitable but carries 
                    significant risks including slippage, network congestion, and market volatility.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="solana-button bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1" onClick={() => alert('main.py çalıştırılacak (örnek)')}>main.py Çalıştır</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-panel h-[700px]">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Scalping Activity</h2>
        </div>
        <div className="p-4 h-[calc(100%-61px)]">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default ScalpingBot;