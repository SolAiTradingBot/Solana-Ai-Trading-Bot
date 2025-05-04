import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'swap';
  token: string;
  amount: string;
  price: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
}

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortField, setSortField] = useState<keyof Transaction>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Generate sample transaction data
    const tokens = ['SOL', 'BONK', 'JUP', 'RAY', 'PYTH', 'MNGO', 'SAMO'];
    const statuses = ['completed', 'pending', 'failed'];
    const types = ['buy', 'sell', 'swap'];
    
    const sampleTransactions = Array.from({ length: 15 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)] as 'buy' | 'sell' | 'swap';
      const token = tokens[Math.floor(Math.random() * tokens.length)];
      const status = Math.random() > 0.2 ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'failed');
      
      // Generate a time in the last 24 hours
      const now = new Date();
      const timeOffset = Math.floor(Math.random() * 24 * 60); // random minutes in last 24h
      const txTime = new Date(now.getTime() - timeOffset * 60000);
      
      return {
        id: `tx-${i}`,
        type: type as 'buy' | 'sell' | 'swap',
        token,
        amount: (Math.random() * 100).toFixed(2),
        price: (Math.random() * 10).toFixed(4),
        time: txTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: status as 'completed' | 'pending' | 'failed',
        hash: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`
      };
    });
    
    setTransactions(sampleTransactions);
  }, []);

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: keyof Transaction) => {
    if (field !== sortField) return <ChevronDown size={14} opacity={0.3} />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'buy': return 'text-emerald-400';
      case 'sell': return 'text-pink-400';
      case 'swap': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase bg-[var(--bg-dark)] text-gray-400">
          <tr>
            <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('type')}>
              <div className="flex items-center">
                Type {getSortIcon('type')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('token')}>
              <div className="flex items-center">
                Token {getSortIcon('token')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('amount')}>
              <div className="flex items-center">
                Amount {getSortIcon('amount')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('price')}>
              <div className="flex items-center">
                Price (SOL) {getSortIcon('price')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('time')}>
              <div className="flex items-center">
                Time {getSortIcon('time')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('status')}>
              <div className="flex items-center">
                Status {getSortIcon('status')}
              </div>
            </th>
            <th className="px-4 py-3">
              <div className="flex items-center">
                Hash
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((tx) => (
            <tr key={tx.id} className="border-b border-gray-700 hover:bg-[var(--bg-dark)] transition-colors">
              <td className="px-4 py-3">
                <span className={`font-medium ${getTypeColor(tx.type)}`}>{tx.type}</span>
              </td>
              <td className="px-4 py-3">
                {tx.token}
              </td>
              <td className="px-4 py-3">
                {tx.amount}
              </td>
              <td className="px-4 py-3">
                {tx.price}
              </td>
              <td className="px-4 py-3">
                {tx.time}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="font-mono text-xs text-gray-400">{tx.hash}</span>
                  <ExternalLink size={14} className="ml-2 text-blue-400 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;