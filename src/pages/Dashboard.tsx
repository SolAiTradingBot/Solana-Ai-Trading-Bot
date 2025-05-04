import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Wallet, 
  CreditCard, 
  BrainCircuit,
  BarChart4,
  Info
} from 'lucide-react';
import ActivityLog from '../components/ActivityLog';
import StatCard from '../components/StatCard';
import SimpleChart from '../components/SimpleChart';
import TransactionTable from '../components/TransactionTable';
import TokenPriceCard from '../components/TokenPriceCard';

const Dashboard: React.FC = () => {
  const [profitData, setProfitData] = useState<{ value: number }[]>([]);
  const [tradeData, setTradeData] = useState<{ value: number }[]>([]);
  const [volumeData, setVolumeData] = useState<{ value: number }[]>([]);
  
  useEffect(() => {
    // Generate initial chart data
    const generateChartData = (baseline: number, volatility: number, length: number) => {
      return Array.from({ length }, () => ({
        value: baseline + (Math.random() * volatility * 2 - volatility)
      }));
    };
    
    setProfitData(generateChartData(5, 2, 10));
    setTradeData(generateChartData(15, 5, 10));
    setVolumeData(generateChartData(150, 30, 10));
    
    // Update chart data periodically
    const interval = setInterval(() => {
      setProfitData(prev => {
        const newPoint = { value: prev[prev.length - 1].value + (Math.random() * 0.8 - 0.4) };
        const newData = [...prev.slice(1), newPoint];
        return newData;
      });
      
      setTradeData(prev => {
        const lastValue = prev[prev.length - 1].value;
        const newPoint = { value: Math.max(0, lastValue + (Math.random() * 3 - 1.2)) };
        const newData = [...prev.slice(1), newPoint];
        return newData;
      });
      
      setVolumeData(prev => {
        const lastValue = prev[prev.length - 1].value;
        const newPoint = { value: Math.max(0, lastValue + (Math.random() * 20 - 8)) };
        const newData = [...prev.slice(1), newPoint];
        return newData;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Top Stats Section */}
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Profit (24h)" 
          value="3.28 SOL" 
          icon={<BarChart3 size={24} className="text-green-400" />} 
          change="12.4%" 
          positive={true}
          chart={<SimpleChart data={profitData} color="#10B981" />}
        />
        <StatCard 
          title="Active Trades" 
          value="8" 
          icon={<TrendingUp size={24} className="text-blue-400" />} 
          change="3" 
          positive={true}
          chart={<SimpleChart data={tradeData} color="#38BDF8" />}
        />
        <StatCard 
          title="Trading Volume" 
          value="142.6 SOL" 
          icon={<BarChart4 size={24} className="text-purple-400" />} 
          change="8.3%" 
          positive={true}
          chart={<SimpleChart data={volumeData} color="#A78BFA" />}
        />
        <StatCard 
          title="Wallet Balance" 
          value="25.43 SOL" 
          icon={<Wallet size={24} className="text-[var(--solana-purple)]" />} 
        />
        <StatCard 
          title="Average Trade Duration" 
          value="4.2 min" 
          icon={<Clock size={24} className="text-amber-400" />} 
        />
        <StatCard 
          title="AI Performance Score" 
          value="93/100" 
          icon={<BrainCircuit size={24} className="text-indigo-400" />} 
          change="5.2%" 
          positive={true}
        />
      </div>
      
      {/* Activity Feed */}
      <div className="h-[400px]">
        <ActivityLog />
      </div>
      
      {/* Token Price Cards */}
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <TokenPriceCard token="SOL/USD" initialPrice={150.42} />
        <TokenPriceCard token="BONK/USD" initialPrice={0.00002345} />
        <TokenPriceCard token="JUP/USD" initialPrice={1.78} />
        <TokenPriceCard token="RAY/USD" initialPrice={0.83} />
      </div>
      
      {/* Transaction History */}
      <div className="md:col-span-3 glass-panel">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        <TransactionTable />
      </div>

      <div className="flex items-center mb-4">
        <Info size={16} className="text-blue-400 mr-2" />
        <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">Bu sayfa main.py ile entegre çalışabilir</span>
      </div>

      <div className="flex justify-end mt-4">
        <button className="solana-button bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1" onClick={() => alert('main.py çalıştırılacak (örnek)')}>main.py Çalıştır</button>
      </div>
    </div>
  );
};

export default Dashboard;