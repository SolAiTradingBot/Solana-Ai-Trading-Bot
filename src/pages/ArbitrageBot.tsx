import React, { useState } from 'react';
import { Repeat, AlertTriangle, BarChart4, ArrowLeftRight, Zap, Wallet, Info } from 'lucide-react';
import ActivityLog from '../components/ActivityLog';
import SimpleChart from '../components/SimpleChart';

interface ExchangePair {
  id: string;
  exchange1: string;
  exchange2: string;
  token: string;
  spread: string;
  volume24h: string;
  status: 'active' | 'inactive';
}

const ArbitrageBot: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState({
    minSpread: '0.5',
    maxSlippage: '0.2',
    gasMultiplier: '1.2',
    maxConcurrent: '3',
    minLiquidity: '10000'
  });
  
  const [pairs, setPairs] = useState<ExchangePair[]>([
    { 
      id: '1', 
      exchange1: 'Jupiter', 
      exchange2: 'Orca', 
      token: 'SOL/USDC', 
      spread: '0.62%', 
      volume24h: '425,890', 
      status: 'active' 
    },
    { 
      id: '2', 
      exchange1: 'Raydium', 
      exchange2: 'Jupiter', 
      token: 'JUP/USDC', 
      spread: '0.48%', 
      volume24h: '182,356', 
      status: 'active' 
    },
    { 
      id: '3', 
      exchange1: 'Orca', 
      exchange2: 'Raydium', 
      token: 'BONK/USDC', 
      spread: '0.83%', 
      volume24h: '934,125', 
      status: 'active' 
    },
    { 
      id: '4', 
      exchange1: 'Jupiter', 
      exchange2: 'Raydium', 
      token: 'RAY/USDC', 
      spread: '0.35%', 
      volume24h: '96,450', 
      status: 'inactive' 
    },
  ]);
  
  const [arbitrageData, setArbitrageData] = useState([
    { value: 0.42 },
    { value: 0.51 },
    { value: 0.38 },
    { value: 0.67 },
    { value: 0.58 },
    { value: 0.72 },
    { value: 0.64 },
    { value: 0.53 },
    { value: 0.48 },
    { value: 0.59 }
  ]);
  
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const togglePairStatus = (id: string) => {
    setPairs(pairs.map(pair => 
      pair.id === id 
        ? { ...pair, status: pair.status === 'active' ? 'inactive' : 'active' } 
        : pair
    ));
  };
  
  const toggleBot = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="glass-panel solana-gradient-border">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <Repeat size={20} className="text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold">Arbitrage Bot</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-400/20 text-green-400' : 'bg-gray-600 text-gray-300'}`}>
                <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'} mr-1.5 animate-pulse`}></span>
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <button 
                onClick={toggleBot}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="glass-panel">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-md font-medium flex items-center">
                    <BarChart4 size={16} className="text-[var(--solana-purple)] mr-2" />
                    Average Arbitrage Spread (%)
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">0.58%</span>
                    <span className="ml-2 text-xs text-green-400">+0.12%</span>
                  </div>
                  <div className="mt-4 h-32">
                    <SimpleChart data={arbitrageData} color="#9945FF" height={120} />
                  </div>
                </div>
              </div>
              
              <div className="glass-panel">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-md font-medium flex items-center">
                    <Wallet size={16} className="text-[var(--solana-green)] mr-2" />
                    Arbitrage Statistics
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Daily profit</p>
                      <p className="text-xl font-bold text-green-400">+0.86 SOL</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Success rate</p>
                      <p className="text-xl font-bold">94.2%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total trades</p>
                      <p className="text-xl font-bold">142</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Avg. trade duration</p>
                      <p className="text-xl font-bold">3.2s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--bg-dark)] p-4 rounded-lg mb-6">
              <h3 className="text-md font-medium mb-4 flex items-center">
                <Zap size={16} className="text-yellow-400 mr-2" />
                Arbitrage Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Minimum Spread (%)</label>
                  <input 
                    type="text" 
                    name="minSpread"
                    className="solana-input"
                    value={settings.minSpread}
                    onChange={handleSettingChange}
                  />
                  <p className="mt-1 text-xs text-gray-400">Minimum profitable spread</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Max Slippage (%)</label>
                  <input 
                    type="text" 
                    name="maxSlippage"
                    className="solana-input"
                    value={settings.maxSlippage}
                    onChange={handleSettingChange}
                  />
                  <p className="mt-1 text-xs text-gray-400">Maximum allowed slippage</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Gas Multiplier</label>
                  <input 
                    type="text" 
                    name="gasMultiplier"
                    className="solana-input"
                    value={settings.gasMultiplier}
                    onChange={handleSettingChange}
                  />
                  <p className="mt-1 text-xs text-gray-400">Transaction priority</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Max Concurrent Trades</label>
                  <input 
                    type="text" 
                    name="maxConcurrent"
                    className="solana-input"
                    value={settings.maxConcurrent}
                    onChange={handleSettingChange}
                  />
                  <p className="mt-1 text-xs text-gray-400">Maximum simultaneous trades</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Min Liquidity (USDC)</label>
                  <input 
                    type="text" 
                    name="minLiquidity"
                    className="solana-input"
                    value={settings.minLiquidity}
                    onChange={handleSettingChange}
                  />
                  <p className="mt-1 text-xs text-gray-400">Minimum pool liquidity</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-4 flex items-center">
                <ArrowLeftRight size={16} className="text-blue-400 mr-2" />
                Exchange Pairs
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase bg-[var(--bg-dark)] text-gray-400">
                    <tr>
                      <th className="px-4 py-3 text-left">Pair</th>
                      <th className="px-4 py-3 text-left">Token</th>
                      <th className="px-4 py-3 text-left">Spread</th>
                      <th className="px-4 py-3 text-left">24h Volume</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {pairs.map((pair) => (
                      <tr key={pair.id} className="hover:bg-[var(--bg-card)] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Repeat size={16} className="text-blue-400 mr-2" />
                            <span>{pair.exchange1} ↔ {pair.exchange2}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{pair.token}</td>
                        <td className="px-4 py-3 text-green-400">{pair.spread}</td>
                        <td className="px-4 py-3">{pair.volume24h}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            pair.status === 'active' 
                              ? 'bg-green-400/20 text-green-400' 
                              : 'bg-gray-600/20 text-gray-400'
                          }`}>
                            {pair.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            className="dark-button text-xs py-1"
                            onClick={() => togglePairStatus(pair.id)}
                          >
                            {pair.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mt-4">
                <button className="solana-button flex items-center text-sm">
                  <span className="mr-2">+</span> Add Exchange Pair
                </button>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-500/10 border border-yellow-600/30 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400">Arbitrage Risk Notice</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Arbitrage opportunities can close rapidly due to market efficiency. Ensure your settings 
                    account for transaction costs, slippage, and network congestion to maintain profitability.
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
          <h2 className="text-lg font-semibold">Arbitrage Activity</h2>
        </div>
        <div className="p-4 h-[calc(100%-61px)]">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default ArbitrageBot;