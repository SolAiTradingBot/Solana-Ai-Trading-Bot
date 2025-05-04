import React, { useState } from 'react';
import { Brain, BarChart4, Sliders, Zap, Shield, BrainCircuit, Flame, Award, Activity, Info } from 'lucide-react';
import ActivityLog from '../components/ActivityLog';
import SimpleChart from '../components/SimpleChart';

interface Strategy {
  id: string;
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  profitTarget: string;
  timeframe: string;
  aiScore: number;
  enabled: boolean;
}

const AutoTrading: React.FC = () => {
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [aiLevel, setAiLevel] = useState<'standard' | 'advanced'>('standard');
  const [riskLevel, setRiskLevel] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'DeFi Blue Chip Momentum',
      riskLevel: 'Low',
      profitTarget: '10-15%',
      timeframe: 'Weekly',
      aiScore: 87,
      enabled: true
    },
    {
      id: '2',
      name: 'Volatility Breakout',
      riskLevel: 'Medium',
      profitTarget: '15-25%',
      timeframe: 'Daily',
      aiScore: 92,
      enabled: true
    },
    {
      id: '3',
      name: 'NFT Market Sentiment',
      riskLevel: 'Medium',
      profitTarget: '20-30%',
      timeframe: 'Weekly',
      aiScore: 79,
      enabled: false
    },
    {
      id: '4',
      name: 'High-Risk Meme Momentum',
      riskLevel: 'High',
      profitTarget: '50-100%',
      timeframe: 'Daily',
      aiScore: 68,
      enabled: false
    },
  ]);
  
  const [performanceData, setPerformanceData] = useState([
    { value: 100 },
    { value: 104 },
    { value: 102 },
    { value: 107 },
    { value: 111 },
    { value: 109 },
    { value: 114 },
    { value: 118 },
    { value: 122 },
    { value: 125 },
    { value: 128 },
    { value: 132 }
  ]);
  
  const toggleAI = () => {
    setIsAiEnabled(!isAiEnabled);
  };
  
  const toggleStrategy = (id: string) => {
    setStrategies(strategies.map(strat => 
      strat.id === id ? { ...strat, enabled: !strat.enabled } : strat
    ));
  };
  
  const getRiskColor = (risk: 'Low' | 'Medium' | 'High') => {
    switch(risk) {
      case 'Low': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'High': return 'text-red-400 bg-red-400/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="glass-panel solana-gradient-border">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <Brain size={20} className="text-purple-400 mr-2" />
              <h2 className="text-lg font-semibold">AI Auto Trading</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAiEnabled ? 'bg-purple-400/20 text-purple-400' : 'bg-gray-600 text-gray-300'}`}>
                <span className={`h-2 w-2 rounded-full ${isAiEnabled ? 'bg-purple-400' : 'bg-gray-400'} mr-1.5 animate-pulse`}></span>
                {isAiEnabled ? 'AI Active' : 'AI Inactive'}
              </span>
              <button 
                onClick={toggleAI}
                className={`solana-button text-sm py-1 px-3 ${isAiEnabled ? 'bg-red-500 hover:bg-red-600' : ''}`}
              >
                {isAiEnabled ? 'Disable AI' : 'Enable AI'}
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Info size={16} className="text-blue-400 mr-2" />
              <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">Bu sayfa main.py ile entegre çalışabilir</span>
            </div>
            <div className="glass-panel mb-6">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-md font-medium flex items-center">
                  <BarChart4 size={16} className="text-[var(--solana-green)] mr-2" />
                  AI Performance
                </h3>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-baseline mb-4">
                  <div>
                    <span className="text-3xl font-bold">+32.4%</span>
                    <span className="ml-2 text-xs text-green-400">Past 30 days</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-sm">Since activation:</span>
                    <span className="ml-2 font-medium">48 days</span>
                  </div>
                </div>
                <div className="h-40">
                  <SimpleChart data={performanceData} color="#14F195" height={160} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-[var(--bg-dark)] p-4 rounded-lg">
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <Sliders size={16} className="text-blue-400 mr-2" />
                  AI Mode Selection
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 rounded-lg flex flex-col items-center ${
                      aiLevel === 'standard' 
                        ? 'bg-[var(--solana-purple)] bg-opacity-20 border border-[var(--solana-purple)]' 
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                    onClick={() => setAiLevel('standard')}
                  >
                    <Brain size={24} className={`mb-2 ${aiLevel === 'standard' ? 'text-[var(--solana-purple)]' : 'text-gray-400'}`} />
                    <h4 className="font-medium">Standard AI</h4>
                    <p className="text-xs text-gray-400 mt-1 text-center">Balanced performance with moderate risk</p>
                  </button>
                  
                  <button
                    className={`p-4 rounded-lg flex flex-col items-center ${
                      aiLevel === 'advanced' 
                        ? 'bg-[var(--solana-purple)] bg-opacity-20 border border-[var(--solana-purple)]' 
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                    onClick={() => setAiLevel('advanced')}
                  >
                    <BrainCircuit size={24} className={`mb-2 ${aiLevel === 'advanced' ? 'text-[var(--solana-purple)]' : 'text-gray-400'}`} />
                    <h4 className="font-medium">Advanced AI</h4>
                    <p className="text-xs text-gray-400 mt-1 text-center">Higher performance with enhanced risk management</p>
                  </button>
                </div>
              </div>
              
              <div className="bg-[var(--bg-dark)] p-4 rounded-lg">
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <Shield size={16} className="text-emerald-400 mr-2" />
                  Risk Profile
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className={`p-3 rounded-lg flex flex-col items-center ${
                      riskLevel === 'conservative' 
                        ? 'bg-green-500 bg-opacity-20 border border-green-500' 
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                    onClick={() => setRiskLevel('conservative')}
                  >
                    <Shield size={20} className={`mb-1 ${riskLevel === 'conservative' ? 'text-green-400' : 'text-gray-400'}`} />
                    <h4 className="text-sm font-medium">Conservative</h4>
                    <p className="text-xs text-gray-400 mt-1 text-center">Lower risk</p>
                  </button>
                  
                  <button
                    className={`p-3 rounded-lg flex flex-col items-center ${
                      riskLevel === 'balanced' 
                        ? 'bg-yellow-500 bg-opacity-20 border border-yellow-500' 
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                    onClick={() => setRiskLevel('balanced')}
                  >
                    <Activity size={20} className={`mb-1 ${riskLevel === 'balanced' ? 'text-yellow-400' : 'text-gray-400'}`} />
                    <h4 className="text-sm font-medium">Balanced</h4>
                    <p className="text-xs text-gray-400 mt-1 text-center">Moderate risk</p>
                  </button>
                  
                  <button
                    className={`p-3 rounded-lg flex flex-col items-center ${
                      riskLevel === 'aggressive' 
                        ? 'bg-red-500 bg-opacity-20 border border-red-500' 
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                    onClick={() => setRiskLevel('aggressive')}
                  >
                    <Flame size={20} className={`mb-1 ${riskLevel === 'aggressive' ? 'text-red-400' : 'text-gray-400'}`} />
                    <h4 className="text-sm font-medium">Aggressive</h4>
                    <p className="text-xs text-gray-400 mt-1 text-center">Higher risk</p>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-4 flex items-center">
                <Zap size={16} className="text-yellow-400 mr-2" />
                AI Trading Strategies
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase bg-[var(--bg-dark)] text-gray-400">
                    <tr>
                      <th className="px-4 py-3 text-left">Strategy</th>
                      <th className="px-4 py-3 text-left">Risk Level</th>
                      <th className="px-4 py-3 text-left">Profit Target</th>
                      <th className="px-4 py-3 text-left">Timeframe</th>
                      <th className="px-4 py-3 text-left">AI Score</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {strategies.map((strategy) => (
                      <tr key={strategy.id} className="hover:bg-[var(--bg-card)] transition-colors">
                        <td className="px-4 py-3 font-medium">{strategy.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(strategy.riskLevel)}`}>
                            {strategy.riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3">{strategy.profitTarget}</td>
                        <td className="px-4 py-3">{strategy.timeframe}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Award size={14} className={`mr-1 ${
                              strategy.aiScore >= 90 ? 'text-[var(--solana-green)]' : 
                              strategy.aiScore >= 80 ? 'text-blue-400' : 
                              strategy.aiScore >= 70 ? 'text-yellow-400' : 'text-gray-400'
                            }`} />
                            <span>{strategy.aiScore}/100</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <label className="toggle-switch">
                            <input 
                              type="checkbox" 
                              checked={strategy.enabled}
                              onChange={() => toggleStrategy(strategy.id)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-[var(--bg-dark)] p-4 rounded-lg">
              <h3 className="text-md font-medium mb-4 flex items-center">
                <BrainCircuit size={16} className="text-purple-400 mr-2" />
                AI System Control
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Portfolio Allocation (%)</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="10" 
                    defaultValue="60"
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10%</span>
                    <span>60%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Maximum Drawdown (%)</label>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    step="5" 
                    defaultValue="15"
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5%</span>
                    <span>15%</span>
                    <span>30%</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={true} />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="ml-3 text-sm">Automatic profit taking</span>
                </div>
                
                <div className="flex items-center">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={true} />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="ml-3 text-sm">Automatic stop-loss</span>
                </div>
                
                <div className="flex items-center">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={true} />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="ml-3 text-sm">Volatility protection</span>
                </div>
                
                <div className="flex items-center">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={false} />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="ml-3 text-sm">Aggressive position sizing</span>
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
          <h2 className="text-lg font-semibold">AI Activity</h2>
        </div>
        <div className="p-4 h-[calc(100%-61px)]">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default AutoTrading;