import React, { useState, useEffect, useRef } from 'react';
import { Check, AlertTriangle, Info, DollarSign } from 'lucide-react';

interface LogEntry {
  id: number;
  type: 'success' | 'warning' | 'info' | 'transaction';
  message: string;
  timestamp: Date;
}

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  const getRandomSuccessMessage = () => {
    const tokens = ['SOL', 'BONK', 'JUP', 'RAY', 'PYTH', 'MNGO', 'SAMO'];
    const actions = [
      `Bought ${(Math.random() * 100).toFixed(2)} ${tokens[Math.floor(Math.random() * tokens.length)]} at ${(Math.random() * 10).toFixed(4)} SOL`,
      `Sold ${(Math.random() * 1000).toFixed(2)} ${tokens[Math.floor(Math.random() * tokens.length)]} for ${(Math.random() * 5).toFixed(4)} SOL profit`,
      `Identified arbitrage opportunity on ${tokens[Math.floor(Math.random() * tokens.length)]}`,
      `Sniped new token launch: ${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      `Successfully executed ${tokens[Math.floor(Math.random() * tokens.length)]} trade with 0.${Math.floor(Math.random() * 100)}% slippage`,
      `Detected price movement - ${tokens[Math.floor(Math.random() * tokens.length)]} increased by ${(Math.random() * 10).toFixed(2)}%`,
      `Bot analyzed ${tokens[Math.floor(Math.random() * tokens.length)]} market depth - signaling high liquidity`
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  };
  
  const getRandomWarningMessage = () => {
    const warnings = [
      "High market volatility detected - adjusting trade parameters",
      "Network congestion - increasing gas price for faster execution",
      "Price slippage exceeding threshold - trade delayed",
      "Liquidity pool imbalance detected - approach with caution",
      "Unusual trading volume detected - monitoring for potential rug pull",
      "Wallet balance running low - consider deposit",
      "RPC endpoint latency increased - switched to backup"
    ];
    return warnings[Math.floor(Math.random() * warnings.length)];
  };
  
  const getRandomInfoMessage = () => {
    const infos = [
      "AI model recalibrating based on market conditions",
      "Updated strategy parameters based on 24h performance",
      "New token listing detected - analyzing fundamentals",
      "Bot uptime: 12 hours, 34 minutes",
      "Strategy optimization in progress - balancing risk profile",
      "Market sentiment analysis completed - bullish signals detected",
      "System update applied successfully"
    ];
    return infos[Math.floor(Math.random() * infos.length)];
  };
  
  const getRandomTransactionMessage = () => {
    return `Transaction hash: ${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`;
  };

  useEffect(() => {
    // Initial logs
    const initialLogs = [
      { id: 1, type: 'info' as const, message: 'Bot system initialized', timestamp: new Date(Date.now() - 5000) },
      { id: 2, type: 'info' as const, message: 'Connected to Solana mainnet', timestamp: new Date(Date.now() - 4000) },
      { id: 3, type: 'success' as const, message: 'Wallet connection established', timestamp: new Date(Date.now() - 3000) },
      { id: 4, type: 'transaction' as const, message: 'Transaction hash: 7xG3H9z...8yT4R1p', timestamp: new Date(Date.now() - 2000) },
      { id: 5, type: 'info' as const, message: 'AI trading model activated', timestamp: new Date(Date.now() - 1000) },
    ];
    setLogs(initialLogs);
    
    // Generate random logs
    const logInterval = setInterval(() => {
      const logTypes = ['success', 'warning', 'info', 'transaction'];
      const type = logTypes[Math.floor(Math.random() * logTypes.length)] as 'success' | 'warning' | 'info' | 'transaction';
      
      let message = '';
      switch(type) {
        case 'success':
          message = getRandomSuccessMessage();
          break;
        case 'warning':
          message = getRandomWarningMessage();
          break;
        case 'info':
          message = getRandomInfoMessage();
          break;
        case 'transaction':
          message = getRandomTransactionMessage();
          break;
      }
      
      setLogs(prevLogs => {
        const newLog = {
          id: Date.now(),
          type,
          message,
          timestamp: new Date()
        };
        
        // Keep max 100 logs
        const updatedLogs = [newLog, ...prevLogs].slice(0, 100);
        return updatedLogs;
      });
    }, 3000);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    // Auto scroll to bottom for new logs
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  const getIconForType = (type: string) => {
    switch(type) {
      case 'success':
        return <Check size={16} className="text-green-400" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'info':
        return <Info size={16} className="text-blue-400" />;
      case 'transaction':
        return <DollarSign size={16} className="text-purple-400" />;
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Activity Log</h3>
        <div className="flex space-x-2">
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Success</span>
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Warning</span>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Info</span>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">TX</span>
        </div>
      </div>
      <div 
        ref={logContainerRef}
        className="flex-1 overflow-y-auto border border-gray-700 rounded-lg bg-[var(--bg-dark)] p-2 text-sm"
      >
        {logs.map((log) => (
          <div 
            key={log.id} 
            className="p-2 border-b border-gray-700 last:border-0 flex items-start animate-[fadeIn_0.3s_ease-in-out]"
          >
            <span className="mr-2 mt-1">{getIconForType(log.type)}</span>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">{log.message}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;