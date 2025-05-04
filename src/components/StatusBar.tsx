import React, { useState, useEffect } from 'react';
import { Wallet, Cpu, Zap, DollarSign } from 'lucide-react';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [balance, setBalance] = useState('25.43');
  const [profit, setProfit] = useState('3.28');
  const [isProfitPositive, setIsProfitPositive] = useState(true);
  const [activeTradesCount, setActiveTradesCount] = useState(3);
  const [perfStatus, setPerfStatus] = useState('Optimal');

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Simulate changing values
    const simulateChanges = setInterval(() => {
      // Simulate balance changes
      const newBalance = (parseFloat(balance) + (Math.random() * 0.2 - 0.1)).toFixed(2);
      setBalance(newBalance);
      
      // Simulate profit changes
      const profitChange = (Math.random() * 0.15 - 0.07);
      const newProfit = (parseFloat(profit) + profitChange).toFixed(2);
      setProfit(newProfit);
      setIsProfitPositive(parseFloat(newProfit) > 0);
      
      // Simulate active trades
      if (Math.random() > 0.7) {
        setActiveTradesCount(prev => Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
      
      // Simulate performance status
      if (Math.random() > 0.9) {
        const statuses = ['Optimal', 'Good', 'High Load'];
        setPerfStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(simulateChanges);
    };
  }, [balance, profit]);

  return (
    <div className="bg-[var(--bg-card)] border-b border-gray-700 p-2 px-4 flex justify-between items-center text-sm">
      <div className="flex items-center">
        <span className="flex items-center mr-6">
          <Wallet size={16} className="mr-2 text-[var(--solana-purple)]" />
          <span className="hidden md:inline">Balance:</span> 
          <span className="font-medium ml-1">{balance} SOL</span>
        </span>
        <span className="flex items-center">
          <DollarSign size={16} className="mr-2 text-[var(--solana-green)]" />
          <span className="hidden md:inline">Profit:</span>
          <span className={`font-medium ml-1 ${isProfitPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isProfitPositive ? '+' : ''}{profit} SOL
          </span>
        </span>
      </div>
      
      <div className="flex items-center">
        <span className="flex items-center mr-6">
          <Zap size={16} className="mr-2 text-yellow-400" />
          <span className="hidden md:inline">Active Trades:</span>
          <span className="font-medium ml-1">{activeTradesCount}</span>
        </span>
        <span className="flex items-center mr-6">
          <Cpu size={16} className="mr-2 text-blue-400" />
          <span className="hidden md:inline">Performance:</span>
          <span className="font-medium ml-1">{perfStatus}</span>
        </span>
        <span className="font-mono">
          {time.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;