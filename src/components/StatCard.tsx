import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  positive?: boolean;
  chart?: ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  positive = true,
  chart
}) => {
  return (
    <div className="glass-panel p-4 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
            {change && (
              <span className={`ml-2 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
                {positive ? '+' : ''}{change}
              </span>
            )}
          </div>
        </div>
        <div className="p-2 bg-[var(--bg-dark)] rounded-lg">
          {icon}
        </div>
      </div>
      {chart && <div className="mt-2">{chart}</div>}
    </div>
  );
};

export default StatCard;