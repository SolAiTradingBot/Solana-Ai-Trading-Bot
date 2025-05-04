import React, { useState } from 'react';
import { Rocket, Workflow, LineChart, FileText, Target, Clock, TrendingUp, Info } from 'lucide-react';
import ActivityLog from '../components/ActivityLog';

const MemeTokenBot: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [analyzerResults, setAnalyzerResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socialSentiment, setSocialSentiment] = useState({
    twitter: 78,
    telegram: 65,
    discord: 82,
    reddit: 59
  });
  
  const handleAnalyze = () => {
    setIsLoading(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setAnalyzerResults([
        'MEMECOIN (0x742...8f3d)',
        'FROGGY (0x931...2c7a)',
        'MOONSAIL (0x387...1d4e)'
      ]);
      setIsLoading(false);
    }, 2000);
  };
  
  const TabButton = ({ id, label, icon }: { id: string, label: string, icon: React.ReactNode }) => (
    <button
      className={`flex items-center py-2 px-4 ${
        activeTab === id 
          ? 'border-b-2 border-[var(--solana-purple)] text-white' 
          : 'text-gray-400 hover:text-gray-300'
      }`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="glass-panel solana-gradient-border">
          <div className="p-4 border-b border-gray-700 flex items-center">
            <Rocket size={20} className="text-red-400 mr-2" />
            <h2 className="text-lg font-semibold">Meme Token Bot</h2>
          </div>
          
          <div className="border-b border-gray-700">
            <div className="flex overflow-x-auto">
              <TabButton id="analyzer" label="Token Analyzer" icon={<Target size={16} />} />
              <TabButton id="sentiment" label="Social Sentiment" icon={<TrendingUp size={16} />} />
              <TabButton id="strategies" label="Trading Strategies" icon={<Workflow size={16} />} />
              <TabButton id="reports" label="Performance" icon={<FileText size={16} />} />
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Info size={16} className="text-blue-400 mr-2" />
              <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">Bu sayfa main.py ile entegre çalışabilir</span>
            </div>
            {activeTab === 'analyzer' && (
              <div>
                <h3 className="text-md font-medium mb-4">Meme Token Analyzer</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Automatically identify promising meme tokens by analyzing on-chain data, liquidity, and social media engagement.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Minimum Liquidity (SOL)</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Minimum Holder Count</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Max Token Age (hours)</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="24"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Social Media Score (min)</label>
                    <input 
                      type="text" 
                      className="solana-input"
                      defaultValue="75"
                    />
                  </div>
                </div>
                
                <div className="flex mb-6">
                  <button 
                    className="solana-button flex items-center" 
                    onClick={handleAnalyze}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <LineChart size={18} className="mr-2" />
                        Analyze New Tokens
                      </>
                    )}
                  </button>
                </div>
                
                {analyzerResults.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Promising Tokens Identified</h4>
                    <div className="border border-gray-700 rounded-lg divide-y divide-gray-700">
                      {analyzerResults.map((token, index) => (
                        <div key={index} className="p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{token.split(' ')[0]}</div>
                            <div className="text-gray-400 text-xs">{token.split(' ')[1]}</div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="dark-button text-xs py-1">Details</button>
                            <button className="solana-button text-xs py-1">Trade</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'sentiment' && (
              <div>
                <h3 className="text-md font-medium mb-4">Social Sentiment Analysis</h3>
                <p className="text-sm text-gray-300 mb-6">
                  Real-time sentiment analysis of meme tokens across social media platforms.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="glass-panel p-4">
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Twitter Sentiment
                    </h4>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-400/20 text-green-400">
                            Bullish
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-white">
                            {socialSentiment.twitter}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                        <div style={{ width: `${socialSentiment.twitter}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-blue-400"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Based on 12,546 tweets in the last 24 hours</p>
                  </div>
                  
                  <div className="glass-panel p-4">
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm3.224 17.871c.188.308.39.582.597.846.171.22.18.496.023.708l-.476 1.284c-.05.13-.155.29-.4.293-.822.01-1.615-.21-2.3-.64-1.16.54-2.418.83-3.685.83h-.08c-4.085 0-7.4-3.278-7.4-7.32 0-4.038 3.315-7.32 7.4-7.32s7.405 3.281 7.405 7.32c0 2.15-.938 4.087-2.395 5.416.035-.012-.002-.037-.033-.08z"/>
                      </svg>
                      Telegram Sentiment
                    </h4>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-yellow-400/20 text-yellow-400">
                            Neutral
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-white">
                            {socialSentiment.telegram}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                        <div style={{ width: `${socialSentiment.telegram}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-400 to-orange-400"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Based on 78 telegram groups and channels</p>
                  </div>
                  
                  <div className="glass-panel p-4">
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" viewBox="0 0 71 55" fill="currentColor">
                        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978Z"/>
                      </svg>
                      Discord Sentiment
                    </h4>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-400/20 text-green-400">
                            Bullish
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-white">
                            {socialSentiment.discord}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                        <div style={{ width: `${socialSentiment.discord}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Based on 35 discord servers with 120k+ members</p>
                  </div>
                  
                  <div className="glass-panel p-4">
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                      </svg>
                      Reddit Sentiment
                    </h4>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-yellow-400/20 text-yellow-400">
                            Neutral
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-white">
                            {socialSentiment.reddit}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                        <div style={{ width: `${socialSentiment.reddit}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-400 to-red-400"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Based on 24 subreddits with 1.2M+ subscribers</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'strategies' && (
              <div>
                <h3 className="text-md font-medium mb-4">Trading Strategies</h3>
                <p className="text-sm text-gray-300 mb-6">
                  Configure custom trading strategies for meme tokens with AI optimization.
                </p>
                
                <div className="glass-panel p-4 mb-6">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Clock size={16} className="mr-2 text-blue-400" />
                    Early Stage Meme Sniper
                  </h4>
                  <p className="text-xs text-gray-300 mb-4">
                    Target newly launched meme tokens with high social engagement and rapidly growing liquidity.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Position Size (% of wallet)</label>
                      <input type="range" min="1" max="20" defaultValue="5" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>1%</span>
                        <span>5%</span>
                        <span>20%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Take Profit Target</label>
                      <input type="range" min="1" max="10" defaultValue="3" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>1x</span>
                        <span>3x</span>
                        <span>10x</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="solana-button text-xs">Activate Strategy</button>
                  </div>
                </div>
                
                <div className="glass-panel p-4">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <TrendingUp size={16} className="mr-2 text-green-400" />
                    Trending Meme Momentum
                  </h4>
                  <p className="text-xs text-gray-300 mb-4">
                    Follow established meme tokens showing strong momentum based on volume and social metrics.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Position Size (% of wallet)</label>
                      <input type="range" min="1" max="30" defaultValue="10" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>1%</span>
                        <span>10%</span>
                        <span>30%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Entry Momentum Threshold</label>
                      <input type="range" min="1" max="10" defaultValue="7" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="dark-button text-xs">Activate Strategy</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reports' && (
              <div>
                <h3 className="text-md font-medium mb-4">Performance Reports</h3>
                <p className="text-sm text-gray-300 mb-6">
                  Track your meme token trading performance with detailed analytics.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="glass-panel p-4">
                    <h4 className="text-sm font-medium mb-3">Top Performers</h4>
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase text-gray-400">
                        <tr>
                          <th className="text-left pb-2">Token</th>
                          <th className="text-right pb-2">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-gray-700">
                          <td className="py-2">BONK</td>
                          <td className="text-right text-green-400">+285.4%</td>
                        </tr>
                        <tr className="border-t border-gray-700">
                          <td className="py-2">SAMO</td>
                          <td className="text-right text-green-400">+142.8%</td>
                        </tr>
                        <tr className="border-t border-gray-700">
                          <td className="py-2">FLOKI</td>
                          <td className="text-right text-green-400">+98.3%</td>
                        </tr>
                        <tr className="border-t border-gray-700">
                          <td className="py-2">POPCAT</td>
                          <td className="text-right text-green-400">+76.5%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="glass-panel p-4">
                    <h4 className="text-sm font-medium mb-3">Monthly Performance</h4>
                    <div className="h-40 bg-[var(--bg-dark)] rounded-lg flex items-center justify-center">
                      <p className="text-xs text-gray-400">Interactive performance chart would appear here</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <p className="text-xs text-gray-400">Monthly profit</p>
                        <p className="text-green-400 font-medium">+14.2 SOL</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Win rate</p>
                        <p className="font-medium">68%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Trades</p>
                        <p className="font-medium">34</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="dark-button flex items-center">
                  <FileText size={16} className="mr-2" />
                  Export Detailed Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="glass-panel h-[700px]">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Meme Token Activity</h2>
        </div>
        <div className="p-4 h-[calc(100%-61px)]">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default MemeTokenBot;