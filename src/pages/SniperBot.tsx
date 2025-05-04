import React, { useState } from 'react';
import { Crosshair, Timer, DollarSign, Percent, AlertTriangle, ChevronDown, ChevronUp, Zap, Info } from 'lucide-react';
import ActivityLog from '../components/ActivityLog';

const SniperBot: React.FC = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [botConfig, setBotConfig] = useState({
    maxPrice: '0.005',
    gasMultiplier: '1.5',
    autoSell: true,
    autoSellMultiplier: '2.5',
    slippageTolerance: '2',
    stopLoss: '20'
  });
  
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBotConfig({
      ...botConfig,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleToggleBot = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="glass-panel solana-gradient-border">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <Crosshair size={20} className="text-red-400 mr-2" />
              <h2 className="text-lg font-semibold">Sniper Bot</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-400/20 text-green-400' : 'bg-gray-600 text-gray-300'}`}>
                <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'} mr-1.5 animate-pulse`}></span>
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <button 
                onClick={handleToggleBot}
                className={`solana-button text-sm py-1 px-3 ${isActive ? 'bg-red-500 hover:bg-red-600' : ''}`}
              >
                {isActive ? 'Stop Bot' : 'Start Bot'}
              </button>
            </div>
          </div>
          
          <div>
            <div className="p-4 border-b border-gray-700">
              <button 
                className="flex items-center justify-between w-full text-left"
                onClick={() => setIsConfigOpen(!isConfigOpen)}
              >
                <h3 className="text-md font-medium flex items-center">
                  <Zap size={16} className="text-yellow-400 mr-2" />
                  Bot Configuration
                </h3>
                {isConfigOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {isConfigOpen && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Max Entry Price (SOL)</label>
                    <input 
                      type="text" 
                      name="maxPrice"
                      value={botConfig.maxPrice}
                      onChange={handleConfigChange}
                      className="solana-input"
                    />
                    <p className="mt-1 text-xs text-gray-400">Maximum price to pay per token</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Gas Multiplier</label>
                    <input 
                      type="text" 
                      name="gasMultiplier"
                      value={botConfig.gasMultiplier}
                      onChange={handleConfigChange}
                      className="solana-input"
                    />
                    <p className="mt-1 text-xs text-gray-400">Higher values may increase success rate</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Slippage Tolerance (%)</label>
                    <input 
                      type="text" 
                      name="slippageTolerance"
                      value={botConfig.slippageTolerance}
                      onChange={handleConfigChange}
                      className="solana-input"
                    />
                    <p className="mt-1 text-xs text-gray-400">Maximum allowed price impact</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Stop Loss (%)</label>
                    <input 
                      type="text" 
                      name="stopLoss"
                      value={botConfig.stopLoss}
                      onChange={handleConfigChange}
                      className="solana-input"
                    />
                    <p className="mt-1 text-xs text-gray-400">Automatically sell if price drops by this %</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          name="autoSell"
                          checked={botConfig.autoSell}
                          onChange={handleConfigChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className="ml-3 text-sm font-medium text-gray-300">Auto-Sell on Profit Target</span>
                    </div>
                  </div>
                  
                  {botConfig.autoSell && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Profit Target Multiplier</label>
                      <input 
                        type="text" 
                        name="autoSellMultiplier"
                        value={botConfig.autoSellMultiplier}
                        onChange={handleConfigChange}
                        className="solana-input"
                      />
                      <p className="mt-1 text-xs text-gray-400">Sell when price reaches this multiple of entry</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-md font-medium flex items-center mb-4">
                <AlertTriangle size={16} className="text-yellow-400 mr-2" />
                Token Address to Snipe
              </h3>
              <div className="flex">
                <input 
                  type="text" 
                  className="solana-input flex-grow"
                  placeholder="Enter token address to snipe"
                />
                <button className="solana-button ml-2">Add</button>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Watchlist</h4>
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-900 bg-opacity-50">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div>
                            <div className="font-medium">RANDOM1</div>
                            <div className="text-gray-400 text-xs">0x742...8f3d</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-400/20 text-yellow-400">
                            Waiting for Liquidity
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button className="dark-button text-xs py-1">Remove</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div>
                            <div className="font-medium">RANDOM2</div>
                            <div className="text-gray-400 text-xs">0x931...2c7a</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-400/20 text-green-400">
                            Sniped Successfully
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button className="dark-button text-xs py-1">Remove</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-panel h-[700px]">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Sniper Activity</h2>
        </div>
        <div className="p-4 h-[calc(100%-61px)]">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default SniperBot;