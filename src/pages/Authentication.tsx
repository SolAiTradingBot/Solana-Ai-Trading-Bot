import React, { useState } from 'react';
import { Bot, EyeOff, Eye, Key, Wallet, Info } from 'lucide-react';

interface AuthenticationProps {
  onAuthenticate: () => void;
}

const Authentication: React.FC<AuthenticationProps> = ({ onAuthenticate }) => {
  const [authMethod, setAuthMethod] = useState<'privateKey' | 'phantom'>('privateKey');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = () => {
    setError('');
    setIsLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      if (authMethod === 'privateKey' && (!privateKey || privateKey.length < 10)) {
        setError('Please enter a valid private key');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
      onAuthenticate();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)]">
      <div className="glass-panel w-full max-w-md p-8 solana-gradient-border">
        <div className="flex items-center mb-4">
          <Info size={16} className="text-blue-400 mr-2" />
          <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">Bu sayfa main.py ile entegre çalışabilir</span>
        </div>
        <div className="flex flex-col items-center mb-8">
          <Bot size={48} className="text-[var(--solana-purple)] mb-2" />
          <h1 className="text-2xl font-bold solana-gradient-text">SolanaBot</h1>
          <p className="text-gray-400 text-sm mt-1">AI-Powered Trading</p>
        </div>
        
        <div className="flex justify-center mb-6">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${authMethod === 'privateKey' ? 'bg-[var(--solana-purple)] text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setAuthMethod('privateKey')}
          >
            <div className="flex items-center">
              <Key size={16} className="mr-2" />
              Private Key
            </div>
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${authMethod === 'phantom' ? 'bg-[var(--solana-purple)] text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setAuthMethod('phantom')}
          >
            <div className="flex items-center">
              <Wallet size={16} className="mr-2" />
              Phantom Wallet
            </div>
          </button>
        </div>
        
        {authMethod === 'privateKey' ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Private Key</label>
            <div className="relative">
              <input
                type={showPrivateKey ? 'text' : 'password'}
                className="solana-input"
                placeholder="Enter your private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">Your private key is securely encrypted and never shared.</p>
          </div>
        ) : (
          <div className="mb-6 border border-gray-700 p-4 rounded-lg bg-gray-800">
            <p className="text-center text-sm text-gray-300 mb-4">Connect to your Phantom wallet to continue.</p>
            <div className="flex justify-center">
              <img src="https://phantom.app/img/phantom-logo.svg" alt="Phantom" className="h-10" />
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <button 
          className="solana-button w-full"
          onClick={handleConnect}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-400">
            By connecting your wallet, you agree to our <a href="#" className="text-[var(--solana-purple)] hover:underline">Terms of Service</a> and <a href="#" className="text-[var(--solana-purple)] hover:underline">Privacy Policy</a>.
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <button className="solana-button bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1" onClick={() => alert('main.py çalıştırılacak (örnek)')}>main.py Çalıştır</button>
        </div>
      </div>
    </div>
  );
};

export default Authentication;