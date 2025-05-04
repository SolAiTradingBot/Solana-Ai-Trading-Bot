import React, { useState, useEffect } from 'react';
import SimpleChart from './SimpleChart';

interface TokenPriceCardProps {
  token: string;
  initialPrice: number;
}

const TokenPriceCard: React.FC<TokenPriceCardProps> = ({ token, initialPrice }) => {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(0);
  const [chartData, setChartData] = useState([{ value: initialPrice }]);
  const [isPositive, setIsPositive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate price change
      const priceChange = initialPrice * (Math.random() * 0.04 - 0.02); // +/- 2%
      const newPrice = price + priceChange;
      setPrice(newPrice);
      
      // Calculate percentage change
      const percentChange = (priceChange / price) * 100;
      setChange(Math.abs(percentChange));
      setIsPositive(priceChange >= 0);
      
      // Update chart data
      setChartData(prev => {
        const newData = [...prev, { value: newPrice }];
        if (newData.length > 20) {
          return newData.slice(1);
        }
        return newData;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [price, initialPrice]);

  return (
    <div className="glass-panel p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">{token}</h3>
        <div className={`text-xs px-2 py-1 rounded ${isPositive ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
          {isPositive ? '+' : '-'}{change.toFixed(2)}%
        </div>
      </div>
      <p className="text-2xl font-bold mb-2">${price.toFixed(4)}</p>
      <SimpleChart 
        data={chartData}
        color={isPositive ? '#10B981' : '#EF4444'}
        height={60}
      />
    </div>
  );
};

export default TokenPriceCard;