import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Computer, Moon, SunMoon, Code, Users, RefreshCw, Clock, DollarSign, Wallet, Info } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const TabButton = ({ id, label, icon }: { id: string, label: string, icon: React.ReactNode }) => (
    <button
      className={`flex items-center py-2 px-4 text-sm ${
        activeTab === id 
          ? 'bg-[var(--bg-card)] text-white rounded-t-lg' 
          : 'text-gray-400 hover:text-gray-300'
      }`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="glass-panel solana-gradient-border">
      <div className="p-4 border-b border-gray-700 flex items-center">
        <SettingsIcon size={20} className="text-gray-400 mr-2" />
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>
      
      <div className="flex overflow-x-auto border-b border-gray-700">
        <TabButton id="general" label="General" icon={<Computer size={16} />} />
        <TabButton id="wallet" label="Wallet" icon={<Wallet size={16} />} />
        <TabButton id="notifications" label="Notifications" icon={<Bell size={16} />} />
        <TabButton id="security" label="Security" icon={<Shield size={16} />} />
        <TabButton id="api" label="API" icon={<Code size={16} />} />
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Info size={16} className="text-blue-400 mr-2" />
          <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">Bu sayfa main.py ile entegre çalışabilir</span>
        </div>
        {activeTab === 'general' && (
          <div>
            <h3 className="text-lg font-medium mb-6">General Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-4">Appearance</h4>
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <Moon size={18} className="text-blue-400 mr-3" />
                    <span>Dark Mode</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <SunMoon size={18} className="text-yellow-400 mr-3" />
                    <span>Reduce Motion</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-4">Trading Preferences</h4>
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <RefreshCw size={18} className="text-green-400 mr-3" />
                    <span>Auto-refresh data</span>
                  </div>
                  <select className="solana-input py-1 px-3 w-32">
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                    <option value="30" selected>30 seconds</option>
                    <option value="60">60 seconds</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <Clock size={18} className="text-purple-400 mr-3" />
                    <span>Time zone</span>
                  </div>
                  <select className="solana-input py-1 px-3 w-48">
                    <option value="utc">UTC</option>
                    <option value="est" selected>Eastern Time (EST)</option>
                    <option value="pst">Pacific Time (PST)</option>
                    <option value="gmt">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <DollarSign size={18} className="text-amber-400 mr-3" />
                    <span>Currency display</span>
                  </div>
                  <select className="solana-input py-1 px-3 w-32">
                    <option value="usd" selected>USD</option>
                    <option value="eur">EUR</option>
                    <option value="gbp">GBP</option>
                    <option value="jpy">JPY</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-4">Notifications</h4>
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <Bell size={18} className="text-yellow-400 mr-3" />
                    <span>Trade notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-4">
                <button className="dark-button">Reset to Defaults</button>
                <button className="solana-button">Save Changes</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'wallet' && (
          <div>
            <h3 className="text-lg font-medium mb-6">Wallet Settings</h3>
            
            <div className="glass-panel mb-6">
              <div className="p-4 border-b border-gray-700">
                <h4 className="font-medium">Connected Wallet</h4>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--solana-purple)] to-[var(--solana-green)] flex items-center justify-center">
                      <Wallet size={20} className="text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Phantom Wallet</p>
                      <p className="text-sm text-gray-400">AB3D...F21E</p>
                    </div>
                  </div>
                  <button className="dark-button text-sm">Disconnect</button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-4">Transaction Settings</h4>
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Default gas priority</span>
                  </div>
                  <select className="solana-input py-1 px-3 w-40">
                    <option value="low">Low (1x)</option>
                    <option value="medium" selected>Medium (1.5x)</option>
                    <option value="high">High (2x)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Auto-Confirm Transactions</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Transaction timeout (seconds)</span>
                  </div>
                  <input type="number" className="solana-input py-1 px-3 w-24" defaultValue={30} min={15} max={120} />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-4">
                <button className="dark-button">Reset to Defaults</button>
                <button className="solana-button">Save Changes</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div>
            <h3 className="text-lg font-medium mb-6">Notification Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-4">Email Notifications</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <input type="email" className="solana-input" defaultValue="user@example.com" />
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Trade Execution</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Profit/Loss Alerts</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>System Alerts</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-4">Push Notifications</h4>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Enable Push Notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Trade Execution</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Profit/Loss Alerts</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-4">
                <button className="dark-button">Reset to Defaults</button>
                <button className="solana-button">Save Changes</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div>
            <h3 className="text-lg font-medium mb-6">Security Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-4">Two-Factor Authentication</h4>
                <div className="p-4 border border-gray-700 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">2FA Authentication</h5>
                      <p className="text-sm text-gray-400 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-4">Session Security</h4>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Auto-logout after inactivity</span>
                  </div>
                  <select className="solana-input py-1 px-3 w-40">
                    <option value="5">5 minutes</option>
                    <option value="15" selected>15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Require password for trades</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-4">API Keys</h4>
                <button className="dark-button flex items-center">
                  <Shield size={16} className="mr-2" />
                  Manage API Keys
                </button>
              </div>
              
              <div className="pt-4 flex justify-end space-x-4">
                <button className="dark-button">Reset to Defaults</button>
                <button className="solana-button">Save Changes</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'api' && (
          <div>
            <h3 className="text-lg font-medium mb-6">API Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-4">API Keys</h4>
                <div className="glass-panel mb-4">
                  <div className="p-4 border-b border-gray-700">
                    <h5 className="font-medium">API Access Keys</h5>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">API Key</label>
                      <div className="flex">
                        <input type="text" className="solana-input flex-grow" value="sk_live_••••••••••••••••••••••••••" readOnly />
                        <button className="dark-button ml-2">Copy</button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Secret Key</label>
                      <div className="flex">
                        <input type="text" className="solana-input flex-grow" value="sk_secret_••••••••••••••••••••••••••" readOnly />
                        <button className="dark-button ml-2">Copy</button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="dark-button text-sm">Reveal Keys</button>
                      <button className="dark-button text-sm text-yellow-400">Regenerate Keys</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-4">API Permissions</h4>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Read Market Data</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Place Trades</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <span>Withdraw Funds</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-4">Rate Limits</h4>
                <div className="glass-panel p-4 text-sm">
                  <div className="flex justify-between mb-2">
                    <span>Total Rate Limit:</span>
                    <span className="font-medium">100 requests/minute</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Trading API Limit:</span>
                    <span className="font-medium">20 requests/minute</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Data API Limit:</span>
                    <span className="font-medium">80 requests/minute</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-4">
                <button className="dark-button">Reset to Defaults</button>
                <button className="solana-button">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button className="solana-button bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1" onClick={() => alert('main.py çalıştırılacak (örnek)')}>main.py Çalıştır</button>
      </div>
    </div>
  );
};

export default Settings;